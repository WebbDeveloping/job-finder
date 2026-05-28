"use server";

import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/auth";
import {
  assertTemplateId,
  templateSupportsSidebarWidth,
} from "@/lib/resume-templates/registry";
import {
  validateResumeTheme,
  type ResumeDesign,
} from "@/lib/resume-templates/theme";
import {
  createBuiltResume,
  deleteResume,
  duplicateBuiltResume,
  getResume,
  parseEducationJson,
  parseExperienceJson,
  renameResume,
  setDefaultResume,
  updateBuiltResume,
  validateResumeFormData,
} from "@/lib/resume";
import {
  buildResumeStorageKey,
  uploadResumeFile,
} from "@/lib/resume-storage";
import {
  RESUME_UPLOAD_MAX_BYTES,
  RESUME_UPLOAD_MIME,
} from "@/lib/resume-constants";
import { formatPhoneForDisplay } from "@/lib/phone-format";
import type { ResumeProfileFormData } from "@/lib/resume-types";
import { prisma } from "@/lib/prisma";

export type ResumeActionState = {
  error?: string;
  success?: boolean;
  resumeId?: string;
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

function parseThemeJsonField(
  value: FormDataEntryValue | null,
): unknown | null | ResumeActionState {
  if (value === null || typeof value !== "string" || value.trim() === "") {
    return null;
  }
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return { error: "Theme is invalid." };
  }
}

async function parseBuiltFormData(
  formData: FormData,
): Promise<ResumeProfileFormData | ResumeActionState> {
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
    phone: formatPhoneForDisplay(trimOptional(formData.get("phone"))) || null,
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

  return data;
}

export async function saveBuiltResume(
  _prevState: ResumeActionState,
  formData: FormData,
): Promise<ResumeActionState> {
  const userId = await requireUserId();
  const parsed = await parseBuiltFormData(formData);
  if ("error" in parsed && parsed.error !== undefined) return parsed;
  if (!("fullName" in parsed)) return { error: "Invalid form data." };

  const resumeIdRaw = formData.get("resumeId");
  const resumeId =
    typeof resumeIdRaw === "string" && resumeIdRaw.trim() !== ""
      ? resumeIdRaw.trim()
      : null;

  const labelRaw = formData.get("label");
  const label =
    typeof labelRaw === "string" && labelRaw.trim() !== ""
      ? labelRaw.trim()
      : undefined;

  const templateIdRaw = formData.get("templateId");
  const templateId = assertTemplateId(
    typeof templateIdRaw === "string" ? templateIdRaw : "",
  );

  const themeRaw = parseThemeJsonField(formData.get("themeJson"));
  if (themeRaw !== null && typeof themeRaw === "object" && "error" in themeRaw) {
    return { error: String(themeRaw.error) };
  }

  const validatedTheme = validateResumeTheme(
    themeRaw,
    templateId,
    templateSupportsSidebarWidth(templateId),
  );
  if (validatedTheme !== null && "error" in validatedTheme) {
    return { error: validatedTheme.error };
  }

  const design: ResumeDesign = {
    templateId,
    theme: validatedTheme,
  };

  let savedId: string;
  if (resumeId) {
    const existing = await getResume(userId, resumeId);
    if (!existing || existing.kind !== "BUILT") {
      return { error: "Built resume not found." };
    }

    const updated = await updateBuiltResume(
      userId,
      resumeId,
      parsed,
      label,
      design,
    );
    savedId = updated.id;
  } else {
    const created = await createBuiltResume(userId, parsed, label, design);
    savedId = created.id;
  }

  revalidatePath("/resume");
  revalidatePath("/dashboard");
  return { success: true, resumeId: savedId };
}

/** @deprecated Use saveBuiltResume */
export const saveResumeProfile = saveBuiltResume;

export async function uploadResume(
  _prevState: ResumeActionState,
  formData: FormData,
): Promise<ResumeActionState> {
  const userId = await requireUserId();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "PDF file is required." };
  }

  if (file.type !== RESUME_UPLOAD_MIME) {
    return { error: "Only PDF files are supported." };
  }

  if (file.size > RESUME_UPLOAD_MAX_BYTES) {
    return { error: "File must be 5 MB or smaller." };
  }

  const labelField = formData.get("label");
  const label =
    typeof labelField === "string" && labelField.trim() !== ""
      ? labelField.trim()
      : file.name;

  const resume = await prisma.resume.create({
    data: {
      userId,
      kind: "UPLOADED",
      label,
      fileName: file.name,
      mimeType: RESUME_UPLOAD_MIME,
      fileSize: file.size,
      isDefault: false,
    },
  });

  const storageKey = buildResumeStorageKey(userId, resume.id, file.name);
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await uploadResumeFile(storageKey, buffer, RESUME_UPLOAD_MIME);
  } catch (error) {
    await prisma.resume.delete({ where: { id: resume.id } });
    const message =
      error instanceof Error ? error.message : "Upload failed.";
    return { error: message };
  }

  await prisma.resume.update({
    where: { id: resume.id },
    data: { storageKey },
  });

  const hasDefault = await prisma.resume.findFirst({
    where: { userId, isDefault: true },
    select: { id: true },
  });
  if (!hasDefault) {
    await setDefaultResume(userId, resume.id);
  }

  revalidatePath("/resume");
  revalidatePath("/dashboard");
  return { success: true, resumeId: resume.id };
}

export async function deleteResumeAction(
  resumeId: string,
): Promise<ResumeActionState> {
  const userId = await requireUserId();
  if (!resumeId.trim()) {
    return { error: "Resume id is required." };
  }

  try {
    await deleteResume(userId, resumeId.trim());
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Delete failed.",
    };
  }

  revalidatePath("/resume");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function setDefaultResumeAction(
  resumeId: string,
): Promise<ResumeActionState> {
  const userId = await requireUserId();
  if (!resumeId.trim()) {
    return { error: "Resume id is required." };
  }

  try {
    await setDefaultResume(userId, resumeId.trim());
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Could not set default.",
    };
  }

  revalidatePath("/resume");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function duplicateResumeAction(
  resumeId: string,
): Promise<ResumeActionState> {
  const userId = await requireUserId();
  if (!resumeId.trim()) {
    return { error: "Resume id is required." };
  }

  try {
    await duplicateBuiltResume(userId, resumeId.trim());
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Could not duplicate resume.",
    };
  }

  revalidatePath("/resume");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function renameResumeAction(
  resumeId: string,
  label: string,
): Promise<ResumeActionState> {
  const userId = await requireUserId();
  if (!resumeId.trim()) {
    return { error: "Resume id is required." };
  }

  try {
    await renameResume(userId, resumeId.trim(), label);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Rename failed.",
    };
  }

  revalidatePath("/resume");
  return { success: true };
}
