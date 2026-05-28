"use client";

import { useMemo, useState } from "react";
import { NextMuiLink } from "@/components/NextMuiLink";
import { StageBadge } from "@/components/pipeline/StageBadge";
import type { Stage } from "@/generated/prisma/client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { AppCard } from "@/components/ui/AppCard";
import { PageSection } from "@/components/ui/PageSection";
import { formatDateTime } from "@/lib/datetime";
import { ALL_STAGES, STAGE_LABELS } from "@/lib/stages";

export type DashboardApplicationRow = {
  id: string;
  company: string;
  role: string;
  source: string | null;
  stage: Stage;
  lastUpdatedAt: string | null;
  createdAt: string;
};

type SortKey =
  | "company-asc"
  | "company-desc"
  | "role-asc"
  | "role-desc"
  | "stage-asc"
  | "stage-desc"
  | "updated-desc"
  | "updated-asc"
  | "created-desc"
  | "created-asc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "updated-desc", label: "Last update (newest)" },
  { value: "updated-asc", label: "Last update (oldest)" },
  { value: "company-asc", label: "Company (A–Z)" },
  { value: "company-desc", label: "Company (Z–A)" },
  { value: "role-asc", label: "Role (A–Z)" },
  { value: "role-desc", label: "Role (Z–A)" },
  { value: "stage-asc", label: "Stage (earliest in pipeline)" },
  { value: "stage-desc", label: "Stage (latest in pipeline)" },
  { value: "created-desc", label: "Date added (newest)" },
  { value: "created-asc", label: "Date added (oldest)" },
];

function stageOrder(stage: Stage): number {
  const index = ALL_STAGES.indexOf(stage);
  return index === -1 ? ALL_STAGES.length : index;
}

function compareStrings(a: string, b: string, direction: "asc" | "desc"): number {
  const result = a.localeCompare(b, undefined, { sensitivity: "base" });
  return direction === "asc" ? result : -result;
}

function compareDates(
  a: string | null,
  b: string | null,
  direction: "asc" | "desc",
): number {
  const aTime = a ? new Date(a).getTime() : 0;
  const bTime = b ? new Date(b).getTime() : 0;
  const result = aTime - bTime;
  return direction === "asc" ? result : -result;
}

function sortRows(rows: DashboardApplicationRow[], sortKey: SortKey): DashboardApplicationRow[] {
  const sorted = [...rows];

  switch (sortKey) {
    case "company-asc":
      return sorted.sort((a, b) => compareStrings(a.company, b.company, "asc"));
    case "company-desc":
      return sorted.sort((a, b) => compareStrings(a.company, b.company, "desc"));
    case "role-asc":
      return sorted.sort((a, b) => compareStrings(a.role, b.role, "asc"));
    case "role-desc":
      return sorted.sort((a, b) => compareStrings(a.role, b.role, "desc"));
    case "stage-asc":
      return sorted.sort((a, b) => stageOrder(a.stage) - stageOrder(b.stage));
    case "stage-desc":
      return sorted.sort((a, b) => stageOrder(b.stage) - stageOrder(a.stage));
    case "updated-asc":
      return sorted.sort((a, b) =>
        compareDates(a.lastUpdatedAt, b.lastUpdatedAt, "asc"),
      );
    case "updated-desc":
      return sorted.sort((a, b) =>
        compareDates(a.lastUpdatedAt, b.lastUpdatedAt, "desc"),
      );
    case "created-asc":
      return sorted.sort((a, b) => compareDates(a.createdAt, b.createdAt, "asc"));
    case "created-desc":
      return sorted.sort((a, b) => compareDates(a.createdAt, b.createdAt, "desc"));
    default:
      return sorted;
  }
}

type DashboardApplicationsListProps = {
  applications: DashboardApplicationRow[];
};

export function DashboardApplicationsList({
  applications,
}: DashboardApplicationsListProps) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<Stage | "">("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("updated-desc");

  const sources = useMemo(() => {
    const unique = new Set<string>();
    for (const app of applications) {
      if (app.source?.trim()) unique.add(app.source.trim());
    }
    return [...unique].sort((a, b) => a.localeCompare(b));
  }, [applications]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    const matches = applications.filter((app) => {
      if (stageFilter && app.stage !== stageFilter) return false;
      if (sourceFilter && (app.source?.trim() ?? "") !== sourceFilter) return false;
      if (!query) return true;

      return (
        app.company.toLowerCase().includes(query) ||
        app.role.toLowerCase().includes(query) ||
        (app.source?.toLowerCase().includes(query) ?? false)
      );
    });

    return sortRows(matches, sortKey);
  }, [applications, search, stageFilter, sourceFilter, sortKey]);

  const hasActiveFilters =
    search.trim() !== "" || stageFilter !== "" || sourceFilter !== "";

  const clearFilters = () => {
    setSearch("");
    setStageFilter("");
    setSourceFilter("");
  };

  if (applications.length === 0) {
    return null;
  }

  return (
    <PageSection
      title="Your applications"
      description={`${applications.length} ${applications.length === 1 ? "company" : "companies"} in your pipeline`}
    >
      <AppCard padding="toolbar" sx={{ mb: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ alignItems: { md: "flex-end" }, flexWrap: "wrap" }}
        >
          <TextField
            label="Search"
            placeholder="Company, role, or source"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 200, flex: 1 }}
            size="small"
          />

          <TextField
            label="Stage"
            select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as Stage | "")}
            sx={{ minWidth: 180 }}
            size="small"
          >
            <MenuItem value="">All stages</MenuItem>
            {ALL_STAGES.map((stage) => (
              <MenuItem key={stage} value={stage}>
                {STAGE_LABELS[stage]}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Source"
            select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            sx={{ minWidth: 160 }}
            size="small"
            disabled={sources.length === 0}
          >
            <MenuItem value="">All sources</MenuItem>
            {sources.map((source) => (
              <MenuItem key={source} value={source}>
                {source}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Sort by"
            select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            sx={{ minWidth: 220 }}
            size="small"
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </AppCard>

      {filtered.length === 0 ? (
        <AppCard padding="card" sx={{ textAlign: "center" }}>
          <Typography color="text.secondary" gutterBottom>
            No applications match your filters.
          </Typography>
          {hasActiveFilters ? (
            <Button variant="text" onClick={clearFilters}>
              Clear filters
            </Button>
          ) : null}
        </AppCard>
      ) : (
        <AppCard padding="none">
          <TableContainer>
            <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Company</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Stage</TableCell>
                <TableCell>Last update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((app) => (
                <TableRow key={app.id} hover>
                  <TableCell>
                    <NextMuiLink
                      href={`/applications/${app.id}`}
                      underline="hover"
                    >
                      {app.company}
                    </NextMuiLink>
                  </TableCell>
                  <TableCell>{app.role}</TableCell>
                  <TableCell>{app.source ?? "—"}</TableCell>
                  <TableCell>
                    <StageBadge stage={app.stage} />
                  </TableCell>
                  <TableCell>
                    {app.lastUpdatedAt
                      ? formatDateTime(new Date(app.lastUpdatedAt))
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
        </AppCard>
      )}

      {hasActiveFilters && filtered.length > 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Showing {filtered.length} of {applications.length}
        </Typography>
      ) : null}
    </PageSection>
  );
}
