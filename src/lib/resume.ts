import type { ResumeProfile } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  ResumeEducationEntry,
  ResumeExperienceEntry,
  ResumeProfileFormData,
} from "@/lib/resume-types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseStringField(
  value: unknown,
  fieldName: string,
): string | { error: string } {
  if (typeof value !== "string") {
    return { error: `${fieldName} must be a string.` };
  }
  return value.trim();
}

function parseExperienceEntry(
  value: unknown,
  index: number,
): ResumeExperienceEntry | { error: string } {
  if (!isRecord(value)) {
    return { error: `Experience entry ${index + 1} is invalid.` };
  }

  const company = parseStringField(value.company, "Company");
  if (typeof company !== "string") return company;

  const title = parseStringField(value.title, "Title");
  if (typeof title !== "string") return title;

  const location =
    typeof value.location === "string" ? value.location.trim() : "";
  const startDate =
    typeof value.startDate === "string" ? value.startDate.trim() : "";
  const endDate =
    typeof value.endDate === "string" ? value.endDate.trim() : "";
  const highlights =
    typeof value.highlights === "string" ? value.highlights.trim() : "";
  const id = typeof value.id === "string" ? value.id.trim() : "";

  if (company === "" && title === "" && highlights === "") {
    return {
      id: id || crypto.randomUUID(),
      company: "",
      title: "",
      location,
      startDate,
      endDate,
      highlights,
    };
  }

  if (company === "") {
    return { error: `Experience entry ${index + 1}: company is required.` };
  }
  if (title === "") {
    return { error: `Experience entry ${index + 1}: title is required.` };
  }

  return {
    id: id || crypto.randomUUID(),
    company,
    title,
    location,
    startDate,
    endDate,
    highlights,
  };
}

function parseEducationEntry(
  value: unknown,
  index: number,
): ResumeEducationEntry | { error: string } {
  if (!isRecord(value)) {
    return { error: `Education entry ${index + 1} is invalid.` };
  }

  const school = parseStringField(value.school, "School");
  if (typeof school !== "string") return school;

  const degree = parseStringField(value.degree, "Degree");
  if (typeof degree !== "string") return degree;

  const field = typeof value.field === "string" ? value.field.trim() : "";
  const startDate =
    typeof value.startDate === "string" ? value.startDate.trim() : "";
  const endDate =
    typeof value.endDate === "string" ? value.endDate.trim() : "";
  const id = typeof value.id === "string" ? value.id.trim() : "";

  if (school === "" && degree === "") {
    return {
      id: id || crypto.randomUUID(),
      school: "",
      degree: "",
      field,
      startDate,
      endDate,
    };
  }

  if (school === "") {
    return { error: `Education entry ${index + 1}: school is required.` };
  }
  if (degree === "") {
    return { error: `Education entry ${index + 1}: degree is required.` };
  }

  return {
    id: id || crypto.randomUUID(),
    school,
    degree,
    field,
    startDate,
    endDate,
  };
}

export function parseExperienceJson(
  raw: unknown,
): ResumeExperienceEntry[] | { error: string } {
  if (!Array.isArray(raw)) {
    return { error: "Experience must be an array." };
  }

  const entries: ResumeExperienceEntry[] = [];
  for (let i = 0; i < raw.length; i++) {
    const parsed = parseExperienceEntry(raw[i], i);
    if ("error" in parsed) return parsed;
    if (parsed.company !== "" || parsed.title !== "") {
      entries.push(parsed);
    }
  }
  return entries;
}

export function parseEducationJson(
  raw: unknown,
): ResumeEducationEntry[] | { error: string } {
  if (!Array.isArray(raw)) {
    return { error: "Education must be an array." };
  }

  const entries: ResumeEducationEntry[] = [];
  for (let i = 0; i < raw.length; i++) {
    const parsed = parseEducationEntry(raw[i], i);
    if ("error" in parsed) return parsed;
    if (parsed.school !== "" || parsed.degree !== "") {
      entries.push(parsed);
    }
  }
  return entries;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateResumeFormData(
  data: ResumeProfileFormData,
): { error: string } | null {
  if (data.fullName.trim() === "") {
    return { error: "Full name is required." };
  }

  const email = data.email.trim();
  if (email === "") {
    return { error: "Email is required." };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Email format is invalid." };
  }

  return null;
}

export function toResumeFormData(profile: ResumeProfile): ResumeProfileFormData {
  const experience = parseExperienceJson(profile.experience);
  const education = parseEducationJson(profile.education);

  return {
    fullName: profile.fullName,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    website: profile.website,
    linkedIn: profile.linkedIn,
    github: profile.github,
    summary: profile.summary,
    skills: profile.skills,
    experience: "error" in experience ? [] : experience,
    education: "error" in education ? [] : education,
  };
}

export async function getResumeProfile(
  userId: string,
): Promise<ResumeProfile | null> {
  return prisma.resumeProfile.findUnique({
    where: { userId },
  });
}

export async function upsertResumeProfile(
  userId: string,
  data: ResumeProfileFormData,
): Promise<ResumeProfile> {
  return prisma.resumeProfile.upsert({
    where: { userId },
    create: {
      userId,
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone,
      location: data.location,
      website: data.website,
      linkedIn: data.linkedIn,
      github: data.github,
      summary: data.summary.trim(),
      skills: data.skills.trim(),
      experience: data.experience,
      education: data.education,
    },
    update: {
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone,
      location: data.location,
      website: data.website,
      linkedIn: data.linkedIn,
      github: data.github,
      summary: data.summary.trim(),
      skills: data.skills.trim(),
      experience: data.experience,
      education: data.education,
    },
  });
}
