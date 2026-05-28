"use client";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SectionCornerDots } from "@/components/marketing/decorations";
import { NextLinkButton } from "@/components/NextLinkButton";
import { IconBadge } from "@/components/ui/IconBadge";
import { MarketingSection } from "@/components/ui/MarketingSection";

const features = [
  {
    icon: <FactCheckOutlinedIcon />,
    lines: ["ATS-friendly professionally", "designed resumes"],
  },
  {
    icon: <PaletteOutlinedIcon />,
    lines: [
      "Customizable sections,",
      "fonts, colors, and backgrounds",
    ],
  },
  {
    icon: <ViewColumnOutlinedIcon />,
    lines: [
      "Single-column, double-column,",
      "and multiple-page layouts",
    ],
  },
] as const;

export function ResumeBuilderFeaturesSection() {
  return (
    <MarketingSection
      headingId="resume-builder-features-heading"
      py="compact"
      sx={{ position: "relative", overflow: "hidden", pt: 0, pb: { xs: 5, md: 7 } }}
    >
      <SectionCornerDots corner="top-right" />
      <SectionCornerDots corner="top-left" sx={{ display: { xs: "none", md: "block" } }} />
      <Typography
        id="resume-builder-features-heading"
        component="h2"
        sx={{
          position: "absolute",
          width: 1,
          height: 1,
          p: 0,
          m: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        Resume builder features
      </Typography>

      <Grid container spacing={4} sx={{ justifyContent: "center" }}>
        {features.map(({ icon, lines }) => (
          <Grid key={lines[0]} size={{ xs: 12, sm: 4 }}>
            <Stack spacing={2} sx={{ alignItems: "center", textAlign: "center" }}>
              <IconBadge icon={icon} />
              <Box>
                {lines.map((line) => (
                  <Typography
                    key={line}
                    variant="subtitle1"
                    sx={{ lineHeight: 1.45 }}
                  >
                    {line}
                  </Typography>
                ))}
              </Box>
            </Stack>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: "center", mt: 5 }}>
        <NextLinkButton
          href="/login"
          variant="text"
          size="large"
          endIcon={<ArrowForwardIcon />}
        >
          View templates
        </NextLinkButton>
      </Box>
    </MarketingSection>
  );
}
