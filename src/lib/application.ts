import type {
  Application,
  Resume,
  Stage,
  StageEvent,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { isTerminalStage } from "@/lib/stages";

export type ApplicationWithEvents = Application & {
  stageEvents: StageEvent[];
  resume: Resume | null;
};

/** Most recently logged transition (createdAt), not the latest backdated "when" value. */
function sortStageEventsByRecency(events: StageEvent[]): StageEvent[] {
  return [...events].sort((a, b) => {
    const createdDiff = b.createdAt.getTime() - a.createdAt.getTime();
    if (createdDiff !== 0) return createdDiff;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });
}

export function getCurrentStage(events: StageEvent[]): Stage {
  if (events.length === 0) return "JobsAppliedTo";
  return sortStageEventsByRecency(events)[0]!.toStage;
}

export function getLastStageEventAt(events: StageEvent[]): Date | null {
  if (events.length === 0) return null;
  return sortStageEventsByRecency(events)[0]!.timestamp;
}

export { isTerminalStage };

export async function listApplications(
  userId: string,
): Promise<ApplicationWithEvents[]> {
  return prisma.application.findMany({
    where: { userId },
    include: { stageEvents: true, resume: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getApplication(
  id: string,
  userId: string,
): Promise<ApplicationWithEvents | null> {
  return prisma.application.findFirst({
    where: { id, userId },
    include: { stageEvents: true, resume: true },
  });
}
