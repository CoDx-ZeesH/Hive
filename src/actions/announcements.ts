"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { createAnnouncementSchema } from "@/lib/validations/announcement";
import type { AnnouncementFormState } from "@/lib/validations/announcement";

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

/* ─── Create Announcement ─────────────────────────────────────────────────── */

export async function createAnnouncementAction(
  _state: AnnouncementFormState,
  formData: FormData
): Promise<AnnouncementFormState> {
  const raw = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    isPinned: (formData.get("isPinned") as string) || "false",
  };

  const validated = createAnnouncementSchema.safeParse(raw);
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  let author;
  try {
    author = await getDbUser();
  } catch {
    return { message: "You must be signed in." };
  }

  if (author.role !== "ORGANIZER" && author.role !== "ADMIN") {
    return { message: "Only organizers and admins can post announcements." };
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: author.id, status: "ACTIVE" },
  });
  if (!membership) {
    return { message: "You must be a member of a community." };
  }

  try {
    await prisma.announcement.create({
      data: {
        title: validated.data.title,
        content: validated.data.content,
        isPinned: validated.data.isPinned,
        authorId: author.id,
        communityId: membership.communityId,
      },
    });

    revalidatePath("/organizer/announcements");
    revalidatePath("/member");
    return { success: true, message: "Announcement posted successfully." };
  } catch (err) {
    console.error("createAnnouncement error:", err);
    return { message: "Failed to post announcement. Please try again." };
  }
}
