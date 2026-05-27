"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { NextMuiLink } from "@/components/NextMuiLink";
import type { Stage } from "@/generated/prisma/client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SankeyLinkSelection } from "@/components/pipeline/SankeyChart";

const SankeyChart = dynamic(
  () =>
    import("@/components/pipeline/SankeyChart").then((mod) => mod.SankeyChart),
  {
    ssr: false,
    loading: () => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 280,
        }}
      >
        <CircularProgress size={32} aria-label="Loading chart" />
      </Box>
    ),
  },
);
import { StageBadge } from "@/components/pipeline/StageBadge";
import {
  SANKEY_ENTRY_NODE,
  type SankeyGraph,
  type SankeyNodeId,
} from "@/lib/sankey/types";
import { formatStage } from "@/lib/stages";

type ApplicationSummary = {
  id: string;
  company: string;
  role: string;
  source: string | null;
};

type SankeyPanelProps = {
  graph: SankeyGraph;
  applicationsById: Record<string, ApplicationSummary>;
};

function formatTransition(from: SankeyNodeId, to: Stage): string {
  const fromLabel =
    from === SANKEY_ENTRY_NODE ? formatStage(null) : formatStage(from);
  return `${fromLabel} → ${formatStage(to)}`;
}

export function SankeyPanel({ graph, applicationsById }: SankeyPanelProps) {
  const [selection, setSelection] = useState<SankeyLinkSelection | null>(null);

  const selectedApps = selection
    ? selection.applicationIds
        .map((id) => applicationsById[id])
        .filter((app): app is ApplicationSummary => app !== undefined)
    : [];

  return (
    <Stack spacing={3} sx={{ mt: 4 }}>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Band width shows how many applications moved between stages. Click a
          band to see which applications made that transition.
        </Typography>
        <SankeyChart
          graph={graph}
          selectedLink={
            selection ? { from: selection.from, to: selection.to } : null
          }
          onLinkSelect={setSelection}
        />
      </Paper>

      {selection && (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
          >
            <Box>
              <Typography variant="h6">
                {formatTransition(selection.from, selection.to)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedApps.length} application
                {selectedApps.length === 1 ? "" : "s"}
              </Typography>
            </Box>
            <Button size="small" onClick={() => setSelection(null)}>
              Clear
            </Button>
          </Stack>

          {selectedApps.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              No applications found for this transition.
            </Typography>
          ) : (
            <List disablePadding sx={{ mt: 1 }}>
              {selectedApps.map((app, index) => (
                <Box key={app.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    disableGutters
                    sx={{
                      py: 1.5,
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Box>
                      <NextMuiLink
                        href={`/pipeline/${app.id}`}
                        underline="hover"
                        sx={{ fontWeight: 500 }}
                      >
                        {app.company}
                      </NextMuiLink>
                      <Typography variant="body2" color="text.secondary">
                        {app.role}
                        {app.source ? ` · ${app.source}` : ""}
                      </Typography>
                    </Box>
                    <StageBadge stage={selection.to} />
                  </ListItem>
                </Box>
              ))}
            </List>
          )}
        </Paper>
      )}
    </Stack>
  );
}
