import type {
  CareerProfileData,
  ResumeEducationEntry,
  ResumeExperienceEntry,
} from "@/lib/resume-types";
import { EMPTY_EDUCATION, EMPTY_EXPERIENCE } from "@/lib/resume-types";
import { formatPhoneForDisplay } from "@/lib/phone-format";

export function newExperience(): ResumeExperienceEntry {
  return { ...EMPTY_EXPERIENCE, id: crypto.randomUUID() };
}

export function newEducation(): ResumeEducationEntry {
  return { ...EMPTY_EDUCATION, id: crypto.randomUUID() };
}

export function ensureList<T>(items: T[], emptyFactory: () => T): T[] {
  return items.length > 0 ? items : [emptyFactory()];
}

export function cloneExperienceEntries(
  entries: ResumeExperienceEntry[],
): ResumeExperienceEntry[] {
  return entries.map((entry) => ({
    ...entry,
    id: crypto.randomUUID(),
  }));
}

export function cloneEducationEntries(
  entries: ResumeEducationEntry[],
): ResumeEducationEntry[] {
  return entries.map((entry) => ({
    ...entry,
    id: crypto.randomUUID(),
  }));
}

export const EMPTY_CAREER_PROFILE: CareerProfileData = {
  fullName: "",
  email: "",
  phone: null,
  location: null,
  website: null,
  linkedIn: null,
  github: null,
  summary: "",
  skills: "",
  experience: [],
  education: [],
};

export function readFormCareerData(
  form: HTMLFormElement | null,
  fallback: CareerProfileData,
  experience: ResumeExperienceEntry[],
  education: ResumeEducationEntry[],
): CareerProfileData {
  const readField = (name: string, defaultValue: string) => {
    if (!form) return defaultValue;
    const field = form.elements.namedItem(name);
    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement
    ) {
      return field.value;
    }
    return defaultValue;
  };

  return {
    fullName: readField("fullName", fallback.fullName),
    email: readField("email", fallback.email),
    phone: formatPhoneForDisplay(readField("phone", fallback.phone ?? "")) || null,
    location: readField("location", fallback.location ?? "") || null,
    website: readField("website", fallback.website ?? "") || null,
    linkedIn: readField("linkedIn", fallback.linkedIn ?? "") || null,
    github: readField("github", fallback.github ?? "") || null,
    summary: readField("summary", fallback.summary),
    skills: readField("skills", fallback.skills),
    experience,
    education,
  };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCareerProfileEmail(
  email: string,
): { error: string } | null {
  const trimmed = email.trim();
  if (trimmed === "") return null;
  if (!EMAIL_PATTERN.test(trimmed)) {
    return { error: "Email format is invalid." };
  }
  return null;
}

export function profileCompletionPercent(data: CareerProfileData): number {
  const checks = [
    data.fullName.trim() !== "",
    data.email.trim() !== "",
    data.phone?.trim(),
    data.location?.trim(),
    data.summary.trim() !== "",
    data.skills.trim() !== "",
    data.experience.some((e) => e.company.trim() || e.title.trim()),
    data.education.some((e) => e.school.trim() || e.degree.trim()),
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}
