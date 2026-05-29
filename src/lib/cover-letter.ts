import { Prisma, type CoverLetter } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { CoverLetterFormData } from "@/lib/cover-letter-types";
import {
  toCoverLetterTheme,
  type CoverLetterTheme,
} from "@/lib/cover-letter-theme";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LABEL_LENGTH = 120;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_SHORT_FIELD = 200;
const MAX_ADDRESS_LENGTH = 2000;
const MAX_SALUTATION_LENGTH = 200;
const MAX_CLOSING_LENGTH = 100;
const MAX_BODY_LENGTH = 20000;

function fieldData(data: CoverLetterFormData) {
  return {
    fullName: data.fullName.trim(),
    email: data.email.trim(),
    phone: data.phone?.trim() || null,
    location: data.location?.trim() || null,
    letterDate: data.letterDate?.trim() || null,
    recipientName: data.recipientName?.trim() || null,
    recipientTitle: data.recipientTitle?.trim() || null,
    company: data.company?.trim() || null,
    companyAddress: data.companyAddress?.trim() || null,
    salutation: data.salutation.trim() || "Dear Hiring Manager,",
    body: data.body,
    closing: data.closing.trim() || "Sincerely,",
  };
}

export function validateCoverLetterFormData(
  data: CoverLetterFormData,
): { error: string } | null {
  const label = data.label.trim();
  if (label === "") {
    return { error: "Label is required." };
  }
  if (label.length > MAX_LABEL_LENGTH) {
    return { error: `Label must be ${MAX_LABEL_LENGTH} characters or fewer.` };
  }

  const fullName = data.fullName.trim();
  if (fullName === "") {
    return { error: "Full name is required." };
  }
  if (fullName.length > MAX_NAME_LENGTH) {
    return { error: `Full name must be ${MAX_NAME_LENGTH} characters or fewer.` };
  }

  const email = data.email.trim();
  if (email === "") {
    return { error: "Email is required." };
  }
  if (email.length > MAX_EMAIL_LENGTH) {
    return { error: `Email must be ${MAX_EMAIL_LENGTH} characters or fewer.` };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Email format is invalid." };
  }

  if (data.body.trim() === "") {
    return { error: "Letter body is required." };
  }
  if (data.body.length > MAX_BODY_LENGTH) {
    return { error: `Letter body must be ${MAX_BODY_LENGTH} characters or fewer.` };
  }

  if (
    data.companyAddress &&
    data.companyAddress.length > MAX_ADDRESS_LENGTH
  ) {
    return {
      error: `Company address must be ${MAX_ADDRESS_LENGTH} characters or fewer.`,
    };
  }

  for (const [value, max, name] of [
    [data.salutation, MAX_SALUTATION_LENGTH, "Salutation"],
    [data.closing, MAX_CLOSING_LENGTH, "Closing"],
    [data.recipientName, MAX_SHORT_FIELD, "Recipient name"],
    [data.recipientTitle, MAX_SHORT_FIELD, "Recipient title"],
    [data.company, MAX_SHORT_FIELD, "Company"],
    [data.letterDate, MAX_SHORT_FIELD, "Date"],
  ] as const) {
    if (value && value.length > max) {
      return { error: `${name} must be ${max} characters or fewer.` };
    }
  }

  return null;
}

export function toCoverLetterFormData(row: CoverLetter): CoverLetterFormData {
  return {
    label: row.label,
    fullName: row.fullName,
    email: row.email,
    phone: row.phone,
    location: row.location,
    letterDate: row.letterDate,
    recipientName: row.recipientName,
    recipientTitle: row.recipientTitle,
    company: row.company,
    companyAddress: row.companyAddress,
    salutation: row.salutation,
    body: row.body,
    closing: row.closing,
  };
}

export async function listCoverLetters(userId: string): Promise<CoverLetter[]> {
  return prisma.coverLetter.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getCoverLetter(
  userId: string,
  coverLetterId: string,
): Promise<CoverLetter | null> {
  return prisma.coverLetter.findFirst({
    where: { id: coverLetterId, userId },
  });
}

export async function assertCoverLetterOwnedByUser(
  coverLetterId: string,
  userId: string,
): Promise<CoverLetter | { error: string }> {
  const letter = await getCoverLetter(userId, coverLetterId);
  if (!letter) {
    return { error: "Cover letter not found." };
  }
  return letter;
}

export function toCoverLetterThemeFromRow(row: CoverLetter): CoverLetterTheme | null {
  return toCoverLetterTheme(row.theme);
}

export async function createCoverLetter(
  userId: string,
  data: CoverLetterFormData,
  theme: CoverLetterTheme | null = null,
): Promise<CoverLetter> {
  const label =
    data.label.trim() ||
    (data.company?.trim()
      ? `${data.company.trim()} cover letter`
      : "Untitled cover letter");

  return prisma.coverLetter.create({
    data: {
      userId,
      label,
      ...fieldData({ ...data, label }),
      theme:
        theme === null ? undefined : (theme as Prisma.InputJsonValue),
    },
  });
}

export async function updateCoverLetter(
  userId: string,
  coverLetterId: string,
  data: CoverLetterFormData,
  theme: CoverLetterTheme | null = null,
): Promise<CoverLetter> {
  const existing = await getCoverLetter(userId, coverLetterId);
  if (!existing) {
    throw new Error("Cover letter not found.");
  }

  return prisma.coverLetter.update({
    where: { id: coverLetterId },
    data: {
      label: data.label.trim(),
      ...fieldData(data),
      theme:
        theme === null ? Prisma.DbNull : (theme as Prisma.InputJsonValue),
    },
  });
}

export async function duplicateCoverLetter(
  userId: string,
  coverLetterId: string,
): Promise<CoverLetter> {
  const existing = await getCoverLetter(userId, coverLetterId);
  if (!existing) {
    throw new Error("Cover letter not found.");
  }

  const copyLabel = existing.label.trim().endsWith("(copy)")
    ? existing.label.trim()
    : `${existing.label.trim()} (copy)`;

  return prisma.coverLetter.create({
    data: {
      userId,
      label: copyLabel,
      fullName: existing.fullName,
      email: existing.email,
      phone: existing.phone,
      location: existing.location,
      letterDate: existing.letterDate,
      recipientName: existing.recipientName,
      recipientTitle: existing.recipientTitle,
      company: existing.company,
      companyAddress: existing.companyAddress,
      salutation: existing.salutation,
      body: existing.body,
      closing: existing.closing,
      theme: existing.theme ?? undefined,
    },
  });
}

export async function renameCoverLetter(
  userId: string,
  coverLetterId: string,
  label: string,
): Promise<CoverLetter> {
  const trimmed = label.trim();
  if (trimmed === "") {
    throw new Error("Label is required.");
  }

  const existing = await getCoverLetter(userId, coverLetterId);
  if (!existing) {
    throw new Error("Cover letter not found.");
  }

  return prisma.coverLetter.update({
    where: { id: coverLetterId },
    data: { label: trimmed },
  });
}

export async function deleteCoverLetter(
  userId: string,
  coverLetterId: string,
): Promise<void> {
  const letter = await getCoverLetter(userId, coverLetterId);
  if (!letter) {
    throw new Error("Cover letter not found.");
  }

  await prisma.coverLetter.delete({ where: { id: coverLetterId } });
}
