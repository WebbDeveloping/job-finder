import { Prisma, type UserProfile } from "@/generated/prisma/client";
import {
  cloneEducationEntries,
  cloneExperienceEntries,
  EMPTY_CAREER_PROFILE,
} from "@/lib/career-profile-form";
import { prisma } from "@/lib/prisma";
import {
  isBuiltResume,
  parseEducationJson,
  parseExperienceJson,
  toResumeFormData,
} from "@/lib/resume";
import type { CareerProfileData, ResumeProfileFormData } from "@/lib/resume-types";

function profileRowToData(row: UserProfile): CareerProfileData {
  const experience = parseExperienceJson(row.experience ?? []);
  const education = parseEducationJson(row.education ?? []);

  return {
    fullName: row.fullName ?? "",
    email: row.email ?? "",
    phone: row.phone,
    location: row.location,
    website: row.website,
    linkedIn: row.linkedIn,
    github: row.github,
    summary: row.summary ?? "",
    skills: row.skills ?? "",
    experience: "error" in experience ? [] : experience,
    education: "error" in education ? [] : education,
  };
}

function profileFieldData(data: CareerProfileData) {
  return {
    fullName: data.fullName.trim() || null,
    email: data.email.trim() || null,
    phone: data.phone,
    location: data.location,
    website: data.website,
    linkedIn: data.linkedIn,
    github: data.github,
    summary: data.summary.trim() || null,
    skills: data.skills.trim() || null,
    experience:
      data.experience.length > 0
        ? (data.experience as Prisma.InputJsonValue)
        : Prisma.DbNull,
    education:
      data.education.length > 0
        ? (data.education as Prisma.InputJsonValue)
        : Prisma.DbNull,
  };
}

export async function getUserProfileRow(
  userId: string,
): Promise<UserProfile | null> {
  return prisma.userProfile.findUnique({
    where: { userId },
  });
}

export async function getUserProfile(
  userId: string,
): Promise<CareerProfileData> {
  const row = await getUserProfileRow(userId);
  if (!row) return { ...EMPTY_CAREER_PROFILE };
  return profileRowToData(row);
}

async function seedProfileFromResume(userId: string): Promise<CareerProfileData> {
  const defaultResume = await prisma.resume.findFirst({
    where: { userId, kind: "BUILT", isDefault: true },
  });

  const source =
    defaultResume ??
    (await prisma.resume.findFirst({
      where: { userId, kind: "BUILT" },
      orderBy: { updatedAt: "desc" },
    }));

  if (source && isBuiltResume(source)) {
    return toResumeFormData(source);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  });

  return {
    ...EMPTY_CAREER_PROFILE,
    fullName: user?.name ?? "",
    email: user?.email ?? "",
  };
}

export async function getOrSeedUserProfile(
  userId: string,
): Promise<CareerProfileData> {
  const existing = await getUserProfileRow(userId);
  if (existing) return profileRowToData(existing);

  const seeded = await seedProfileFromResume(userId);
  const hasContent =
    seeded.fullName.trim() !== "" ||
    seeded.email.trim() !== "" ||
    seeded.summary.trim() !== "" ||
    seeded.skills.trim() !== "" ||
    seeded.experience.length > 0 ||
    seeded.education.length > 0 ||
    seeded.phone ||
    seeded.location;

  if (hasContent) {
    await upsertUserProfile(userId, seeded);
  }

  return seeded;
}

export async function upsertUserProfile(
  userId: string,
  data: CareerProfileData,
): Promise<void> {
  const fields = profileFieldData(data);

  await prisma.userProfile.upsert({
    where: { userId },
    create: { userId, ...fields },
    update: fields,
  });

  if (data.fullName.trim() !== "") {
    await prisma.user.update({
      where: { id: userId },
      data: { name: data.fullName.trim() },
    });
  }
}

export function mergeProfileIntoResumeDefaults(
  profile: CareerProfileData,
  sessionEmail: string,
  emptyDefaults: ResumeProfileFormData,
): ResumeProfileFormData {
  const email =
    profile.email.trim() !== ""
      ? profile.email.trim()
      : sessionEmail || emptyDefaults.email;

  return {
    fullName: profile.fullName || emptyDefaults.fullName,
    email,
    phone: profile.phone,
    location: profile.location,
    website: profile.website,
    linkedIn: profile.linkedIn,
    github: profile.github,
    summary: profile.summary || emptyDefaults.summary,
    skills: profile.skills || emptyDefaults.skills,
    experience: cloneExperienceEntries(profile.experience),
    education: cloneEducationEntries(profile.education),
  };
}
