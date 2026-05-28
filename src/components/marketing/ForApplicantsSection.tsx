"use client";

import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import {
  SectionCenterGlow,
  SectionConstellationLeft,
  SectionConstellationRight,
} from "@/components/marketing/decorations";
import { MarketingSection } from "@/components/ui/MarketingSection";
import { RESUME_TEMPLATE_EXAMPLES } from "@/lib/marketing/resume-template-examples";

type ApplicantGroup = {
  id: string;
  title: string;
  description: string;
  roles: string[];
  templateIndex: number;
};

const applicantGroups: ApplicantGroup[] = [
  {
    id: "senior",
    title: "Senior professionals & executives",
    description:
      "Layouts emphasize leadership, scope, and outcomes—keep it sharp in one or two pages while tracking every conversation in your pipeline.",
    roles: ["Managers", "Team leads", "Directors and above"],
    templateIndex: 0,
  },
  {
    id: "first-time",
    title: "First-time job seekers",
    description:
      "Templates, examples, and a clear tracker help you start strong—even when you are building experience from internships and projects.",
    roles: ["Summer job applicants", "Recent graduates", "Students entering the workforce"],
    templateIndex: 1,
  },
  {
    id: "structured",
    title: "Professionals seeking structure & ATS-friendly resumes",
    description:
      "Job Finder helps you tailor each application and stay organized. Clean templates highlight transferable skills and measurable results.",
    roles: [
      "Career switchers",
      "Tech and product professionals",
      "Freelancers",
      "Entry-level applicants changing fields",
    ],
    templateIndex: 2,
  },
  {
    id: "creative",
    title: "Creative professionals",
    description:
      "Choose layouts with room for projects and personality while keeping exports polished. Track creative roles alongside corporate ones in one workspace.",
    roles: ["Marketers", "Designers", "Freelancers and consultants", "Creatives"],
    templateIndex: 3,
  },
];

function ApplicantMenuItem({
  title,
  active,
  onSelect,
}: {
  title: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onSelect}
      aria-expanded={active}
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "nowrap",
        gap: 1,
        width: "100%",
        p: 1.5,
        border: 0,
        cursor: "pointer",
        textAlign: "left",
        bgcolor: active ? "action.selected" : "transparent",
        borderRadius: 2,
        transition: "background-color 0.2s ease",
        "&:hover": {
          bgcolor: active ? "action.selected" : "action.hover",
        },
      }}
    >
      {active ? (
        <RadioButtonCheckedIcon sx={{ fontSize: 22, color: "primary.main", flexShrink: 0 }} />
      ) : (
        <Box
          sx={{
            width: 28,
            height: 28,
            flexShrink: 0,
            borderRadius: "50%",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AddIcon sx={{ fontSize: 18 }} />
        </Box>
      )}
      <Typography variant="subtitle1" sx={{ m: 0 }}>
        {title}
      </Typography>
    </Box>
  );
}

function ApplicantPanel({ group }: { group: ApplicantGroup }) {
  const example =
    RESUME_TEMPLATE_EXAMPLES[group.templateIndex % RESUME_TEMPLATE_EXAMPLES.length]!;

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 0.5,
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Grid container spacing={2} sx={{ alignItems: "flex-end" }}>
        <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex", alignItems: "flex-end" }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: { xs: 180, sm: 220 },
            }}
          >
            <Image
              src={example.src}
              alt={group.title}
              fill
              sizes="(max-width: 600px) 100vw, 400px"
              style={{ objectFit: "contain", objectPosition: "bottom" }}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.65 }}>
            {group.description}
          </Typography>
          <Stack spacing={1}>
            {group.roles.map((role) => (
              <Stack key={role} direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <CheckIcon sx={{ fontSize: 24, color: "primary.main", flexShrink: 0 }} />
                <Typography variant="subtitle1" sx={{ m: 0 }}>
                  {role}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}

export function ForApplicantsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <MarketingSection
      headingId="for-applicants-heading"
      maxWidth="md"
      sx={{ position: "relative", overflow: "hidden" }}
      containerSx={{ position: "relative" }}
    >
      <Box sx={{ position: "relative", mx: "auto", maxWidth: 900 }}>
        <SectionConstellationLeft />
        <SectionConstellationRight />
        <SectionCenterGlow />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            id="for-applicants-heading"
            variant="marketingSectionTitle"
            component="h2"
            sx={{ pb: 3, textAlign: { xs: "center", sm: "left" } }}
          >
            For applicants across all career paths
          </Typography>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              border: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Box sx={{ p: 1 }}>
              {applicantGroups.map((group, index) => {
                const active = index === activeIndex;

                return (
                  <Box key={group.id}>
                    <ApplicantMenuItem
                      title={group.title}
                      active={active}
                      onSelect={() => setActiveIndex(index)}
                    />
                    <Collapse in={active} timeout={300}>
                      <ApplicantPanel group={group} />
                    </Collapse>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Box>
      </Box>
    </MarketingSection>
  );
}
