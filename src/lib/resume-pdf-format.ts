import type {
  ResumeEducationEntry,
  ResumeExperienceEntry,
  ResumeProfileFormData,
} from "@/lib/resume-types";

export function resumePdfFilename(fullName: string): string {
  const base = fullName.trim() || "resume";
  const safe = base
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "_");
  return `${safe || "resume"}_Resume.pdf`;
}

export function formatDateRange(start: string, end: string): string {
  const parts = [start.trim(), end.trim()].filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!;
  return `${parts[0]} – ${parts[1]}`;
}

export function splitHighlightLines(highlights: string): string[] {
  return highlights
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function formatEducationLine(entry: ResumeEducationEntry): string {
  const degree = entry.degree.trim();
  const field = entry.field.trim();
  if (degree && field) return `${degree} in ${field}`;
  return degree || field;
}

export function formatExperienceHeader(entry: ResumeExperienceEntry): string {
  const title = entry.title.trim();
  const company = entry.company.trim();
  if (title && company) return `${title} at ${company}`;
  return title || company;
}

export function buildContactParts(data: ResumeProfileFormData): string[] {
  const parts: string[] = [];
  if (data.email.trim()) parts.push(data.email.trim());
  if (data.phone?.trim()) parts.push(data.phone.trim());
  if (data.location?.trim()) parts.push(data.location.trim());
  return parts;
}

export function buildLinkParts(data: ResumeProfileFormData): string[] {
  const links: string[] = [];
  if (data.website?.trim()) links.push(data.website.trim());
  if (data.linkedIn?.trim()) links.push(data.linkedIn.trim());
  if (data.github?.trim()) links.push(data.github.trim());
  return links;
}

export function splitSkillItems(skills: string): string[] {
  return skills
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
