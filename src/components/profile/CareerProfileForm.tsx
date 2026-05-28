"use client";

import { useActionState, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import {
  saveCareerProfile,
  type ProfileActionState,
} from "@/app/(app)/profile/actions";
import { CareerContactFields } from "@/components/career/CareerContactFields";
import { CareerEducationList } from "@/components/career/CareerEducationList";
import { CareerExperienceList } from "@/components/career/CareerExperienceList";
import { CareerSummaryFields } from "@/components/career/CareerSummaryFields";
import {
  ResumeEditorSectionNav,
  type ResumeEditorSection,
} from "@/components/resume/ResumeEditorSectionNav";
import {
  ensureList,
  newEducation,
  newExperience,
} from "@/lib/career-profile-form";
import type { CareerProfileData } from "@/lib/resume-types";

type CareerProfileFormProps = {
  defaultValues: CareerProfileData;
};

const initialState: ProfileActionState = {};

type SectionId = "basics" | "summary" | "experience" | "education";

export function CareerProfileForm({ defaultValues }: CareerProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    saveCareerProfile,
    initialState,
  );
  const [experience, setExperience] = useState(() =>
    ensureList(defaultValues.experience, newExperience),
  );
  const [education, setEducation] = useState(() =>
    ensureList(defaultValues.education, newEducation),
  );
  const [expandedSection, setExpandedSection] = useState<SectionId | false>(
    "basics",
  );

  const sections: ResumeEditorSection[] = [
    {
      id: "basics",
      label: "Basics",
      content: <CareerContactFields defaultValues={defaultValues} />,
    },
    {
      id: "summary",
      label: "Summary",
      content: <CareerSummaryFields defaultValues={defaultValues} />,
    },
    {
      id: "experience",
      label: "Experience",
      content: (
        <CareerExperienceList experience={experience} onChange={setExperience} />
      ),
    },
    {
      id: "education",
      label: "Education",
      content: (
        <CareerEducationList education={education} onChange={setEducation} />
      ),
    },
  ];

  const alerts = (
    <Stack spacing={2} sx={{ mt: 2, px: 2 }}>
      {state.error ? <Alert severity="error">{state.error}</Alert> : null}
      {state.success ? (
        <Alert severity="success">{state.success}</Alert>
      ) : null}
    </Stack>
  );

  const saveFooter = (
    <Paper
      elevation={0}
      sx={{
        position: "sticky",
        bottom: 0,
        mt: 2,
        p: 2,
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        zIndex: 1,
      }}
    >
      <Button type="submit" variant="contained" fullWidth disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </Paper>
  );

  return (
    <Box component="form" action={formAction}>
      <input
        type="hidden"
        name="experienceJson"
        value={JSON.stringify(experience)}
        readOnly
      />
      <input
        type="hidden"
        name="educationJson"
        value={JSON.stringify(education)}
        readOnly
      />

      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        <ResumeEditorSectionNav
          sections={sections}
          expanded={expandedSection}
          onExpandedChange={(id) =>
            setExpandedSection(id as SectionId | false)
          }
          disabled={pending}
          alerts={alerts}
          footer={saveFooter}
        />
      </Paper>
    </Box>
  );
}
