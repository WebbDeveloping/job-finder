"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Stage } from "@/generated/prisma/client";
import { getApplication, getCurrentStage } from "@/lib/application";
import { requireUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ALL_STAGES } from "@/lib/stages";

export type ActionState = {
  error?: string;
};

function trimOptional(value: FormDataEntryValue | null): string | null {
  if (value === null || typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function requireField(
  value: FormDataEntryValue | null,
  fieldName: string,
): string | ActionState {
  if (value === null || typeof value !== "string") {
    return { error: `${fieldName} is required.` };
  }
  const trimmed = value.trim();
  if (trimmed === "") {
    return { error: `${fieldName} is required.` };
  }
  return trimmed;
}

function parseTimestamp(value: FormDataEntryValue | null): Date | ActionState {
  if (value === null || typeof value !== "string" || value.trim() === "") {
    return new Date();
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return { error: "Invalid timestamp." };
  }
  return parsed;
}

function parseStage(value: FormDataEntryValue | null): Stage | ActionState {
  if (value === null || typeof value !== "string") {
    return { error: "Stage is required." };
  }
  if (!ALL_STAGES.includes(value as Stage)) {
    return { error: "Invalid stage." };
  }
  return value as Stage;
}

export async function createApplication(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const userId = await requireUserId();

  const company = requireField(formData.get("company"), "Company");
  if (typeof company !== "string") return company;

  const role = requireField(formData.get("role"), "Role");
  if (typeof role !== "string") return role;

  const source = trimOptional(formData.get("source"));
  const notes = trimOptional(formData.get("notes"));

  const application = await prisma.application.create({
    data: {
      userId,
      company,
      role,
      source,
      notes,
      stageEvents: {
        create: {
          fromStage: null,
          toStage: "Wishlist",
          timestamp: new Date(),
        },
      },
    },
  });

  revalidatePath("/pipeline");
  revalidatePath("/dashboard");
  redirect(`/pipeline/${application.id}`);
}

export async function updateApplication(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const userId = await requireUserId();

  const company = requireField(formData.get("company"), "Company");
  if (typeof company !== "string") return company;

  const role = requireField(formData.get("role"), "Role");
  if (typeof role !== "string") return role;

  const source = trimOptional(formData.get("source"));
  const notes = trimOptional(formData.get("notes"));

  const existing = await getApplication(id, userId);
  if (!existing) {
    return { error: "Application not found." };
  }

  await prisma.application.update({
    where: { id },
    data: { company, role, source, notes },
  });

  revalidatePath("/pipeline");
  revalidatePath(`/pipeline/${id}`);
  return {};
}

export async function logStageChange(
  applicationId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const userId = await requireUserId();

  const expectedFromStage = formData.get("expectedFromStage");
  if (expectedFromStage === null || typeof expectedFromStage !== "string") {
    return { error: "Current stage is missing." };
  }

  const toStage = parseStage(formData.get("toStage"));
  if (typeof toStage !== "string") return toStage;

  const timestamp = parseTimestamp(formData.get("timestamp"));
  if (!(timestamp instanceof Date)) return timestamp;

  const application = await getApplication(applicationId, userId);
  if (!application) {
    return { error: "Application not found." };
  }

  const currentStage = getCurrentStage(application.stageEvents);
  if (currentStage !== expectedFromStage) {
    return {
      error:
        "Stage has changed. Refresh the page and try again.",
    };
  }

  await prisma.stageEvent.create({
    data: {
      applicationId,
      fromStage: currentStage,
      toStage,
      timestamp,
    },
  });

  await prisma.application.update({
    where: { id: applicationId },
    data: { updatedAt: new Date() },
  });

  revalidatePath("/pipeline");
  revalidatePath(`/pipeline/${applicationId}`);
  return {};
}
