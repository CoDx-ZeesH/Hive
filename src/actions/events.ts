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
    status: (formData.get("status") as string) || "PENDING",
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

  let finalCommunityId : string | undefined = undefined;
  
  if (raw.communityId && raw.communityId !== "global" && raw.communityId.trim() !== "") {
    finalCommunityId = raw.communityId;
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
        status: validated.data.status,
        communityId: finalCommunityId, // <-- Now this will safely be null for global events!
        organizerId: organizer.id,
      },
    });

    revalidatePath("/organizer/events");
    revalidatePath("/member/events");
    revalidatePath("/admin/events");
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
    if (existing.status === "APPROVED") {
      return { success: false, message: "You are already registered for this event." };
    }
    // Re-activate a cancelled registration
    await prisma.registration.update({
      where: { id: existing.id },
      data: { status: "APPROVED", cancelledAt: null },
    });
  } else {
    // Check capacity
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: { where: { status: "APPROVED" } } } } },
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
        status: isFull ? "WAITLISTED" : "APPROVED",
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

/* ─── Admin: Approve Event ────────────────────────────────────────────────── */

export async function approveEventAction(eventId: string): Promise<{ success: boolean; message?: string }> {
  let admin;
  try {
    admin = await getDbUser();
  } catch {
    return { success: false, message: "Unauthorized" };
  }

  if (admin.role !== "ADMIN") {
    return { success: false, message: "Only administrators can approve events." };
  }

  await prisma.event.update({
    where: { id: eventId },
    data: { status: "PUBLISHED", rejectionReason: null },
  });

  revalidatePath("/admin/events");
  revalidatePath("/organizer/events");
  revalidatePath("/member/events");
  return { success: true, message: "Event approved and published!" };
}

/* ─── Admin: Reject Event ─────────────────────────────────────────────────── */

export async function rejectEventAction(
  eventId: string,
  rejectionReason: string
): Promise<{ success: boolean; message?: string }> {
  let admin;
  try {
    admin = await getDbUser();
  } catch {
    return { success: false, message: "Unauthorized" };
  }

  if (admin.role !== "ADMIN") {
    return { success: false, message: "Only administrators can reject events." };
  }

  if (!rejectionReason || rejectionReason.trim().length === 0) {
    return { success: false, message: "Rejection reason is required." };
  }

  await prisma.event.update({
    where: { id: eventId },
    data: { status: "REJECTED", rejectionReason: rejectionReason.trim() },
  });

  revalidatePath("/admin/events");
  revalidatePath("/organizer/events");
  revalidatePath("/member/events");
  return { success: true, message: "Event rejected." };
}

/* ─── Organizer: Update RSVP Status ───────────────────────────────────────── */

export async function updateRsvpStatusAction(
  registrationId: string,
  newStatus: "APPROVED" | "WAITLISTED" | "CANCELLED" | "ATTENDED"
): Promise<{ success: boolean; message?: string }> {
  let organizer;
  try {
    organizer = await getDbUser();
  } catch {
    return { success: false, message: "Unauthorized" };
  }

  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    include: { event: true },
  });

  if (!registration) {
    return { success: false, message: "Registration not found." };
  }

  if (organizer.role !== "ADMIN" && registration.event.organizerId !== organizer.id) {
    return { success: false, message: "Only the event organizer or admin can modify RSVP status." };
  }

  await prisma.registration.update({
    where: { id: registrationId },
    data: {
      status: newStatus,
      cancelledAt: newStatus === "CANCELLED" ? new Date() : null,
    },
  });

  revalidatePath(`/organizer/events/${registration.eventId}/attendance`);
  revalidatePath(`/organizer/events/${registration.eventId}`);
  return { success: true, message: `RSVP status updated to ${newStatus}` };
}

/* ─── Organizer: Complete Event & Trigger Scoring Engine ───────────────────── */

export async function completeEventAction(eventId: string): Promise<{ success: boolean; message?: string; pointsAwarded?: number }> {
  let organizer;
  try {
    organizer = await getDbUser();
  } catch {
    return { success: false, message: "Unauthorized" };
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      registrations: {
        where: { status: "ATTENDED" },
      },
    },
  });

  if (!event) {
    return { success: false, message: "Event not found." };
  }

  if (organizer.role !== "ADMIN" && event.organizerId !== organizer.id) {
    return { success: false, message: "Only the event organizer or admin can mark this event as completed." };
  }

  // 1. Mark event status as COMPLETED
  await prisma.event.update({
    where: { id: eventId },
    data: { status: "COMPLETED" },
  });

  // 2. Award community scores to all ATTENDED members (50 points per attendee)
  const POINTS_PER_ATTENDANCE = 50;
  let totalPoints = 0;

  for (const reg of event.registrations) {
    // Avoid double scoring if already scored for this event
    const existingScore = await prisma.communityScore.findFirst({
      where: {
        userId: reg.userId,
        communityId: event.communityId,
        action: "ATTEND_EVENT",
        refId: eventId,
      },
    });

    if (!existingScore) {
      await prisma.communityScore.create({
        data: {
          userId: reg.userId,
          communityId: event.communityId,
          action: "ATTEND_EVENT",
          points: POINTS_PER_ATTENDANCE,
          refId: eventId,
          note: `Attended event: ${event.title}`,
        },
      });
      totalPoints += POINTS_PER_ATTENDANCE;
    }
  }

  revalidatePath(`/organizer/events/${eventId}`);
  revalidatePath("/organizer/events");
  revalidatePath("/member/events");
  revalidatePath("/member/leaderboard");
  revalidatePath("/member/profile");

  return {
    success: true,
    message: `✓ Event marked as COMPLETED! Awarded ${totalPoints} total points to ${event.registrations.length} attendee(s).`,
    pointsAwarded: totalPoints,
  };
}
