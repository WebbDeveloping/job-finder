"use client";

import { useMemo, useState } from "react";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import Box from "@mui/material/Box";
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
import { NextLinkButton } from "@/components/NextLinkButton";
import { NextMuiLink } from "@/components/NextMuiLink";
import { AppCard } from "@/components/ui/AppCard";
import { EmptyStatePanel } from "@/components/ui/EmptyStatePanel";
import { PageSection } from "@/components/ui/PageSection";
import { formatDateTime } from "@/lib/datetime";
import { resumeKindHint } from "@/lib/resume-types";

export type DashboardDocumentRow = {
  id: string;
  label: string;
  kind: "resume" | "cover-letter";
  resumeKind?: "BUILT" | "UPLOADED";
  isDefault?: boolean;
  updatedAt: string;
  href: string;
};

type DocumentFilter = "" | "resume" | "cover-letter";

type DashboardDocumentsListProps = {
  documents: DashboardDocumentRow[];
};

function documentTypeLabel(row: DashboardDocumentRow): string {
  if (row.kind === "cover-letter") return "Cover letter";
  if (row.resumeKind) return `Resume · ${resumeKindHint(row.resumeKind)}`;
  return "Resume";
}

function DocumentTypeIcon({ row }: { row: DashboardDocumentRow }) {
  const Icon =
    row.kind === "cover-letter" ? MailOutlineOutlinedIcon : DescriptionOutlinedIcon;
  return (
    <Icon
      fontSize="small"
      sx={{ color: "text.secondary", verticalAlign: "middle", mr: 0.75 }}
    />
  );
}

export function DashboardDocumentsList({ documents }: DashboardDocumentsListProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<DocumentFilter>("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return documents
      .filter((doc) => {
        if (typeFilter && doc.kind !== typeFilter) return false;
        if (!query) return true;
        return (
          doc.label.toLowerCase().includes(query) ||
          documentTypeLabel(doc).toLowerCase().includes(query)
        );
      })
      .sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  }, [documents, search, typeFilter]);

  if (documents.length === 0) {
    return (
      <PageSection title="Documents">
        <EmptyStatePanel
          illustrationSrc="/illustrations/empty-resume.svg"
          title="No documents yet"
          description="Create a resume or cover letter to keep your application materials in one place."
          action={
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <NextLinkButton href="/resume/create" variant="outlined" size="small">
                Create resume
              </NextLinkButton>
              <NextLinkButton
                href="/cover-letters/create"
                variant="outlined"
                size="small"
              >
                Create cover letter
              </NextLinkButton>
            </Stack>
          }
          marginTop={false}
        />
      </PageSection>
    );
  }

  return (
    <PageSection
      title="Documents"
      description={`${documents.length} ${documents.length === 1 ? "item" : "items"} in your library`}
    >
      <AppCard padding="toolbar" sx={{ mb: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ alignItems: { sm: "flex-end" } }}
        >
          <TextField
            label="Search"
            placeholder="Name or type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 200, flex: 1 }}
            size="small"
          />
          <TextField
            label="Type"
            select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as DocumentFilter)}
            sx={{ minWidth: 180 }}
            size="small"
          >
            <MenuItem value="">All types</MenuItem>
            <MenuItem value="resume">Resumes</MenuItem>
            <MenuItem value="cover-letter">Cover letters</MenuItem>
          </TextField>
        </Stack>
      </AppCard>

      {filtered.length === 0 ? (
        <AppCard padding="card" sx={{ textAlign: "center" }}>
          <Typography color="text.secondary">No documents match your filters.</Typography>
        </AppCard>
      ) : (
        <AppCard padding="none">
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((doc) => (
                  <TableRow key={`${doc.kind}-${doc.id}`} hover>
                    <TableCell>
                      <NextMuiLink href={doc.href} underline="hover">
                        {doc.label}
                      </NextMuiLink>
                      {doc.isDefault ? (
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          Default
                        </Typography>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <Box component="span" sx={{ display: "inline-flex", alignItems: "center" }}>
                        <DocumentTypeIcon row={doc} />
                        {documentTypeLabel(doc)}
                      </Box>
                    </TableCell>
                    <TableCell>{formatDateTime(new Date(doc.updatedAt))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AppCard>
      )}
    </PageSection>
  );
}
