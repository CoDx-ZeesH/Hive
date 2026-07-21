"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { createEventSchema } from "@/lib/validations/event";
import type { EventFormState } from "@/lib/validations/event";

/* ─── Helper: get current DB user ──────────────────────────────────────────── */

async function getDbUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { authId: user.id } });
  if (!dbUser) throw new Error("User profile not found");
  return dbUser;
}

/* ─── Create Event ────────────────────────────────────────────────────────── */

export async function createEventAction(
  _state: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const raw = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    location: formData.get("location") as string,
    isOnline: formData.get("isOnline") as string,
    meetLink: formData.get("meetLink") as string,
    startAt: formData.get("startAt") as string,
    endAt: formData.get("endAt") as string,
    capacity: formData.get("capacity") as string,
    status: (formData.get("status") as string) || "DRAFT",
    communityId: formData.get("communityId") as string,
  };

  // 1. Validate
  const validated = createEventSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  // 2. Auth
  let organizer;
  try {
    organizer = await getDbUser();
  } catch {
    return { message: "You must be signed in to create an event." };
  }

  if (organizer.role !== "ORGANIZER" && organizer.role !== "ADMIN") {
    return { message: "Only organizers and admins can create events." };
  }

  // 3. Resolve communityId (use first membership if not provided)
  let communityId = raw.communityId;
  if (!communityId) {
    const membership = await prisma.membership.findFirst({
      where: { userId: organizer.id, status: "ACTIVE" },
    });
    if (!membership) {
      return { message: "You must be a member of a community to create events." };
    }
    communityId = membership.communityId;
  }

  // 4. Generate slug
  const baseSlug = validated.data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const slug = `${baseSlug}-${Date.now()}`;

  // 5. Create
  try {
    const event = await prisma.event.create({
      data: {
        title: validated.data.title,
        slug,
        description: validated.data.description,
        location: validated.data.location,
        isOnline: validated.data.isOnline,
        meetLink: validated.data.meetLink || null,
        startAt: new Date(validated.data.startAt),
        endAt: new Date(validated.data.endAt),
        capacity: validated.data.capacity ?? null,
        status: validated.data.status as "DRAFT" | "PUBLISHED",
        communityId,
        organizerId: organizer.id,
      },
    });

    revalidatePath("/organizer/events");
    revalidatePath("/member/events");
    return { success: true, eventId: event.id };
  } catch (err) {
    console.error("createEvent error:", err);
    return { message: "Failed to create event. Please try again." };
  }
}

/* ─── RSVP ────────────────────────────────────────────────────────────────── */

export async function rsvpAction(eventId: string): Promise<{ success: boolean; message?: string }> {
  let user;
  try {
    user = await getDbUser();
  } catch {
    return { success: false, message: "You must be signed in to RSVP." };
  }

  // Check existing registration
  const existing = await prisma.registration.findUnique({
    where: { userId_eventId: { userId: user.id, eventId } },
  });

  if (existing) {
    if (existing.status === "REGISTERED") {
      return { success: false, message: "You are already registered for this event." };
    }
    // Re-activate a cancelled registration
    await prisma.registration.update({
      where: { id: existing.id },
      data: { status: "REGISTERED", cancelledAt: null },
    });
  } else {
    // Check capacity
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: { where: { status: "REGISTERED" } } } } },
    });

    if (!event) return { success: false, message: "Event not found." };
    if (event.status !== "PUBLISHED") {
      return { success: false, message: "This event is not open for registration." };
    }

    const isFull =
      event.capacity !== null &&
      event._count.registrations >= event.capacity;

    await prisma.registration.create({
      data: {
        userId: user.id,
        eventId,
        status: isFull ? "WAITLISTED" : "REGISTERED",
      },
    });
  }

  // Award community score for registering
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (event) {
    await prisma.communityScore.create({
      data: {
        userId: user.id,
        communityId: event.communityId,
        action: "ATTEND_EVENT",
        points: 10,
        refId: eventId,
        note: `RSVP'd for ${event.title}`,
      },
    }).catch(() => {/* non-blocking */});
  }

  revalidatePath(`/member/events/${eventId}`);
  revalidatePath("/member/events");
  return { success: true };
}

/* ─── Cancel RSVP ─────────────────────────────────────────────────────────── */

export async function cancelRsvpAction(eventId: string): Promise<{ success: boolean; message?: string }> {
  let user;
  try {
    user = await getDbUser();
  } catch {
    return { success: false, message: "You must be signed in." };
  }

  await prisma.registration.updateMany({
    where: { userId: user.id, eventId, status: { not: "CANCELLED" } },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  });

  revalidatePath(`/member/events/${eventId}`);
  revalidatePath("/member/events");
  return { success: true };
}

/* ─── Mark Attendance ────────────────────────────────────────────────────── */

export async function markAttendanceAction(
  eventId: string,
  scannedToken: string
): Promise<{ success: boolean; message: string; memberName?: string }> {
  let organizer;
  try {
    organizer = await getDbUser();
  } catch {
    return { success: false, message: "Unauthorized" };
  }

  if (organizer.role !== "ORGANIZER" && organizer.role !== "ADMIN") {
    return { success: false, message: "Only organizers can mark attendance." };
  }

  // Find registration by token (qrToken is stored on the event — we encode userId:eventId)
  const [userId] = scannedToken.split(":");
  if (!userId) return { success: false, message: "Invalid QR code." };

  const registration = await prisma.registration.findUnique({
    where: { userId_eventId: { userId, eventId } },
    include: { user: true },
  });

  if (!registration) {
    return { success: false, message: "No registration found for this member." };
  }

  if (registration.status === "CANCELLED") {
    return { success: false, message: "This registration was cancelled." };
  }

  // Upsert attendance record
  await prisma.attendance.upsert({
    where: { userId_eventId: { userId, eventId } },
    create: { userId, eventId, status: "PRESENT" },
    update: { status: "PRESENT", scannedAt: new Date() },
  });

  revalidatePath(`/organizer/events/${eventId}/attendance`);
  return {
    success: true,
    message: `✓ Marked ${registration.user.fullName} as present`,
    memberName: registration.user.fullName,
  };
}
