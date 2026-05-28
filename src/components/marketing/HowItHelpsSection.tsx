"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { SectionDotGrid } from "@/components/marketing/decorations";
import { TemplatesFeatureVisual } from "@/components/marketing/TemplatesFeatureVisual";
import { FeatureBulletList } from "@/components/ui/FeatureBulletList";
import { MarketingSection } from "@/components/ui/MarketingSection";
import {
  HOW_IT_HELPS_ILLUSTRATIONS,
  type HowItHelpsIllustrationKey,
} from "@/lib/marketing/how-it-helps-illustrations";
import { surfaceTints } from "@/theme/tokens";

type FeatureRow = {
  title: string;
  description: string;
  bullets: string[];
  imageAlt: string;
  illustration: HowItHelpsIllustrationKey;
  gradient: string;
};

const featureRows: FeatureRow[] = [
  {
    title: "Track every application in one place",
    description:
      "A visual pipeline keeps stages, notes, and follow-ups tied to each role you are pursuing.",
    bullets: [
      "Kanban-style stages from wishlist to offer",
      "Log interviews, emails, and next steps per role",
      "See where your search needs attention at a glance",
    ],
    imageAlt: "Job application pipeline board with kanban stages",
    illustration: "pipeline",
    gradient: surfaceTints.featureRadialPrimary(),
  },
  {
    title: "Build resumes ready to send",
    description:
      "Edit your profile once, pick a template, and export a polished PDF whenever you apply.",
    bullets: [
      "Experience, education, and skills in structured sections",
      "Live preview while you edit",
      "One-click PDF download for applications",
    ],
    imageAlt: "Resume editor with live preview and PDF export",
    illustration: "resume",
    gradient: surfaceTints.featureRadialInfo(),
  },
  {
    title: "Choose from professional templates",
    description:
      "Present your story in clean, recruiter-friendly formats that still feel personal.",
    bullets: [
      "Single- and multi-column layouts",
      "ATS-friendly typography and section headings",
      "Swap templates without retyping your content",
    ],
    imageAlt: "Gallery of professional resume templates",
    illustration: "templates",
    gradient:
      "radial-gradient(ellipse 80% 70% at 40% 60%, color-mix(in srgb, var(--mui-palette-success-main) 18%, transparent), transparent 68%)",
  },
  {
    title: "Make sure your resume beats the ATS",
    description:
      "Layouts are designed so parsers read your sections clearly and recruiters see a polished PDF.",
    bullets: [
      "Standard section titles parsers recognize",
      "Readable fonts and spacing",
      "Clean structure that exports reliably to PDF",
    ],
    imageAlt: "ATS-friendly resume with section scan checklist",
    illustration: "ats",
    gradient:
      "radial-gradient(ellipse 70% 80% at 60% 50%, color-mix(in srgb, var(--mui-palette-warning-main) 20%, transparent), transparent 70%)",
  },
];

function FeatureIllustration({
  illustration,
  imageAlt,
}: {
  illustration: HowItHelpsIllustrationKey;
  imageAlt: string;
}) {
  if (illustration === "templates") {
    return <TemplatesFeatureVisual imageAlt={imageAlt} />;
  }

  const src = HOW_IT_HELPS_ILLUSTRATIONS[illustration];

  return (
    <Box sx={{ position: "relative", width: "100%", maxWidth: 520, mx: "auto" }}>
      <SectionDotGrid breathe />
      <Paper
        elevation={3}
        sx={{
          overflow: "hidden",
          borderRadius: 2,
          position: "relative",
          bgcolor: "grey.50",
          aspectRatio: "520 / 400",
        }}
      >
        <Image
          src={src}
          alt={imageAlt}
          fill
          sizes="(max-width: 900px) 100vw, 520px"
          style={{ objectFit: "contain" }}
          priority={illustration === "pipeline"}
        />
      </Paper>
    </Box>
  );
}

function FeatureRowBlock({
  title,
  description,
  bullets,
  imageAlt,
  illustration,
  gradient,
  imageFirst,
}: FeatureRow & { imageFirst: boolean }) {
  return (
    <Grid
      container
      spacing={{ xs: 3, md: 6 }}
      sx={{
        alignItems: "center",
        py: { xs: 4, md: 8 },
      }}
    >
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          order: { xs: 1, md: imageFirst ? 1 : 2 },
          position: "relative",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <FeatureIllustration illustration={illustration} imageAlt={imageAlt} />
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              inset: -16,
              background: gradient,
              pointerEvents: "none",
              zIndex: -1,
              borderRadius: 4,
            }}
          />
        </Box>
      </Grid>

      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          order: { xs: 2, md: imageFirst ? 2 : 1 },
          pl: { md: imageFirst ? 5 : 0 },
          pr: { md: imageFirst ? 0 : 5 },
        }}
      >
        <Box
          sx={{
            "@media (prefers-reduced-motion: no-preference)": {
              opacity: 0,
              animation: "how-it-helps-slide-up 0.65s ease-out forwards",
              "@keyframes how-it-helps-slide-up": {
                from: {
                  opacity: 0,
                  transform: "translateY(16px)",
                },
                to: {
                  opacity: 1,
                  transform: "translateY(0)",
                },
              },
            },
          }}
        >
          <Typography variant="marketingFeatureTitle" component="h3" sx={{ mb: 1.5 }}>
            {title}
          </Typography>
          <Typography variant="marketingLead" color="text.secondary" sx={{ mb: 2.5 }}>
            {description}
          </Typography>
          <FeatureBulletList items={bullets} />
        </Box>
      </Grid>
    </Grid>
  );
}

export function HowItHelpsSection() {
  return (
    <MarketingSection
      headingId="how-it-helps-heading"
      tone="light"
      sx={{ bgcolor: "background.paper" }}
    >
      <Paper
        elevation={0}
        sx={{
          textAlign: "center",
          borderRadius: 3,
          py: { xs: 3, md: 4 },
          px: 2,
          mb: { xs: 2, md: 0 },
          bgcolor: "grey.50",
          border: 1,
          borderColor: "divider",
        }}
      >
        <Typography
          id="how-it-helps-heading"
          variant="marketingSectionTitle"
          component="h2"
          sx={{ m: 0 }}
        >
          How Job Finder helps the modern job seeker
        </Typography>
      </Paper>

      {featureRows.map((row, index) => (
        <FeatureRowBlock key={row.title} {...row} imageFirst={index % 2 === 0} />
      ))}
    </MarketingSection>
  );
}
