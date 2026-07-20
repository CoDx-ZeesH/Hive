"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  getCurrentDbUser,
  requireDbUser,
  requireOrganizer,
  hasRole,
} from "@/lib/auth";
import {
  createEventSchema,
  rsvpSchema,
  type EventFormState,
} from "@/lib/validations/events";
import {
  embedCategoryInDescription,
  extractCategoryFromDescription,
  stripCategoryFromDescription,
  generateEventSlug,
  isEventUpcoming,
} from "@/lib/events/utils";
import type { ActionResult } from "@/types";
import type { EventStatus, RegistrationStatus } from "@/generated/prisma/client";

/* ─── Shared Types ─────────────────────────────────────────────────────────── */

export interface EventListItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string;
  startAt: Date;
  endAt: Date;
  location: string | null;
  isOnline: boolean;
  meetLink: string | null;
  status: EventStatus;
  coverUrl: string | null;
  capacity: number | null;
  registrationCount: number;
  isUpcoming: boolean;
  community: {
    id: string;
    name: string;
    slug: string;
  };
  organizer: {
    id: string;
    fullName: string;
  };
}

export interface EventDetail extends EventListItem {
  qrToken: string;
  userRegistration: {
    id: string;
    status: RegistrationStatus;
  } | null;
}

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

function mapEventToListItem(
  event: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    startAt: Date;
    endAt: Date;
    location: string | null;
    isOnline: boolean;
    meetLink: string | null;
    status: EventStatus;
    coverUrl: string | null;
    capacity: number | null;
    community: { id: string; name: string; slug: string };
    organizer: { id: string; fullName: string };
    _count: { registrations: number };
  },
  now = new Date()
): EventListItem {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    description: stripCategoryFromDescription(event.description),
    category: extractCategoryFromDescription(event.description),
    startAt: event.startAt,
    endAt: event.endAt,
    location: event.location,
    isOnline: event.isOnline,
    meetLink: event.meetLink,
    status: event.status,
    coverUrl: event.coverUrl,
    capacity: event.capacity,
    registrationCount: event._count.registrations,
    isUpcoming: isEventUpcoming(event.startAt, now),
    community: event.community,
    organizer: event.organizer,
  };
}

async function getOrganizerCommunities(userId: string, role: string) {
  if (role === "ADMIN") {
    return prisma.community.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    });
  }

  const memberships = await prisma.membership.findMany({
    where: {
      userId,
      status: "ACTIVE",
      role: { in: ["ORGANIZER", "ADMIN"] },
    },
    include: {
      community: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  return memberships.map((m) => m.community);
}

/* ─── Create Event ─────────────────────────────────────────────────────────── */

export async function createEventAction(
  _state: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  let organizer;
  try {
    organizer = await requireOrganizer();
  } catch {
    return { message: "You must be an organizer to create events." };
  }

  const raw = {
    title: formData.get("title") as string,
    description: (formData.get("description") as string) ?? "",
    communityId: formData.get("communityId") as string,
    category: (formData.get("category") as string) || "COMMUNITY",
    location: (formData.get("location") as string) ?? "",
    isOnline: formData.get("isOnline") === "true",
    meetLink: (formData.get("meetLink") as string) ?? "",
    startAt: formData.get("startAt") as string,
    endAt: formData.get("endAt") as string,
    capacity: formData.get("capacity") as string,
    status: (formData.get("status") as string) || "DRAFT",
  };

  const validated = createEventSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const communities = await getOrganizerCommunities(
    organizer.id,
    organizer.role
  );

  if (!communities.some((c) => c.id === validated.data.communityId)) {
    return {
      errors: {
        communityId: ["You can only create events for communities you manage."],
      },
    };
  }

  const slug = generateEventSlug(validated.data.title);
  const description = embedCategoryInDescription(
    validated.data.description,
    validated.data.category
  );

  try {
    const event = await prisma.event.create({
      data: {
        communityId: validated.data.communityId,
        organizerId: organizer.id,
        title: validated.data.title,
        slug,
        description,
        location: validated.data.isOnline ? null : validated.data.location,
        isOnline: validated.data.isOnline,
        meetLink: validated.data.isOnline ? validated.data.meetLink : null,
        startAt: new Date(validated.data.startAt),
        endAt: new Date(validated.data.endAt),
        capacity:
          validated.data.capacity === "" || validated.data.capacity === undefined
            ? null
            : validated.data.capacity,
        status: validated.data.status as EventStatus,
      },
    });

    revalidatePath("/member/events");
    revalidatePath("/organizer/events");
    redirect(`/organizer/events/${event.slug}`);
  } catch {
    return { message: "Failed to create event. Please try again." };
  }
}

/* ─── Fetch Events ───────────────────────────────────────────────────────────── */

export async function getEvents(
  filter: "upcoming" | "past" | "all" = "upcoming",
  options?: { includeDrafts?: boolean; organizerId?: string }
): Promise<ActionResult<EventListItem[]>> {
  try {
    const now = new Date();
    const user = await getCurrentDbUser();

    const statusFilter =
      options?.includeDrafts && user && hasRole(user, ["ORGANIZER", "ADMIN"])
        ? undefined
        : { status: "PUBLISHED" as EventStatus };

    const dateFilter =
      filter === "upcoming"
        ? { startAt: { gte: now } }
        : filter === "past"
          ? { startAt: { lt: now } }
          : {};

    const events = await prisma.event.findMany({
      where: {
        ...statusFilter,
        ...dateFilter,
        ...(options?.organizerId
          ? { organizerId: options.organizerId }
          : {}),
      },
      orderBy: { startAt: filter === "past" ? "desc" : "asc" },
      include: {
        community: { select: { id: true, name: true, slug: true } },
        organizer: { select: { id: true, fullName: true } },
        _count: {
          select: {
            registrations: {
              where: { status: { in: ["REGISTERED", "WAITLISTED"] } },
            },
          },
        },
      },
    });

    return {
      success: true,
      data: events.map((event) => mapEventToListItem(event, now)),
    };
  } catch {
    return { success: false, error: "Failed to load events." };
  }
}

/* ─── Fetch Single Event ─────────────────────────────────────────────────────── */

export async function getEventBySlug(
  slug: string
): Promise<ActionResult<EventDetail>> {
  try {
    const user = await getCurrentDbUser();
    const now = new Date();

    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        community: { select: { id: true, name: true, slug: true } },
        organizer: { select: { id: true, fullName: true } },
        _count: {
          select: {
            registrations: {
              where: { status: { in: ["REGISTERED", "WAITLISTED"] } },
            },
          },
        },
        registrations: user
          ? {
              where: { userId: user.id },
              select: { id: true, status: true },
              take: 1,
            }
          : false,
      },
    });

    if (!event) {
      return { success: false, error: "Event not found." };
    }

    const isOrganizer =
      user &&
      (event.organizerId === user.id || hasRole(user, ["ADMIN"]));

    if (event.status !== "PUBLISHED" && !isOrganizer) {
      return { success: false, error: "Event not found." };
    }

    const listItem = mapEventToListItem(event, now);
    const userRegistration = user
      ? (event.registrations?.[0] ?? null)
      : null;

    return {
      success: true,
      data: {
        ...listItem,
        qrToken: event.qrToken,
        userRegistration,
      },
    };
  } catch {
    return { success: false, error: "Failed to load event." };
  }
}

/* ─── RSVP ───────────────────────────────────────────────────────────────────── */

export async function rsvpForEvent(
  eventId: string
): Promise<ActionResult<{ status: RegistrationStatus }>> {
  const validated = rsvpSchema.safeParse({ eventId });
  if (!validated.success) {
    return { success: false, error: "Invalid event." };
  }

  let user;
  try {
    user = await requireDbUser();
  } catch {
    return { success: false, error: "You must be signed in to RSVP." };
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id: validated.data.eventId },
      include: {
        _count: {
          select: {
            registrations: { where: { status: "REGISTERED" } },
          },
        },
      },
    });

    if (!event) {
      return { success: false, error: "Event not found." };
    }

    if (event.status !== "PUBLISHED") {
      return { success: false, error: "This event is not open for registration." };
    }

    if (!isEventUpcoming(event.startAt)) {
      return { success: false, error: "This event has already started." };
    }

    const existing = await prisma.registration.findUnique({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId: event.id,
        },
      },
    });

    if (existing) {
      if (existing.status === "CANCELLED") {
        const atCapacity =
          event.capacity !== null &&
          event._count.registrations >= event.capacity;

        const registration = await prisma.registration.update({
          where: { id: existing.id },
          data: {
            status: atCapacity ? "WAITLISTED" : "REGISTERED",
            cancelledAt: null,
            registeredAt: new Date(),
          },
        });

        revalidatePath("/member/events");
        revalidatePath(`/member/events/${event.slug}`);

        return {
          success: true,
          data: { status: registration.status },
          message: atCapacity
            ? "Added to waitlist — event is at capacity."
            : "You're registered!",
        };
      }

      return {
        success: false,
        error:
          existing.status === "WAITLISTED"
            ? "You're already on the waitlist."
            : "You're already registered for this event.",
      };
    }

    const atCapacity =
      event.capacity !== null &&
      event._count.registrations >= event.capacity;

    const registration = await prisma.registration.create({
      data: {
        userId: user.id,
        eventId: event.id,
        status: atCapacity ? "WAITLISTED" : "REGISTERED",
      },
    });

    revalidatePath("/member/events");
    revalidatePath(`/member/events/${event.slug}`);

    return {
      success: true,
      data: { status: registration.status },
      message: atCapacity
        ? "Added to waitlist — event is at capacity."
        : "You're registered!",
    };
  } catch {
    return { success: false, error: "Failed to register. Please try again." };
  }
}

/* ─── Organizer Communities (for create form) ────────────────────────────────── */

export async function getOrganizerCommunitiesAction(): Promise<
  ActionResult<{ id: string; name: string; slug: string }[]>
> {
  try {
    const user = await requireOrganizer();
    const communities = await getOrganizerCommunities(user.id, user.role);
    return { success: true, data: communities };
  } catch {
    return { success: false, error: "Unable to load communities." };
  }
}
