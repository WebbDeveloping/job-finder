"use client";

import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { HeroResumeFold } from "@/components/marketing/HeroResumeFold";
import { HeroTemplateCarousel } from "@/components/marketing/HeroTemplateCarousel";
import { NextLinkButton } from "@/components/NextLinkButton";
import { MarketingSection } from "@/components/ui/MarketingSection";
import { StarRating } from "@/components/ui/StarRating";
import {
  AGGREGATE_RATING,
  REVIEW_COUNT,
} from "@/lib/marketing/social-proof";

import type { ReactNode } from "react";

function HeroAccentText({ children }: { children: ReactNode }) {
  return (
    <Box component="span" sx={{ color: "primary.main" }}>
      {children}
    </Box>
  );
}

function HeroSocialProof() {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 2, sm: 3 }}
      sx={{
        alignItems: { xs: "center", md: "flex-start" },
        flexWrap: "wrap",
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: "center", flexWrap: "wrap", justifyContent: { xs: "center", md: "flex-start" } }}
      >
        <StarRating rating={AGGREGATE_RATING} size="medium" />
        <Typography variant="subtitle2">
          <strong>{REVIEW_COUNT} Reviews</strong>
        </Typography>
      </Stack>

      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: "center", justifyContent: { xs: "center", md: "flex-start" } }}
      >
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            justifyContent: "center",
            width: 44,
            height: 44,
            borderRadius: "50%",
            bgcolor: "primary.main",
            color: "primary.contrastText",
          }}
        >
          <ForumOutlinedIcon sx={{ fontSize: 22 }} />
        </Box>
        <Typography variant="body2">
          <strong>2K+ users</strong> tracked applications last month
        </Typography>
      </Stack>
    </Stack>
  );
}

export function LandingHero() {
  return (
    <MarketingSection
      tone="light"
      py="hero"
      headingId="landing-hero-heading"
      sx={{ pb: { xs: 3, md: 4 } }}
    >
      <Grid
        container
        spacing={{ xs: 4, md: 3, lg: 4 }}
        sx={{ alignItems: "center", mb: { xs: 2, md: 0 } }}
      >
        <Grid
          size={{ xs: 12, md: 7 }}
          sx={{
            textAlign: { xs: "center", md: "left" },
            pb: { md: 8, lg: 10 },
          }}
        >
          <Stack spacing={3} sx={{ maxWidth: { md: 640 } }}>
            <Typography
              id="landing-hero-heading"
              variant="marketingHeroTitle"
              component="h1"
            >
              Land more interviews with Job Finder&apos;s{" "}
              <HeroAccentText>Resume Builder</HeroAccentText>
            </Typography>

            <Typography variant="marketingLead" color="text.secondary">
              ATS-friendly templates, a visual application pipeline, and one workspace
              to tailor your resume for every role—so recruiters see a polished fit, fast.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                justifyContent: { xs: "center", md: "flex-start" },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <NextLinkButton
                href="/signup"
                variant="contained"
                size="large"
                fullWidth
                sx={{ maxWidth: { xs: "100%", sm: "none" } }}
              >
                Build your resume
              </NextLinkButton>
              <NextLinkButton
                href="/signup"
                variant="outlined"
                size="large"
                fullWidth
                sx={{ maxWidth: { xs: "100%", sm: "none" } }}
              >
                Track your pipeline
              </NextLinkButton>
            </Stack>

            <HeroSocialProof />
          </Stack>
        </Grid>

        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{
            position: "relative",
            pt: { xs: 1, sm: 2, md: 0 },
          }}
        >
          <HeroResumeFold />
        </Grid>
      </Grid>

      <HeroTemplateCarousel />
    </MarketingSection>
  );
}
