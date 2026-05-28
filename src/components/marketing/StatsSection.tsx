"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { MarketingSection } from "@/components/ui/MarketingSection";
import { TintSurface } from "@/components/ui/TintSurface";

const stats = [
  {
    value: "5K+",
    label: "resumes created",
    offset: { mt: { md: 0 }, mr: { md: 5 } },
  },
  {
    value: "40+",
    label: "resume templates",
    offset: { mt: { xs: 3, md: 6 } },
  },
  {
    value: "3 years",
    label: "of helping job seekers",
    offset: { ml: { md: 5 } },
  },
  {
    value: "2K+",
    label: "applications tracked monthly",
    offset: { mt: { xs: 3, md: 6 } },
  },
] as const;

function StatCard({
  value,
  label,
  offset,
  delayMs,
}: {
  value: string;
  label: string;
  offset: (typeof stats)[number]["offset"];
  delayMs: number;
}) {
  return (
    <TintSurface
      tint="primarySubtle"
      sx={{
        p: 2,
        textAlign: "center",
        borderRadius: 2,
        ...offset,
        "@media (prefers-reduced-motion: no-preference)": {
          opacity: 0,
          animation: `stats-fade-in 0.6s ease-out ${delayMs}ms forwards`,
          "@keyframes stats-fade-in": {
            from: {
              opacity: 0,
              transform: "translateY(12px)",
            },
            to: {
              opacity: 1,
              transform: "translateY(0)",
            },
          },
        },
      }}
    >
      <Typography
        component="p"
        variant="marketingStat"
        sx={{ color: "primary.main", mb: 0.5 }}
      >
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </TintSurface>
  );
}

export function StatsSection() {
  return (
    <MarketingSection
      headingId="stats-section-heading"
      sx={{ position: "relative", overflow: "hidden" }}
      containerSx={{ position: "relative" }}
    >
      <Grid container spacing={{ xs: 5, md: 6 }} sx={{ alignItems: "center" }}>
        <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 1 } }}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid size={{ xs: 6 }}>
              <StatCard {...stats[0]} delayMs={0} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <StatCard {...stats[1]} delayMs={100} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <StatCard {...stats[2]} delayMs={200} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <StatCard {...stats[3]} delayMs={300} />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
          <Stack
            spacing={2.5}
            sx={{
              pl: { md: 2 },
              "@media (prefers-reduced-motion: no-preference)": {
                "& > *": {
                  opacity: 0,
                  animation: "stats-copy-fade-in 0.7s ease-out forwards",
                },
                "& > *:nth-of-type(1)": { animationDelay: "350ms" },
                "& > *:nth-of-type(2)": { animationDelay: "450ms" },
                "& > *:nth-of-type(3)": { animationDelay: "550ms" },
                "@keyframes stats-copy-fade-in": {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
              },
            }}
          >
            <Typography id="stats-section-heading" variant="marketingSectionTitle" component="h2">
              Chosen by{" "}
              <Box component="span" sx={{ color: "primary.main" }}>
                thousands
              </Box>{" "}
              of job applicants building smarter searches
            </Typography>

            <Typography variant="marketingLead" color="text.secondary">
              Job Finder is a free workspace for tracking applications and building
              resumes with personality and polish. Our tools help at every step of the
              hunt—emphasizing your experience, progress, and the story behind each
              application.
            </Typography>

            <Typography variant="marketingLead" color="text.secondary">
              We combine flexible, ATS-friendly templates with an intuitive editor and
              a pipeline view that keeps stages clear. Export polished PDFs when you
              apply, and keep cover letters and notes alongside each role so your
              search stays organized end to end.
            </Typography>

            <Typography variant="marketingLead" color="text.secondary">
              We believe the best job searches feel human. That is why Job Finder helps
              you personalize resumes and track real conversations—so you stand out,
              stay confident, and land interviews that align with your goals.
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </MarketingSection>
  );
}
