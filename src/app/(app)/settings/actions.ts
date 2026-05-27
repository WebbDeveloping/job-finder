"use server";

import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth";
import { deleteAllUserResumeFiles } from "@/lib/resume-storage";

export type SettingsActionState = {
  error?: string;
  success?: string;
};

function getStringField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function updateProfile(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const userId = await requireUserId();
  const name = getStringField(formData, "name").trim();

  await prisma.user.update({
    where: { id: userId },
    data: { name: name || null },
  });

  return { success: "Profile updated." };
}

export async function deleteAccount(): Promise<void> {
  const userId = await requireUserId();

  try {
    await deleteAllUserResumeFiles(userId);
  } catch {
    // Continue account deletion even if blob cleanup fails.
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  const { signOut } = await import("@/lib/auth");
  await signOut({ redirectTo: "/" });
}
