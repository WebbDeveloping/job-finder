import { formatPhoneForDisplay } from "@/lib/phone-format";
import type { CoverLetterFormData } from "@/lib/cover-letter-types";

function sanitizeFilenamePart(value: string): string {
  const safe = value
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_");
  return safe || "Cover_Letter";
}

export function coverLetterPdfFilename(data: CoverLetterFormData): string {
  const name = sanitizeFilenamePart(data.fullName);
  const company = data.company?.trim()
    ? `_${sanitizeFilenamePart(data.company)}`
    : "";
  return `${name}${company}_Cover_Letter.pdf`;
}

export function buildCoverLetterContactLines(
  data: CoverLetterFormData,
): string[] {
  const lines: string[] = [];
  if (data.fullName.trim()) lines.push(data.fullName.trim());
  if (data.email.trim()) lines.push(data.email.trim());
  const phone = formatPhoneForDisplay(data.phone);
  if (phone) lines.push(phone);
  if (data.location?.trim()) lines.push(data.location.trim());
  return lines;
}

export function splitCoverLetterBodyParagraphs(body: string): string[] {
  return body
    .split(/\r?\n\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
