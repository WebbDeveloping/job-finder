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

export function getCurrentStage(events: StageEvent[]): Stage {
  if (events.length === 0) return "Wishlist";

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
