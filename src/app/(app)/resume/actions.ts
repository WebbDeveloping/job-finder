"use server";

import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/auth";
import {
  parseEducationJson,
  parseExperienceJson,
  upsertResumeProfile,
  validateResumeFormData,
} from "@/lib/resume";
import type { ResumeProfileFormData } from "@/lib/resume-types";

export type ResumeActionState = {
  error?: string;
  success?: boolean;
};

function trimOptional(value: FormDataEntryValue | null): string | null {
  if (value === null || typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function requireField(
  value: FormDataEntryValue | null,
  fieldName: string,
): string | ResumeActionState {
  if (value === null || typeof value !== "string") {
    return { error: `${fieldName} is required.` };
  }
  const trimmed = value.trim();
  if (trimmed === "") {
    return { error: `${fieldName} is required.` };
  }
  return trimmed;
}

function parseJsonField(
  value: FormDataEntryValue | null,
  fieldName: string,
): unknown | ResumeActionState {
  if (value === null || typeof value !== "string" || value.trim() === "") {
    return [];
  }
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return { error: `${fieldName} is invalid.` };
  }
}

export async function saveResumeProfile(
  _prevState: ResumeActionState,
  formData: FormData,
): Promise<ResumeActionState> {
  const userId = await requireUserId();

  const fullName = requireField(formData.get("fullName"), "Full name");
  if (typeof fullName !== "string") return fullName;

  const email = requireField(formData.get("email"), "Email");
  if (typeof email !== "string") return email;

  const experienceRaw = parseJsonField(
    formData.get("experienceJson"),
    "Experience",
  );
  if (typeof experienceRaw !== "object" || experienceRaw === null) {
    return experienceRaw as ResumeActionState;
  }

  const educationRaw = parseJsonField(
    formData.get("educationJson"),
    "Education",
  );
  if (typeof educationRaw !== "object" || educationRaw === null) {
    return educationRaw as ResumeActionState;
  }

  const experience = parseExperienceJson(experienceRaw);
  if ("error" in experience) return { error: experience.error };

  const education = parseEducationJson(educationRaw);
  if ("error" in education) return { error: education.error };

  const data: ResumeProfileFormData = {
    fullName,
    email,
    phone: trimOptional(formData.get("phone")),
    location: trimOptional(formData.get("location")),
    website: trimOptional(formData.get("website")),
    linkedIn: trimOptional(formData.get("linkedIn")),
    github: trimOptional(formData.get("github")),
    summary:
      typeof formData.get("summary") === "string"
        ? formData.get("summary")!.toString()
        : "",
    skills:
      typeof formData.get("skills") === "string"
        ? formData.get("skills")!.toString()
        : "",
    experience,
    education,
  };

  const validationError = validateResumeFormData(data);
  if (validationError) return validationError;

  await upsertResumeProfile(userId, data);

  revalidatePath("/resume");
  revalidatePath("/dashboard");
  return { success: true };
}
