"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { NextLinkButton } from "@/components/NextLinkButton";

export function LandingHero() {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--mui-palette-primary-main) 8%, transparent) 0%, transparent 70%)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              <Typography variant="h2" component="h1" sx={{ fontWeight: 700 }}>
                Your job search, organized
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                Job Finder is a free workspace for tracking applications, visualizing
                your pipeline, and building a resume you can export anytime.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <NextLinkButton href="/signup" variant="contained" size="large">
                  Get started free
                </NextLinkButton>
                <NextLinkButton href="/login" variant="outlined" size="large">
                  Sign in
                </NextLinkButton>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: 480,
                mx: "auto",
                aspectRatio: "4 / 3",
              }}
            >
              <Image
                src="/illustrations/hero-job-search.svg"
                alt="Illustration of job applications, analytics, and resume documents"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 480px"
                style={{ objectFit: "contain" }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
