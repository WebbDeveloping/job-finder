import type { Stage } from "@/generated/prisma/client";

/** Sankey-only node for the first transition (fromStage is null). */
export const SANKEY_ENTRY_NODE = "Entry" as const;

export type SankeyNodeId = Stage | typeof SANKEY_ENTRY_NODE;

export type SankeyFilters = {
  dateFrom?: Date;
  dateTo?: Date;
  source?: string;
};

export type SankeyLinkDatum = {
  from: SankeyNodeId;
  to: Stage;
  value: number;
  applicationIds: string[];
};

export type SankeyGraph = {
  nodes: { id: SankeyNodeId; label: string }[];
  links: SankeyLinkDatum[];
};

export type TransitionSelection = {
  from: SankeyNodeId;
  to: Stage;
};
