"use server";

import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/auth";
import { validateCareerProfileEmail } from "@/lib/career-profile-form";
import { deleteAllUserResumeFiles } from "@/lib/resume-storage";
import {
  parseEducationJson,
  parseExperienceJson,
} from "@/lib/resume";
import type { CareerProfileData } from "@/lib/resume-types";
import { upsertUserProfile } from "@/lib/user-profile";
import { prisma } from "@/lib/prisma";

export type ProfileActionState = {
  error?: string;
  success?: string;
};

function trimOptional(value: FormDataEntryValue | null): string | null {
  if (value === null || typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function getStringField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function parseJsonField(
  value: FormDataEntryValue | null,
  fieldName: string,
): unknown | ProfileActionState {
  if (value === null || typeof value !== "string" || value.trim() === "") {
    return [];
  }
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return { error: `${fieldName} is invalid.` };
  }
}

async function parseCareerFormData(
  formData: FormData,
): Promise<CareerProfileData | ProfileActionState> {
  const experienceRaw = parseJsonField(
    formData.get("experienceJson"),
    "Experience",
  );
  if (typeof experienceRaw !== "object" || experienceRaw === null) {
    return experienceRaw as ProfileActionState;
  }

  const educationRaw = parseJsonField(
    formData.get("educationJson"),
    "Education",
  );
  if (typeof educationRaw !== "object" || educationRaw === null) {
    return educationRaw as ProfileActionState;
  }

  const experience = parseExperienceJson(experienceRaw);
  if ("error" in experience) return { error: experience.error };

  const education = parseEducationJson(educationRaw);
  if ("error" in education) return { error: education.error };

  const data: CareerProfileData = {
    fullName: getStringField(formData, "fullName"),
    email: getStringField(formData, "email"),
    phone: trimOptional(formData.get("phone")),
    location: trimOptional(formData.get("location")),
    website: trimOptional(formData.get("website")),
    linkedIn: trimOptional(formData.get("linkedIn")),
    github: trimOptional(formData.get("github")),
    summary: getStringField(formData, "summary"),
    skills: getStringField(formData, "skills"),
    experience,
    education,
  };

  const emailError = validateCareerProfileEmail(data.email);
  if (emailError) return emailError;

  return data;
}

export async function saveCareerProfile(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const userId = await requireUserId();
  const parsed = await parseCareerFormData(formData);
  if ("error" in parsed && parsed.error !== undefined) return parsed;
  if (!("fullName" in parsed)) return { error: "Invalid form data." };

  await upsertUserProfile(userId, parsed);
  revalidatePath("/profile");
  revalidatePath("/resume/create");

  return { success: "Profile saved." };
}

/** Phase 12 export-my-data should include UserProfile alongside applications and resumes. */
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
