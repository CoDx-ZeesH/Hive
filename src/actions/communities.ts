"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

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

const createCommunitySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(500).optional(),
});

export type CommunityFormState = {
  success: boolean;
  errors?: {
    name?: string[];
    description?: string[];
  };
  message?: string;
};

export async function createCommunityAction(
  prevState: CommunityFormState,
  formData: FormData
): Promise<CommunityFormState> {
  const raw = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
  };

  const validated = createCommunitySchema.safeParse(raw);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  let admin;
  try {
    admin = await getDbUser();
  } catch {
    return { success: false, message: "Unauthorized" };
  }

  if (admin.role !== "ADMIN") {
    return { success: false, message: "Only administrators can create communities." };
  }

  const slug = validated.data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") + `-${Date.now()}`;

  try {
    await prisma.community.create({
      data: {
        name: validated.data.name,
        slug,
        description: validated.data.description,
      },
    });

    revalidatePath("/admin/communities");
    return { success: true, message: "Community created successfully!" };
  } catch (error) {
    console.error("Failed to create community:", error);
    return { success: false, message: "Failed to create community." };
  }
}

export async function assignOrganizerToCommunityAction(
  communityId: string,
  organizerId: string
) {
  let admin;
  try {
    admin = await getDbUser();
  } catch {
    return { success: false, message: "Unauthorized" };
  }

  if (admin.role !== "ADMIN") {
    return { success: false, message: "Only administrators can assign organizers." };
  }

  try {
    // Upsert membership to ORGANIZER role
    await prisma.membership.upsert({
      where: {
        userId_communityId: {
          userId: organizerId,
          communityId: communityId,
        },
      },
      update: {
        role: "ORGANIZER",
        status: "ACTIVE",
      },
      create: {
        userId: organizerId,
        communityId: communityId,
        role: "ORGANIZER",
        status: "ACTIVE",
      },
    });

    revalidatePath("/admin/communities");
    return { success: true, message: "Organizer assigned successfully!" };
  } catch (error) {
    console.error("Failed to assign organizer:", error);
    return { success: false, message: "Failed to assign organizer." };
  }
}
