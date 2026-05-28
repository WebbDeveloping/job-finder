"use client";

import { useRouter } from "next/navigation";
import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { ResumeActionState } from "@/app/(app)/resume/actions";
import { saveBuiltResume } from "@/app/(app)/resume/actions";
import { CareerContactFields } from "@/components/career/CareerContactFields";
import { CareerEducationList } from "@/components/career/CareerEducationList";
import { CareerExperienceList } from "@/components/career/CareerExperienceList";
import { CareerSummaryFields } from "@/components/career/CareerSummaryFields";
import { NextLinkButton } from "@/components/NextLinkButton";
import { ResumeDesignPreview } from "@/components/resume/ResumeDesignPreview";
import { ResumeEditorDesignAside } from "@/components/resume/ResumeEditorDesignAside";
import { ResumeEditorLayout } from "@/components/resume/ResumeEditorLayout";
import {
  ResumeEditorSectionNav,
  type ResumeEditorSection,
} from "@/components/resume/ResumeEditorSectionNav";
import { ResumeTemplateGallery } from "@/components/resume/ResumeTemplateGallery";
import {
  ensureList,
  newEducation,
  newExperience,
  readFormCareerData,
} from "@/lib/career-profile-form";
import type { ResumeTheme } from "@/lib/resume-templates/theme";
import {
  DEFAULT_TEMPLATE_ID,
  themeForTemplateSwitch,
} from "@/lib/resume-templates/registry";
import type { ResumeProfileFormData } from "@/lib/resume-types";

type ResumeEditorFormProps = {
  defaultValues: ResumeProfileFormData;
  resumeId?: string | null;
  label?: string;
  defaultTemplateId?: string;
  defaultTheme?: ResumeTheme | null;
  prefilledFromProfile?: boolean;
};

const initialState: ResumeActionState = {};

type SectionId = "basics" | "summary" | "experience" | "education";

export function ResumeEditorForm({
  defaultValues,
  resumeId = null,
  label = "",
  defaultTemplateId = DEFAULT_TEMPLATE_ID,
  defaultTheme = null,
  prefilledFromProfile = false,
}: ResumeEditorFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    saveBuiltResume,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      router.replace("/resume");
    }
  }, [state.success, router]);

  const [experience, setExperience] = useState(() =>
    ensureList(defaultValues.experience, newExperience),
  );
  const [education, setEducation] = useState(() =>
    ensureList(defaultValues.education, newEducation),
  );
  const [templateId, setTemplateId] = useState(() =>
    resumeId ? defaultTemplateId || DEFAULT_TEMPLATE_ID : "",
  );
  const [theme, setTheme] = useState<ResumeTheme | null>(() => defaultTheme);
  const [editorReady, setEditorReady] = useState(() => Boolean(resumeId));
  const [previewData, setPreviewData] = useState<ResumeProfileFormData>(() =>
    readFormCareerData(null, defaultValues, experience, education),
  );
  const [expandedSection, setExpandedSection] = useState<SectionId | false>(
    "basics",
  );
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [templateConfirmOpen, setTemplateConfirmOpen] = useState(false);
  const [pendingTemplateId, setPendingTemplateId] = useState<string | null>(
    null,
  );
  const requireTemplateConfirm = Boolean(resumeId || state.success);

  const syncPreview = useCallback(() => {
    const form = formRef.current;
    setPreviewData(
      readFormCareerData(form, defaultValues, experience, education),
    );
  }, [defaultValues, experience, education]);

  useEffect(() => {
    syncPreview();
  }, [syncPreview, experience, education, templateId, theme]);

  function applyTemplateChange(newTemplateId: string) {
    setTemplateId(newTemplateId);
    setTheme((current) => themeForTemplateSwitch(current, newTemplateId));
    setTemplateConfirmOpen(false);
    setPendingTemplateId(null);
    setTemplatePickerOpen(false);
  }

  function requestTemplateChange(newTemplateId: string) {
    if (newTemplateId === templateId) return;
    if (requireTemplateConfirm) {
      setPendingTemplateId(newTemplateId);
      setTemplateConfirmOpen(true);
      return;
    }
    applyTemplateChange(newTemplateId);
  }

  function openTemplatePicker() {
    setTemplatePickerOpen(true);
  }

  function beginFromTemplate(newTemplateId: string) {
    applyTemplateChange(newTemplateId);
    setEditorReady(true);
  }

  const sections: ResumeEditorSection[] = [
    {
      id: "basics",
      label: "Basics",
      content: (
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Label
            </Typography>
            <TextField
              id="label"
              name="label"
              label="Resume name"
              fullWidth
              defaultValue={label}
              placeholder="e.g. Default, Staff engineer"
              helperText="Shown in your resume library"
            />
          </Box>
          <CareerContactFields
            defaultValues={defaultValues}
            emailRequired
            fullNameRequired
          />
        </Stack>
      ),
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
        <CareerExperienceList
          experience={experience}
          onChange={setExperience}
        />
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
      {prefilledFromProfile ? (
        <Alert severity="info" sx={{ mx: 0 }}>
          Prefilled from your profile. Changes here only affect this resume.
        </Alert>
      ) : null}
      {state.error ? <Alert severity="error">{state.error}</Alert> : null}
      {state.success ? (
        <Alert severity="success">Resume saved.</Alert>
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
      <Stack spacing={1.5}>
        <Button type="submit" variant="contained" fullWidth disabled={pending}>
          {pending ? "Saving..." : "Save resume"}
        </Button>
        <NextLinkButton
          href={resumeId ? "/resume" : "#"}
          variant="text"
          color="inherit"
          fullWidth
          disabled={pending}
          onClick={(event) => {
            if (!resumeId) {
              event.preventDefault();
              setEditorReady(false);
            }
          }}
        >
          Cancel
        </NextLinkButton>
      </Stack>
    </Paper>
  );

  if (!editorReady) {
    return (
      <Box sx={{ width: "100%" }}>
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6" component="h2" gutterBottom>
                Choose a template
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pick a starting layout to continue to the resume editor.
              </Typography>
            </Box>
            <ResumeTemplateGallery
              value={templateId}
              onChange={beginFromTemplate}
              disabled={pending}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <NextLinkButton href="/resume" variant="text" color="inherit">
                Cancel
              </NextLinkButton>
            </Box>
          </Stack>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      ref={formRef}
      component="form"
      action={formAction}
      onInput={syncPreview}
      onChange={syncPreview}
      sx={{ width: "100%" }}
    >
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
      {resumeId ? (
        <input type="hidden" name="resumeId" value={resumeId} readOnly />
      ) : null}
      <input type="hidden" name="templateId" value={templateId} readOnly />
      <input
        type="hidden"
        name="themeJson"
        value={theme === null ? "" : JSON.stringify(theme)}
        readOnly
      />

      <ResumeEditorLayout
        nav={
          <ResumeEditorSectionNav
            sections={sections}
            expanded={expandedSection}
            onExpandedChange={(id) => setExpandedSection(id as SectionId | false)}
            disabled={pending}
            alerts={alerts}
            footer={saveFooter}
          />
        }
        preview={
          <ResumeDesignPreview
            data={previewData}
            templateId={templateId}
            theme={theme}
            variant="embedded"
          />
        }
        design={
          <ResumeEditorDesignAside
            templateId={templateId}
            theme={theme}
            onThemeChange={setTheme}
            onChangeTemplate={openTemplatePicker}
            disabled={pending}
          />
        }
      />

      <Dialog
        open={templatePickerOpen}
        onClose={() => setTemplatePickerOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Change template</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Pick a new layout. Your resume content and most design choices are
            kept.
          </Typography>
          <ResumeTemplateGallery
            value={templateId}
            onChange={applyTemplateChange}
            onRequestChange={requestTemplateChange}
            disabled={pending}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplatePickerOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={templateConfirmOpen}
        onClose={() => {
          setTemplateConfirmOpen(false);
          setPendingTemplateId(null);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Change template?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Layout will change; your content is kept. Colors and fonts you set
            stay unless they don&apos;t apply to the new template.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setTemplateConfirmOpen(false);
              setPendingTemplateId(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!pendingTemplateId}
            onClick={() => {
              if (pendingTemplateId) {
                applyTemplateChange(pendingTemplateId);
              }
            }}
          >
            Change template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
