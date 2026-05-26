import type { Application, Stage, StageEvent } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { isTerminalStage } from "@/lib/stages";

export type ApplicationWithEvents = Application & {
  stageEvents: StageEvent[];
};

export function getCurrentStage(events: StageEvent[]): Stage {
  if (events.length === 0) return "Saved";

  const sorted = [...events].sort((a, b) => {
    const timeDiff = b.timestamp.getTime() - a.timestamp.getTime();
    if (timeDiff !== 0) return timeDiff;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return sorted[0]!.toStage;
}

export function getLastStageEventAt(events: StageEvent[]): Date | null {
  if (events.length === 0) return null;

  const sorted = [...events].sort((a, b) => {
    const timeDiff = b.timestamp.getTime() - a.timestamp.getTime();
    if (timeDiff !== 0) return timeDiff;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return sorted[0]!.timestamp;
}

export { isTerminalStage };

export async function listApplications(): Promise<ApplicationWithEvents[]> {
  return prisma.application.findMany({
    include: { stageEvents: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getApplication(
  id: string,
): Promise<ApplicationWithEvents | null> {
  return prisma.application.findUnique({
    where: { id },
    include: { stageEvents: true },
  });
}
