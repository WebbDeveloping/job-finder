"use client";

import { useState } from "react";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import LaptopOutlinedIcon from "@mui/icons-material/LaptopOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import type { ReactElement } from "react";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import { SectionDecorativeArrow } from "@/components/marketing/decorations";
import { NextLinkButton } from "@/components/NextLinkButton";
import { MarketingSection } from "@/components/ui/MarketingSection";
import { RESUME_TEMPLATE_EXAMPLES } from "@/lib/marketing/resume-template-examples";

type RoleExample = {
  id: string;
  title: string;
  icon: ReactElement<SvgIconProps>;
  templateIndex: number;
};

const roleExamples: RoleExample[] = [
  { id: "business-analyst", title: "Business Analyst", icon: <AnalyticsOutlinedIcon />, templateIndex: 0 },
  { id: "data-scientist", title: "Data Scientist", icon: <StorageOutlinedIcon />, templateIndex: 1 },
  { id: "product-manager", title: "Product Manager", icon: <ManageAccountsOutlinedIcon />, templateIndex: 2 },
  { id: "software-engineer", title: "Software Engineer", icon: <LaptopOutlinedIcon />, templateIndex: 3 },
  { id: "sales", title: "Sales", icon: <WorkOutlineOutlinedIcon />, templateIndex: 4 },
  { id: "teacher", title: "Teacher", icon: <SchoolOutlinedIcon />, templateIndex: 5 },
  { id: "engineer", title: "Engineer", icon: <EngineeringOutlinedIcon />, templateIndex: 6 },
  { id: "accounting", title: "Accounting", icon: <AccountBalanceOutlinedIcon />, templateIndex: 7 },
  { id: "designer", title: "Designer", icon: <PaletteOutlinedIcon />, templateIndex: 0 },
  { id: "marketing", title: "Marketing", icon: <StorefrontOutlinedIcon />, templateIndex: 1 },
];

const DEFAULT_ROLE_INDEX = roleExamples.findIndex((role) => role.id === "marketing");

function RolePickerItem({
  role,
  active,
  onSelect,
}: {
  role: RoleExample;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      role="option"
      onClick={onSelect}
      aria-selected={active}
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "nowrap",
        gap: 1.5,
        width: "100%",
        p: 1,
        border: 0,
        borderRadius: 2,
        cursor: "pointer",
        textAlign: "left",
        bgcolor: active ? "action.selected" : "transparent",
        transition: "background-color 0.2s ease",
        "&:hover": {
          bgcolor: active ? "action.selected" : "action.hover",
        },
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          width: 44,
          height: 44,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: active ? "primary.main" : "grey.100",
          color: active ? "primary.contrastText" : "text.secondary",
          "& .MuiSvgIcon-root": { fontSize: 22 },
        }}
      >
        {role.icon}
      </Box>
      <Typography
        variant="subtitle1"
        sx={{
          color: active ? "primary.main" : "text.primary",
        }}
      >
        {role.title}
      </Typography>
    </Box>
  );
}

export function ResumePickerSection() {
  const [activeIndex, setActiveIndex] = useState(
    DEFAULT_ROLE_INDEX >= 0 ? DEFAULT_ROLE_INDEX : 0,
  );

  const activeRole = roleExamples[activeIndex]!;
  const activeExample =
    RESUME_TEMPLATE_EXAMPLES[activeRole.templateIndex % RESUME_TEMPLATE_EXAMPLES.length]!;

  return (
    <MarketingSection
      headingId="resume-picker-heading"
      sx={{ position: "relative" }}
      containerSx={{ position: "relative", zIndex: 1 }}
    >
      <Grid
        container
        spacing={{ xs: 3, md: 2 }}
        sx={{ justifyContent: "center", alignItems: "flex-start" }}
      >
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ position: "relative", pr: { xl: 4 } }}>
            <Typography
              id="resume-picker-heading"
              variant="marketingSectionTitle"
              component="h2"
              sx={{ mb: 2 }}
            >
              Resume examples tailored for your job and experience
            </Typography>

            <Typography variant="marketingLead" color="text.secondary" sx={{ mb: 3 }}>
              Explore layouts organized by role and seniority—each designed for clear
              structure, readable typography, and templates you can customize in minutes.
            </Typography>

            <NextLinkButton
              href="/login"
              variant="text"
              endIcon={<ArrowForwardIcon />}
              sx={{ px: 0 }}
            >
              Browse examples
            </NextLinkButton>

            <SectionDecorativeArrow />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }} sx={{ pt: { md: 2 }, pl: { md: 2 } }}>
          <Stack spacing={0.5} role="listbox" aria-label="Resume examples by role">
            {roleExamples.map((role, index) => (
              <RolePickerItem
                key={role.id}
                role={role}
                active={index === activeIndex}
                onSelect={() => setActiveIndex(index)}
              />
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }} sx={{ pt: { md: 2 } }}>
          <Box
            sx={{
              position: "relative",
              maxWidth: 420,
              mx: "auto",
            }}
          >
            <Box
              sx={{
                position: "relative",
                borderRadius: 1,
                overflow: "hidden",
                boxShadow: 4,
                bgcolor: "grey.100",
                aspectRatio: "549 / 778",
                "@media (prefers-reduced-motion: no-preference)": {
                  "& .resume-picker-image": {
                    animation: "resume-picker-fade 0.4s ease-out",
                  },
                  "@keyframes resume-picker-fade": {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                  },
                },
              }}
            >
              <Image
                key={activeExample.id}
                className="resume-picker-image"
                src={activeExample.src}
                alt={`${activeRole.title} resume example`}
                fill
                sizes="(max-width: 900px) 90vw, 420px"
                style={{ objectFit: "cover", objectPosition: "top" }}
              />
            </Box>

            <Box
              key={activeRole.id}
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 16,
                px: 2,
                display: "flex",
                justifyContent: "center",
                "@media (prefers-reduced-motion: no-preference)": {
                  animation: "resume-picker-cta 0.5s ease-out",
                  "@keyframes resume-picker-cta": {
                    from: {
                      opacity: 0,
                      transform: "translateY(8px)",
                    },
                    to: {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                },
              }}
            >
              <NextLinkButton
                href="/signup"
                variant="contained"
                size="large"
                fullWidth
                sx={{ maxWidth: 280 }}
              >
                Go to example
              </NextLinkButton>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </MarketingSection>
  );
}
