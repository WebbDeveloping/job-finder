"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  sankey,
  sankeyLinkHorizontal,
  type SankeyGraph as D3SankeyGraph,
  type SankeyLink,
  type SankeyNode,
} from "d3-sankey";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import type { Stage } from "@/generated/prisma/client";
import type { SankeyGraph, SankeyNodeId } from "@/lib/sankey/types";
import { SANKEY_ENTRY_NODE } from "@/lib/sankey/types";
import { formatStage } from "@/lib/stages";

type SankeyNodeDatum = {
  id: SankeyNodeId;
  label: string;
};

type LayoutNode = SankeyNode<SankeyNodeDatum, SankeyLinkDatum>;
type LayoutLink = SankeyLink<SankeyNodeDatum, SankeyLinkDatum>;

type SankeyLinkDatum = {
  source: SankeyNodeId;
  target: SankeyNodeId;
  value: number;
  from: SankeyNodeId;
  to: Stage;
  applicationIds: string[];
};

export type SankeyLinkSelection = {
  from: SankeyNodeId;
  to: Stage;
  applicationIds: string[];
};

type SankeyChartProps = {
  graph: SankeyGraph;
  selectedLink?: { from: SankeyNodeId; to: Stage } | null;
  onLinkSelect: (selection: SankeyLinkSelection | null) => void;
};

const MARGIN = { top: 16, right: 120, bottom: 16, left: 8 };

const NODE_COLORS: Record<string, string> = {
  Entry: "#71717a",
  JobsAppliedTo: "#3b82f6",
  Replies: "#6366f1",
  Rejection: "#ef4444",
  NoReply: "#f97316",
  InitialInterview: "#8b5cf6",
  Interview2: "#a855f7",
  Interview3: "#d946ef",
  RepliedTooLate: "#ea580c",
  TaskRequested: "#0ea5e9",
  NoTaskRequested: "#f59e0b",
  RejectedByMe: "#dc2626",
  RejectedByCompany: "#b91c1c",
  FinalInterview: "#7c3aed",
  OfferReceived: "#22c55e",
  RejectedBeforeOffer: "#f43f5e",
  Rejected: "#ef4444",
  Accepted: "#10b981",
};

function nodeColor(id: SankeyNodeId): string {
  return NODE_COLORS[id] ?? "#71717a";
}

function nodeIdFromEndpoint(
  endpoint: LayoutLink["source"],
  fallback: SankeyNodeId,
): SankeyNodeId {
  if (typeof endpoint === "string") return endpoint as SankeyNodeId;
  const node = endpoint as SankeyNodeDatum;
  return node.id ?? fallback;
}

function getLinkEndpoints(link: LayoutLink): {
  from: SankeyNodeId;
  to: Stage;
  applicationIds: string[];
} {
  const extras = link as LayoutLink & SankeyLinkDatum;

  return {
    from: nodeIdFromEndpoint(link.source, extras.from),
    to: nodeIdFromEndpoint(link.target, extras.to) as Stage,
    applicationIds: extras.applicationIds,
  };
}

function formatLinkTitle(from: SankeyNodeId, to: Stage, value: number): string {
  const fromLabel =
    from === SANKEY_ENTRY_NODE ? formatStage(null) : formatStage(from);
  return `${fromLabel} → ${formatStage(to)}: ${value} application${value === 1 ? "" : "s"}`;
}

export function SankeyChart({
  graph,
  selectedLink,
  onLinkSelect,
}: SankeyChartProps) {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setWidth(Math.max(320, entry.contentRect.width));
      }
    });

    observer.observe(el);
    setWidth(Math.max(320, el.clientWidth));

    return () => observer.disconnect();
  }, []);

  const height = Math.max(280, graph.nodes.length * 36 + 80);
  const innerWidth = width - MARGIN.left - MARGIN.right;
  const innerHeight = height - MARGIN.top - MARGIN.bottom;

  const layout = useMemo(() => {
    if (graph.links.length === 0) return null;

    const nodeById = new Map<SankeyNodeId, SankeyNodeDatum>();
    for (const node of graph.nodes) {
      nodeById.set(node.id, { id: node.id, label: node.label });
    }

    const nodes: SankeyNodeDatum[] = graph.nodes.map((n) => ({
      id: n.id,
      label: n.label,
    }));

    const links: SankeyLinkDatum[] = [];

    for (const link of graph.links) {
      if (!nodeById.has(link.from) || !nodeById.has(link.to)) continue;

      links.push({
        source: link.from,
        target: link.to,
        value: link.value,
        from: link.from,
        to: link.to,
        applicationIds: link.applicationIds,
      });
    }

    if (links.length === 0) return null;

    const generator = sankey<SankeyNodeDatum, SankeyLinkDatum>()
      .nodeId((d) => d.id)
      .nodeWidth(18)
      .nodePadding(14)
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ]);

    const input: D3SankeyGraph<SankeyNodeDatum, SankeyLinkDatum> = {
      nodes: nodes.map((d) => ({ ...d })),
      links: links.map((d) => ({ ...d })),
    };

    return generator(input);
  }, [graph, innerWidth, innerHeight]);

  const isSelected = (from: SankeyNodeId, to: Stage) =>
    selectedLink?.from === from && selectedLink?.to === to;

  const labelFill = theme.palette.text.secondary;
  const linkStroke = theme.palette.divider;
  const linkStrokeSelected = theme.palette.text.primary;

  return (
    <Box ref={containerRef} sx={{ width: "100%" }}>
      {layout ? (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label="Pipeline flow between stages"
          style={{ overflow: "visible" }}
        >
          <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
            {layout.links.map((link, i) => {
              const datum = link as LayoutLink;
              const path = sankeyLinkHorizontal()(datum);
              if (!path) return null;

              const { from, to, applicationIds } = getLinkEndpoints(datum);
              const selected = isSelected(from, to);
              const value = datum.value ?? 0;

              return (
                <path
                  key={`link-${i}`}
                  d={path}
                  fill="none"
                  stroke={selected ? linkStrokeSelected : linkStroke}
                  strokeOpacity={selected ? 0.55 : 0.35}
                  strokeWidth={Math.max(1, datum.width ?? 1)}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    onLinkSelect(
                      selected
                        ? null
                        : {
                            from,
                            to,
                            applicationIds,
                          },
                    )
                  }
                >
                  <title>{formatLinkTitle(from, to, value)}</title>
                </path>
              );
            })}

            {layout.nodes.map((node, i) => {
              const datum = node as LayoutNode;
              const color = nodeColor(datum.id);

              return (
                <g key={`node-${i}`}>
                  <rect
                    x={datum.x0 ?? 0}
                    y={datum.y0 ?? 0}
                    width={(datum.x1 ?? 0) - (datum.x0 ?? 0)}
                    height={(datum.y1 ?? 0) - (datum.y0 ?? 0)}
                    fill={color}
                    rx={3}
                  />
                  <text
                    x={(datum.x1 ?? 0) + 8}
                    y={((datum.y0 ?? 0) + (datum.y1 ?? 0)) / 2}
                    dy="0.35em"
                    fill={labelFill}
                    fontSize={12}
                  >
                    {datum.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 192,
            border: 1,
            borderStyle: "dashed",
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No stage transitions match the current filters.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
