"use client";

import type { ReactElement } from "react";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import {
  SectionFlowLines,
  SectionMobileArc,
} from "@/components/marketing/decorations";
import { InvertedButton } from "@/components/ui/InvertedButton";
import { MarketingDarkText, MarketingSection } from "@/components/ui/MarketingSection";

const features = [
  {
    icon: <ContactsOutlinedIcon />,
    label: "Readable contact information",
    align: "flex-start" as const,
  },
  {
    icon: <AccountTreeOutlinedIcon />,
    label: "Full experience section parsing",
    align: "center" as const,
  },
  {
    icon: <RocketLaunchOutlinedIcon />,
    label: "Optimized skills section",
    align: "flex-end" as const,
  },
];

function AtsFeatureRow({
  icon,
  label,
  align,
  delayMs,
}: {
  icon: ReactElement<SvgIconProps>;
  label: string;
  align: (typeof features)[number]["align"];
  delayMs: number;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "nowrap",
        gap: 2,
        py: { xs: 1.5, sm: 2 },
        px: { xs: 0, sm: 1.5 },
        alignSelf: { xs: "stretch", md: align },
        width: { md: align === "flex-start" ? "auto" : "fit-content" },
        maxWidth: "100%",
        "@media (prefers-reduced-motion: no-preference)": {
          opacity: 0,
          animation: `ats-slide-in 0.55s ease-out ${delayMs}ms forwards`,
          "@keyframes ats-slide-in": {
            from: {
              opacity: 0,
              transform: "translateX(16px)",
            },
            to: {
              opacity: 1,
              transform: "translateX(0)",
            },
          },
        },
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "common.white",
          borderRadius: 1.5,
          p: 1.25,
          color: "primary.main",
          "& .MuiSvgIcon-root": { fontSize: 28 },
        }}
      >
        {icon}
      </Box>
      <Typography variant="marketingFeatureTitle" sx={{ color: "common.white", lineHeight: 1.35 }}>
        {label}
      </Typography>
    </Box>
  );
}

export function AtsSection() {
  return (
    <MarketingSection
      headingId="ats-section-heading"
      tone="dark"
      sx={{ position: "relative", overflow: "hidden" }}
      containerSx={{ position: "relative", zIndex: 1 }}
    >
      <SectionFlowLines />
      <SectionMobileArc />

      <MarketingDarkText>
        <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={3}>
              <Typography
                id="ats-section-heading"
                variant="marketingSectionTitle"
                component="h2"
              >
                Resumes optimized for Applicant Tracking Systems (ATS)
              </Typography>

              <Typography variant="marketingLead" sx={{ color: "grey.300", maxWidth: 520 }}>
                All Job Finder resume templates are designed with Applicant Tracking
                Systems in mind so your content stays easy to parse. Clean layouts,
                readable fonts, and standard section titles help nothing get lost in
                the software—while still looking polished when a recruiter opens the
                PDF.
              </Typography>

              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <InvertedButton href="/signup" size="large">
                  Build an ATS-friendly resume
                </InvertedButton>
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }} sx={{ ml: { md: "auto" } }}>
            <Stack spacing={{ xs: 0.5, md: 2 }}>
              {features.map(({ icon, label, align }, index) => (
                <AtsFeatureRow
                  key={label}
                  icon={icon}
                  label={label}
                  align={align}
                  delayMs={index * 120}
                />
              ))}
            </Stack>

            <Box
              sx={{
                display: { xs: "flex", sm: "none" },
                justifyContent: "center",
                mt: 3,
              }}
            >
              <InvertedButton href="/signup" size="large" sx={{ width: { xs: "100%", sm: "auto" } }}>
                Build an ATS-friendly resume
              </InvertedButton>
            </Box>
          </Grid>
        </Grid>
      </MarketingDarkText>
    </MarketingSection>
  );
}
