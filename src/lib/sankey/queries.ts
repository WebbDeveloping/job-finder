import type { Application } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  aggregateSankeyGraph,
  type StageEventWithSource,
} from "@/lib/sankey/aggregate";
import type { SankeyFilters, SankeyGraph } from "@/lib/sankey/types";

export async function fetchStageEventsWithSource(
  userId: string,
): Promise<StageEventWithSource[]> {
  return prisma.stageEvent.findMany({
    where: { application: { userId } },
    include: {
      application: { select: { source: true } },
    },
    orderBy: { timestamp: "asc" },
  });
}

export async function getSankeyGraph(
  userId: string,
  filters: SankeyFilters = {},
): Promise<SankeyGraph> {
  const events = await fetchStageEventsWithSource(userId);
  return aggregateSankeyGraph(events, filters);
}

export async function listDistinctSources(userId: string): Promise<string[]> {
  const rows = await prisma.application.findMany({
    where: { userId, source: { not: null } },
    select: { source: true },
    distinct: ["source"],
    orderBy: { source: "asc" },
  });

  return rows
    .map((r) => r.source)
    .filter((s): s is string => s !== null && s.trim() !== "");
}

export async function getApplicationsByIds(
  userId: string,
  ids: string[],
): Promise<Pick<Application, "id" | "company" | "role" | "source">[]> {
  if (ids.length === 0) return [];

  return prisma.application.findMany({
    where: { userId, id: { in: ids } },
    select: { id: true, company: true, role: true, source: true },
    orderBy: { company: "asc" },
  });
}

export function parseSankeyFilters(searchParams: {
  from?: string;
  to?: string;
  source?: string;
}): SankeyFilters {
  const filters: SankeyFilters = {};

  if (searchParams.from) {
    const dateFrom = new Date(searchParams.from);
    if (!Number.isNaN(dateFrom.getTime())) {
      filters.dateFrom = dateFrom;
    }
  }

  if (searchParams.to) {
    const dateTo = new Date(searchParams.to);
    if (!Number.isNaN(dateTo.getTime())) {
      dateTo.setHours(23, 59, 59, 999);
      filters.dateTo = dateTo;
    }
  }

  if (searchParams.source) {
    filters.source = searchParams.source;
  }

  return filters;
}
