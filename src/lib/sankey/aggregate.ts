import type { Stage, StageEvent } from "@/generated/prisma/client";
import { ALL_STAGES, formatStage } from "@/lib/stages";
import {
  SANKEY_ENTRY_NODE,
  type SankeyFilters,
  type SankeyGraph,
  type SankeyLinkDatum,
  type SankeyNodeId,
} from "@/lib/sankey/types";

export type StageEventWithSource = StageEvent & {
  application: { source: string | null };
};

function nodeId(fromStage: Stage | null): SankeyNodeId {
  return fromStage ?? SANKEY_ENTRY_NODE;
}

function linkKey(from: SankeyNodeId, to: Stage): string {
  return `${from}\0${to}`;
}

function passesFilters(
  event: StageEventWithSource,
  filters: SankeyFilters,
): boolean {
  if (filters.dateFrom && event.timestamp < filters.dateFrom) return false;
  if (filters.dateTo && event.timestamp > filters.dateTo) return false;
  if (filters.source !== undefined && filters.source !== "") {
    const appSource = event.application.source ?? "";
    if (appSource !== filters.source) return false;
  }
  return true;
}

export function aggregateSankeyGraph(
  events: StageEventWithSource[],
  filters: SankeyFilters = {},
): SankeyGraph {
  const buckets = new Map<
    string,
    { from: SankeyNodeId; to: Stage; applicationIds: Set<string> }
  >();

  for (const event of events) {
    if (!passesFilters(event, filters)) continue;

    const from = nodeId(event.fromStage);
    const to = event.toStage;
    const key = linkKey(from, to);

    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { from, to, applicationIds: new Set() };
      buckets.set(key, bucket);
    }
    bucket.applicationIds.add(event.applicationId);
  }

  const links: SankeyLinkDatum[] = [...buckets.values()].map((b) => ({
    from: b.from,
    to: b.to,
    value: b.applicationIds.size,
    applicationIds: [...b.applicationIds],
  }));

  const nodeSet = new Set<SankeyNodeId>();
  for (const link of links) {
    nodeSet.add(link.from);
    nodeSet.add(link.to);
  }

  const nodeOrder = new Map<SankeyNodeId, number>();
  nodeOrder.set(SANKEY_ENTRY_NODE, -1);
  ALL_STAGES.forEach((stage, index) => {
    nodeOrder.set(stage, index);
  });

  const nodes = [...nodeSet].sort(
    (a, b) => (nodeOrder.get(a) ?? 999) - (nodeOrder.get(b) ?? 999),
  ).map((id) => ({
    id,
    label: id === SANKEY_ENTRY_NODE ? formatStage(null) : formatStage(id),
  }));

  return { nodes, links };
}

export function getApplicationsForTransition(
  events: StageEventWithSource[],
  from: SankeyNodeId,
  to: Stage,
  filters: SankeyFilters = {},
): string[] {
  const ids = new Set<string>();

  for (const event of events) {
    if (!passesFilters(event, filters)) continue;
    if (nodeId(event.fromStage) !== from || event.toStage !== to) continue;
    ids.add(event.applicationId);
  }

  return [...ids];
}
