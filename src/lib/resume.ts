import type { Resume, ResumeKind } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { deleteResumeFile } from "@/lib/resume-storage";
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

export function toResumeFormData(resume: Resume): ResumeProfileFormData {
  const experience = parseExperienceJson(resume.experience ?? []);
  const education = parseEducationJson(resume.education ?? []);

  return {
    fullName: resume.fullName ?? "",
    email: resume.email ?? "",
    phone: resume.phone,
    location: resume.location,
    website: resume.website,
    linkedIn: resume.linkedIn,
    github: resume.github,
    summary: resume.summary ?? "",
    skills: resume.skills ?? "",
    experience: "error" in experience ? [] : experience,
    education: "error" in education ? [] : education,
  };
}

function builtFieldData(data: ResumeProfileFormData) {
  return {
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
  };
}

export async function listResumes(userId: string): Promise<Resume[]> {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
  });
}

export async function getResume(
  userId: string,
  resumeId: string,
): Promise<Resume | null> {
  return prisma.resume.findFirst({
    where: { id: resumeId, userId },
  });
}

export async function assertResumeOwnedByUser(
  resumeId: string,
  userId: string,
): Promise<Resume | { error: string }> {
  const resume = await getResume(userId, resumeId);
  if (!resume) {
    return { error: "Resume not found." };
  }
  return resume;
}

export async function getDefaultResume(userId: string): Promise<Resume | null> {
  return prisma.resume.findFirst({
    where: { userId, isDefault: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getDefaultBuiltResume(
  userId: string,
): Promise<Resume | null> {
  return prisma.resume.findFirst({
    where: { userId, kind: "BUILT", isDefault: true },
    orderBy: { updatedAt: "desc" },
  });
}

async function userHasDefault(userId: string): Promise<boolean> {
  const existing = await prisma.resume.findFirst({
    where: { userId, isDefault: true },
    select: { id: true },
  });
  return existing !== null;
}

export async function setDefaultResume(
  userId: string,
  resumeId: string,
): Promise<Resume> {
  const resume = await getResume(userId, resumeId);
  if (!resume) {
    throw new Error("Resume not found.");
  }

  return prisma.$transaction(async (tx) => {
    await tx.resume.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
    return tx.resume.update({
      where: { id: resumeId },
      data: { isDefault: true },
    });
  });
}

async function ensureDefaultIfNone(userId: string, resumeId: string) {
  const hasDefault = await userHasDefault(userId);
  if (!hasDefault) {
    await setDefaultResume(userId, resumeId);
  }
}

export async function createBuiltResume(
  userId: string,
  data: ResumeProfileFormData,
  label?: string,
): Promise<Resume> {
  const resumeLabel =
    label?.trim() ||
    (data.fullName.trim() ? data.fullName.trim() : "Untitled resume");
  const shouldDefault = !(await userHasDefault(userId));

  return prisma.resume.create({
    data: {
      userId,
      kind: "BUILT",
      label: resumeLabel,
      isDefault: shouldDefault,
      ...builtFieldData(data),
    },
  });
}

export async function updateBuiltResume(
  userId: string,
  resumeId: string,
  data: ResumeProfileFormData,
  label?: string,
): Promise<Resume> {
  const existing = await getResume(userId, resumeId);
  if (!existing || existing.kind !== "BUILT") {
    throw new Error("Built resume not found.");
  }

  const resume = await prisma.resume.update({
    where: { id: resumeId },
    data: {
      ...(label?.trim() ? { label: label.trim() } : {}),
      ...builtFieldData(data),
    },
  });

  await ensureDefaultIfNone(userId, resume.id);
  return resume;
}

export async function renameResume(
  userId: string,
  resumeId: string,
  label: string,
): Promise<Resume> {
  const trimmed = label.trim();
  if (trimmed === "") {
    throw new Error("Label is required.");
  }

  const existing = await getResume(userId, resumeId);
  if (!existing) {
    throw new Error("Resume not found.");
  }

  return prisma.resume.update({
    where: { id: resumeId },
    data: { label: trimmed },
  });
}

export async function deleteResume(
  userId: string,
  resumeId: string,
): Promise<void> {
  const resume = await getResume(userId, resumeId);
  if (!resume) {
    throw new Error("Resume not found.");
  }

  if (resume.kind === "UPLOADED" && resume.storageKey) {
    try {
      await deleteResumeFile(resume.storageKey);
    } catch {
      // Blob may already be gone; continue with DB delete.
    }
  }

  await prisma.resume.delete({ where: { id: resumeId } });

  if (resume.isDefault) {
    const next = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
    if (next) {
      await setDefaultResume(userId, next.id);
    }
  }
}

export function isBuiltResume(resume: Resume): boolean {
  return resume.kind === ("BUILT" satisfies ResumeKind);
}

export function isUploadedResume(resume: Resume): boolean {
  return resume.kind === ("UPLOADED" satisfies ResumeKind);
}
