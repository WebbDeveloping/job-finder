"use server";

import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createCoverLetter,
  deleteCoverLetter,
  duplicateCoverLetter,
  getCoverLetter,
  renameCoverLetter,
  updateCoverLetter,
  validateCoverLetterFormData,
} from "@/lib/cover-letter";
import { parseCoverLetterThemeField } from "@/lib/cover-letter-theme";
import { formatPhoneForDisplay } from "@/lib/phone-format";
import type { CoverLetterFormData } from "@/lib/cover-letter-types";

export type CoverLetterActionState = {
  error?: string;
  success?: boolean;
  coverLetterId?: string;
};

function trimOptional(value: FormDataEntryValue | null): string | null {
  if (value === null || typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function requireField(
  value: FormDataEntryValue | null,
  fieldName: string,
): string | CoverLetterActionState {
  if (value === null || typeof value !== "string") {
    return { error: `${fieldName} is required.` };
  }
  const trimmed = value.trim();
  if (trimmed === "") {
    return { error: `${fieldName} is required.` };
  }
  return trimmed;
}

function parseCoverLetterFormData(
  formData: FormData,
): CoverLetterFormData | CoverLetterActionState {
  const label = requireField(formData.get("label"), "Label");
  if (typeof label !== "string") return label;

  const fullName = requireField(formData.get("fullName"), "Full name");
  if (typeof fullName !== "string") return fullName;

  const email = requireField(formData.get("email"), "Email");
  if (typeof email !== "string") return email;

  const salutationRaw = formData.get("salutation");
  const closingRaw = formData.get("closing");
  const bodyRaw = formData.get("body");

  return {
    label,
    fullName,
    email,
    phone: formatPhoneForDisplay(trimOptional(formData.get("phone"))) || null,
    location: trimOptional(formData.get("location")),
    letterDate: trimOptional(formData.get("letterDate")),
    recipientName: trimOptional(formData.get("recipientName")),
    recipientTitle: trimOptional(formData.get("recipientTitle")),
    company: trimOptional(formData.get("company")),
    companyAddress: trimOptional(formData.get("companyAddress")),
    salutation:
      typeof salutationRaw === "string" && salutationRaw.trim() !== ""
        ? salutationRaw
        : "Dear Hiring Manager,",
    body: typeof bodyRaw === "string" ? bodyRaw : "",
    closing:
      typeof closingRaw === "string" && closingRaw.trim() !== ""
        ? closingRaw
        : "Sincerely,",
  };
}

function parseThemeJsonField(
  value: FormDataEntryValue | null,
): unknown | null | CoverLetterActionState {
  if (value === null || typeof value !== "string" || value.trim() === "") {
    return null;
  }
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return { error: "Theme is invalid." };
  }
}

export async function saveCoverLetter(
  _prevState: CoverLetterActionState,
  formData: FormData,
): Promise<CoverLetterActionState> {
  const userId = await requireUserId();
  const parsed = parseCoverLetterFormData(formData);
  if ("error" in parsed && parsed.error !== undefined) return parsed;
  if (!("fullName" in parsed)) return { error: "Invalid form data." };

  const validationError = validateCoverLetterFormData(parsed);
  if (validationError) return validationError;

  const themeRaw = parseThemeJsonField(formData.get("themeJson"));
  if (
    themeRaw !== null &&
    typeof themeRaw === "object" &&
    "error" in themeRaw &&
    typeof themeRaw.error === "string"
  ) {
    return { error: themeRaw.error };
  }

  const themeParsed = parseCoverLetterThemeField(themeRaw);
  if (themeParsed !== null && "error" in themeParsed) {
    return themeParsed;
  }
  const theme = themeParsed;

  const coverLetterIdRaw = formData.get("coverLetterId");
  const coverLetterId =
    typeof coverLetterIdRaw === "string" && coverLetterIdRaw.trim() !== ""
      ? coverLetterIdRaw.trim()
      : null;

  let savedId: string;
  if (coverLetterId) {
    const existing = await getCoverLetter(userId, coverLetterId);
    if (!existing) {
      return { error: "Cover letter not found." };
    }
    const updated = await updateCoverLetter(userId, coverLetterId, parsed, theme);
    savedId = updated.id;
  } else {
    const created = await createCoverLetter(userId, parsed, theme);
    savedId = created.id;
  }

  const applicationIdRaw = formData.get("applicationId");
  const applicationId =
    typeof applicationIdRaw === "string" && applicationIdRaw.trim() !== ""
      ? applicationIdRaw.trim()
      : null;

  if (applicationId) {
    await prisma.application.updateMany({
      where: { id: applicationId, userId },
      data: { coverLetterId: savedId },
    });
    revalidatePath(`/applications/${applicationId}`);
  }

  revalidatePath("/cover-letters");
  revalidatePath("/dashboard");
  revalidatePath("/applications");
  return { success: true, coverLetterId: savedId };
}

export async function deleteCoverLetterAction(
  coverLetterId: string,
): Promise<CoverLetterActionState> {
  const userId = await requireUserId();
  if (!coverLetterId.trim()) {
    return { error: "Cover letter id is required." };
  }

  try {
    await deleteCoverLetter(userId, coverLetterId.trim());
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Delete failed.",
    };
  }

  revalidatePath("/cover-letters");
  revalidatePath("/dashboard");
  revalidatePath("/applications");
  return { success: true };
}

export async function duplicateCoverLetterAction(
  coverLetterId: string,
): Promise<CoverLetterActionState> {
  const userId = await requireUserId();
  if (!coverLetterId.trim()) {
    return { error: "Cover letter id is required." };
  }

  try {
    await duplicateCoverLetter(userId, coverLetterId.trim());
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Could not duplicate letter.",
    };
  }

  revalidatePath("/cover-letters");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function renameCoverLetterAction(
  coverLetterId: string,
  label: string,
): Promise<CoverLetterActionState> {
  const userId = await requireUserId();
  if (!coverLetterId.trim()) {
    return { error: "Cover letter id is required." };
  }

  try {
    await renameCoverLetter(userId, coverLetterId.trim(), label);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Rename failed.",
    };
  }

  revalidatePath("/cover-letters");
  return { success: true };
}
