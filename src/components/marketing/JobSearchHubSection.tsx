"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import { NextMuiLink } from "@/components/NextMuiLink";
import {
  SectionFlowLines,
  SectionFlowLinesCorner,
} from "@/components/marketing/decorations";
import { HubPanelVisual } from "@/components/marketing/hub";
import { MarketingDarkText, MarketingSection } from "@/components/ui/MarketingSection";
import { surfaceTints } from "@/theme/tokens";

type BulletItem = {
  icon: ReactElement<SvgIconProps>;
  text: string;
  tone: "primary" | "secondary" | "info" | "warning";
};

type HubPanel = {
  id: string;
  label: string;
  title: string;
  description: React.ReactNode;
  templateIndex: number;
  bullets: BulletItem[];
};

const hubPanels: HubPanel[] = [
  {
    id: "resume-builder",
    label: "Resume Builder",
    title: "Start with a resume that lands interviews",
    description: (
      <>
        Your search starts with the resume. Job Finder&apos;s{" "}
        <NextMuiLink
          href="/signup"
          underline="always"
          variant="subtitle2"
          sx={{ color: "primary.light" }}
        >
          resume builder
        </NextMuiLink>{" "}
        keeps every section structured, editable, and ready to export when you apply.
      </>
    ),
    templateIndex: 0,
    bullets: [
      {
        icon: <GridViewOutlinedIcon />,
        text: "Experience, education, skills, and summary in one editor.",
        tone: "primary",
      },
      {
        icon: <AutoAwesomeOutlinedIcon />,
        text: "Live preview while you edit so layout surprises never slip through.",
        tone: "secondary",
      },
      {
        icon: <DescriptionOutlinedIcon />,
        text: "Reuse the same profile across templates without retyping.",
        tone: "info",
      },
    ],
  },
  {
    id: "templates",
    label: "Templates",
    title: "Pick a layout that fits the role",
    description:
      "Swap between professional templates with readable typography and ATS-friendly section headings—your content stays intact.",
    templateIndex: 1,
    bullets: [
      {
        icon: <GridViewOutlinedIcon />,
        text: "Single- and multi-column layouts for different industries.",
        tone: "primary",
      },
      {
        icon: <AutoAwesomeOutlinedIcon />,
        text: "Consistent spacing and fonts recruiters expect.",
        tone: "secondary",
      },
      {
        icon: <DescriptionOutlinedIcon />,
        text: "Preview changes instantly before you download.",
        tone: "info",
      },
    ],
  },
  {
    id: "pdf-export",
    label: "PDF Export",
    title: "Send a polished PDF with every application",
    description:
      "When you are ready to apply, export a clean PDF from the same resume you have been editing—no copy-paste into a separate tool.",
    templateIndex: 2,
    bullets: [
      {
        icon: <PictureAsPdfOutlinedIcon />,
        text: "One-click download from your resume workspace.",
        tone: "primary",
      },
      {
        icon: <DescriptionOutlinedIcon />,
        text: "Layouts designed to print and parse reliably.",
        tone: "info",
      },
      {
        icon: <AutoAwesomeOutlinedIcon />,
        text: "Keep versions aligned with the applications you track.",
        tone: "secondary",
      },
    ],
  },
  {
    id: "notes",
    label: "Application Notes",
    title: "Keep context next to every role",
    description:
      "Store recruiter names, follow-up dates, and talking points beside each application so nothing lives in a scattered doc.",
    templateIndex: 3,
    bullets: [
      {
        icon: <NotesOutlinedIcon />,
        text: "Notes and metadata tied to a single application record.",
        tone: "primary",
      },
      {
        icon: <TimelineOutlinedIcon />,
        text: "See stage history when you pick up a thread days later.",
        tone: "warning",
      },
      {
        icon: <DescriptionOutlinedIcon />,
        text: "Stay organized without juggling spreadsheets and docs.",
        tone: "info",
      },
    ],
  },
  {
    id: "job-tracker",
    label: "Job Tracker",
    title: "Stay on top of every role you chase",
    description: (
      <>
        As applications pile up, the{" "}
        <NextMuiLink
          href="/signup"
          underline="always"
          variant="subtitle2"
          sx={{ color: "primary.light" }}
        >
          application tracker
        </NextMuiLink>{" "}
        keeps statuses, companies, and next steps in one view.
      </>
    ),
    templateIndex: 4,
    bullets: [
      {
        icon: <TimelineOutlinedIcon />,
        text: "Move roles from wishlist to applied, interview, and offer.",
        tone: "primary",
      },
      {
        icon: <NotesOutlinedIcon />,
        text: "Log stage changes with timestamps you can revisit.",
        tone: "warning",
      },
      {
        icon: <DescriptionOutlinedIcon />,
        text: "Filter and sort so the hottest leads stay on top.",
        tone: "info",
      },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    title: "See where your funnel needs attention",
    description:
      "Sankey-style analytics show how applications flow through your pipeline—spot bottlenecks and focus your energy.",
    templateIndex: 5,
    bullets: [
      {
        icon: <AnalyticsOutlinedIcon />,
        text: "Visualize volume at each stage of your search.",
        tone: "primary",
      },
      {
        icon: <TimelineOutlinedIcon />,
        text: "Understand conversion between applied and interview.",
        tone: "warning",
      },
      {
        icon: <AutoAwesomeOutlinedIcon />,
        text: "Make data-informed decisions about where to apply next.",
        tone: "secondary",
      },
    ],
  },
  {
    id: "workspace",
    label: "All-in-One Workspace",
    title: "Run your entire job search in one place",
    description:
      "Most people stitch together spreadsheets, docs, and PDF tools. Job Finder puts resumes, tracking, and analytics under one roof.",
    templateIndex: 6,
    bullets: [
      {
        icon: <DashboardOutlinedIcon />,
        text: "Dashboard overview of active applications and progress.",
        tone: "warning",
      },
      {
        icon: <DescriptionOutlinedIcon />,
        text: "Resume builder and tracker share the same account.",
        tone: "primary",
      },
      {
        icon: <AnalyticsOutlinedIcon />,
        text: "Free to start—add your first application in minutes.",
        tone: "info",
      },
    ],
  },
];

const DEFAULT_PANEL_ID = "workspace";

const toneStyles = {
  primary: {
    color: "primary.main",
    bgcolor: "color-mix(in srgb, var(--mui-palette-primary-main) 16%, transparent)",
  },
  secondary: {
    color: "secondary.main",
    bgcolor: "color-mix(in srgb, var(--mui-palette-secondary-main) 16%, transparent)",
  },
  info: {
    color: "info.main",
    bgcolor: "color-mix(in srgb, var(--mui-palette-info-main) 16%, transparent)",
  },
  warning: {
    color: "warning.main",
    bgcolor: "color-mix(in srgb, var(--mui-palette-warning-main) 16%, transparent)",
  },
} as const;

function HubBullet({ icon, text, tone }: BulletItem) {
  const styles = toneStyles[tone];

  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
      <Box
        sx={{
          width: 64,
          height: 64,
          flexShrink: 0,
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...styles,
          "& .MuiSvgIcon-root": { fontSize: 28 },
        }}
      >
        {icon}
      </Box>
      <Typography variant="body1" sx={{ color: "common.white", m: 0 }}>
        {text}
      </Typography>
    </Stack>
  );
}

function HubPanelImage({ panel }: { panel: HubPanel }) {
  return <HubPanelVisual panelId={panel.id} imageAlt={panel.title} />;
}

function HubPanelContent({ panel }: { panel: HubPanel }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gridTemplateRows: { md: "auto auto" },
        gap: { xs: 3, md: 6 },
        minHeight: { md: 520 },
        p: { xs: 2.5, md: 6 },
        borderRadius: 1,
        boxShadow: 2,
        bgcolor: surfaceTints.darkSurface,
        "@media (prefers-reduced-motion: no-preference)": {
          animation: "hub-panel-in 0.35s ease-out",
          "@keyframes hub-panel-in": {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
        },
      }}
    >
      <Box sx={{ order: { xs: 1, md: 1 }, alignSelf: { md: "flex-end" } }}>
        <Typography
          variant="marketingFeatureTitle"
          component="h3"
          sx={{ color: "common.white", m: 0 }}
        >
          {panel.title}
        </Typography>
      </Box>

      <Box
        sx={{
          order: { xs: 2, md: 2 },
          gridRow: { md: "1 / 3" },
          gridColumn: { md: 2 },
          alignSelf: "center",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <HubPanelImage panel={panel} />
      </Box>

      <Box sx={{ order: { xs: 3, md: 3 }, alignSelf: { md: "flex-start" } }}>
        <Typography variant="marketingLead" sx={{ color: "common.white", mb: 3 }}>
          {panel.description}
        </Typography>
        <Stack spacing={1.5} component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
          {panel.bullets.map((bullet) => (
            <Box key={bullet.text} component="li">
              <HubBullet {...bullet} />
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

export function JobSearchHubSection() {
  const defaultIndex = hubPanels.findIndex((p) => p.id === DEFAULT_PANEL_ID);
  const [activeIndex, setActiveIndex] = useState(defaultIndex >= 0 ? defaultIndex : 0);
  const activePanel = hubPanels[activeIndex]!;

  return (
    <MarketingSection
      headingId="job-search-hub-heading"
      tone="dark"
      py="spacious"
      sx={{ position: "relative", overflow: "hidden" }}
      containerSx={{ position: "relative", zIndex: 1, px: { xs: 3, md: 6 } }}
    >
      <SectionFlowLinesCorner />
      <SectionFlowLines
        sx={{
          display: { xs: "none", lg: "flex" },
          justifyContent: "flex-end",
          alignItems: "flex-start",
          inset: "auto",
          top: 40,
          right: -40,
          left: "auto",
          bottom: "auto",
          width: { lg: 420 },
          opacity: 0.18,
        }}
      />
      <MarketingDarkText>
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
          <Typography
            id="job-search-hub-heading"
            variant="marketingSectionTitle"
            component="h2"
            sx={{ mb: 2 }}
          >
            One place to run your entire job search
          </Typography>
          <Typography variant="marketingLead" sx={{ color: "grey.300", mb: 3, maxWidth: 720, mx: "auto" }}>
            Most people stitch together three or four tools to apply. Job Finder puts
            building, tracking, and analytics under one roof.
          </Typography>

          <Box
            role="tablist"
            aria-label="Job search features"
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: { md: "center" },
              overflowX: "auto",
              pb: 1.5,
              mx: { xs: -3, md: 0 },
              px: { xs: 3, md: 0 },
              flexWrap: { md: "wrap" },
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {hubPanels.map((panel, index) => {
              const active = index === activeIndex;

              return (
                <Button
                  key={panel.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveIndex(index)}
                  sx={{
                    flexShrink: 0,
                    px: 3,
                    py: 1,
                    borderRadius: 999,
                    fontSize: "0.875rem",
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    border: 2,
                    borderColor: "transparent",
                    bgcolor: active ? "primary.main" : "grey.700",
                    color: active ? "common.white" : "grey.300",
                    "&:hover": {
                      bgcolor: active ? "primary.dark" : "grey.600",
                    },
                  }}
                >
                  {panel.label}
                </Button>
              );
            })}
          </Box>
        </Box>

        <Box role="tabpanel" aria-labelledby={`hub-tab-${activePanel.id}`}>
          <HubPanelContent key={activePanel.id} panel={activePanel} />
        </Box>
      </MarketingDarkText>
    </MarketingSection>
  );
}
