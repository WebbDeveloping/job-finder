"use client";

import { useRouter } from "next/navigation";
import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
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
import { ResumeDesignPreview } from "@/components/resume/ResumeDesignPreview";
import { ResumeEditorDesignAside } from "@/components/resume/ResumeEditorDesignAside";
import { ResumeEditorLayout } from "@/components/resume/ResumeEditorLayout";
import {
  ResumeEditorSectionNav,
  type ResumeEditorSection,
} from "@/components/resume/ResumeEditorSectionNav";
import { ResumeTemplateGallery } from "@/components/resume/ResumeTemplateGallery";
import type { ResumeTheme } from "@/lib/resume-templates/theme";
import {
  DEFAULT_TEMPLATE_ID,
  getTemplate,
  themeForTemplateSwitch,
} from "@/lib/resume-templates/registry";
import {
  EMPTY_EDUCATION,
  EMPTY_EXPERIENCE,
  type ResumeEducationEntry,
  type ResumeExperienceEntry,
  type ResumeProfileFormData,
} from "@/lib/resume-types";

type ResumeEditorFormProps = {
  defaultValues: ResumeProfileFormData;
  resumeId?: string | null;
  label?: string;
  defaultTemplateId?: string;
  defaultTheme?: ResumeTheme | null;
};

const initialState: ResumeActionState = {};

type SectionId = "basics" | "summary" | "experience" | "education" | "review";

function newExperience(): ResumeExperienceEntry {
  return { ...EMPTY_EXPERIENCE, id: crypto.randomUUID() };
}

function newEducation(): ResumeEducationEntry {
  return { ...EMPTY_EDUCATION, id: crypto.randomUUID() };
}

function ensureList<T>(items: T[], emptyFactory: () => T): T[] {
  return items.length > 0 ? items : [emptyFactory()];
}

function readFormPreviewData(
  form: HTMLFormElement | null,
  fallback: ResumeProfileFormData,
  experience: ResumeExperienceEntry[],
  education: ResumeEducationEntry[],
): ResumeProfileFormData {
  const readField = (name: string, defaultValue: string) => {
    if (!form) return defaultValue;
    const field = form.elements.namedItem(name);
    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement
    ) {
      return field.value;
    }
    return defaultValue;
  };

  return {
    fullName: readField("fullName", fallback.fullName),
    email: readField("email", fallback.email),
    phone: readField("phone", fallback.phone ?? "") || null,
    location: readField("location", fallback.location ?? "") || null,
    website: readField("website", fallback.website ?? "") || null,
    linkedIn: readField("linkedIn", fallback.linkedIn ?? "") || null,
    github: readField("github", fallback.github ?? "") || null,
    summary: readField("summary", fallback.summary),
    skills: readField("skills", fallback.skills),
    experience,
    education,
  };
}

export function ResumeEditorForm({
  defaultValues,
  resumeId = null,
  label = "",
  defaultTemplateId = DEFAULT_TEMPLATE_ID,
  defaultTheme = null,
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
    defaultTemplateId || DEFAULT_TEMPLATE_ID,
  );
  const [theme, setTheme] = useState<ResumeTheme | null>(() => defaultTheme);
  const [previewData, setPreviewData] = useState<ResumeProfileFormData>(() =>
    readFormPreviewData(null, defaultValues, experience, education),
  );
  const [expandedSection, setExpandedSection] = useState<SectionId | false>(
    "basics",
  );
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const [templateConfirmOpen, setTemplateConfirmOpen] = useState(false);
  const [pendingTemplateId, setPendingTemplateId] = useState<string | null>(
    null,
  );
  const [requireTemplateConfirm, setRequireTemplateConfirm] = useState(
    () => Boolean(resumeId),
  );

  useEffect(() => {
    if (state.success) {
      setRequireTemplateConfirm(true);
    }
  }, [state.success]);

  const selectedTemplate = getTemplate(templateId);

  const syncPreview = useCallback(() => {
    const form = formRef.current;
    setPreviewData(
      readFormPreviewData(form, defaultValues, experience, education),
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

  function updateExperience(
    id: string,
    field: keyof ResumeExperienceEntry,
    value: string,
  ) {
    setExperience((items) =>
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  }

  function updateEducation(
    id: string,
    field: keyof ResumeEducationEntry,
    value: string,
  ) {
    setEducation((items) =>
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  }

  function removeExperience(id: string) {
    setExperience((items) => {
      const next = items.filter((item) => item.id !== id);
      return next.length > 0 ? next : [newExperience()];
    });
  }

  function removeEducation(id: string) {
    setEducation((items) => {
      const next = items.filter((item) => item.id !== id);
      return next.length > 0 ? next : [newEducation()];
    });
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
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Contact
            </Typography>
            <Stack spacing={2}>
              <TextField
                id="fullName"
                name="fullName"
                label="Full name"
                required
                fullWidth
                defaultValue={defaultValues.fullName}
              />
              <TextField
                id="email"
                name="email"
                label="Email"
                type="email"
                required
                fullWidth
                defaultValue={defaultValues.email}
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  id="phone"
                  name="phone"
                  label="Phone"
                  fullWidth
                  defaultValue={defaultValues.phone ?? ""}
                />
                <TextField
                  id="location"
                  name="location"
                  label="Location"
                  fullWidth
                  placeholder="City, State"
                  defaultValue={defaultValues.location ?? ""}
                />
              </Stack>
              <TextField
                id="website"
                name="website"
                label="Website"
                fullWidth
                placeholder="https://"
                defaultValue={defaultValues.website ?? ""}
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  id="linkedIn"
                  name="linkedIn"
                  label="LinkedIn"
                  fullWidth
                  placeholder="https://linkedin.com/in/..."
                  defaultValue={defaultValues.linkedIn ?? ""}
                />
                <TextField
                  id="github"
                  name="github"
                  label="GitHub"
                  fullWidth
                  placeholder="https://github.com/..."
                  defaultValue={defaultValues.github ?? ""}
                />
              </Stack>
            </Stack>
          </Box>
        </Stack>
      ),
    },
    {
      id: "summary",
      label: "Summary",
      content: (
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Summary
            </Typography>
            <TextField
              id="summary"
              name="summary"
              label="Professional summary"
              fullWidth
              multiline
              minRows={4}
              defaultValue={defaultValues.summary}
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Skills
            </Typography>
            <TextField
              id="skills"
              name="skills"
              label="Skills"
              fullWidth
              multiline
              minRows={2}
              placeholder="TypeScript, React, Node.js, PostgreSQL"
              helperText="Comma-separated list"
              defaultValue={defaultValues.skills}
            />
          </Box>
        </Stack>
      ),
    },
    {
      id: "experience",
      label: "Experience",
      content: (
        <Box>
          <Stack
            direction="row"
            sx={{
              mb: 2,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="subtitle2">Roles</Typography>
            <Button
              type="button"
              size="small"
              onClick={() =>
                setExperience((items) => [...items, newExperience()])
              }
            >
              Add role
            </Button>
          </Stack>
          <Stack spacing={2}>
            {experience.map((entry, index) => (
              <Paper key={entry.id} variant="outlined" sx={{ p: 2 }}>
                <Stack
                  direction="row"
                  sx={{
                    mb: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="subtitle2">Role {index + 1}</Typography>
                  <Button
                    type="button"
                    size="small"
                    color="inherit"
                    onClick={() => removeExperience(entry.id)}
                  >
                    Remove
                  </Button>
                </Stack>
                <Stack spacing={2}>
                  <TextField
                    label="Company"
                    required
                    fullWidth
                    value={entry.company}
                    onChange={(e) =>
                      updateExperience(entry.id, "company", e.target.value)
                    }
                  />
                  <TextField
                    label="Title"
                    required
                    fullWidth
                    value={entry.title}
                    onChange={(e) =>
                      updateExperience(entry.id, "title", e.target.value)
                    }
                  />
                  <TextField
                    label="Location"
                    fullWidth
                    value={entry.location}
                    onChange={(e) =>
                      updateExperience(entry.id, "location", e.target.value)
                    }
                  />
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      label="Start"
                      fullWidth
                      placeholder="Jan 2022"
                      value={entry.startDate}
                      onChange={(e) =>
                        updateExperience(entry.id, "startDate", e.target.value)
                      }
                    />
                    <TextField
                      label="End"
                      fullWidth
                      placeholder="Present"
                      value={entry.endDate}
                      onChange={(e) =>
                        updateExperience(entry.id, "endDate", e.target.value)
                      }
                    />
                  </Stack>
                  <TextField
                    label="Highlights"
                    fullWidth
                    multiline
                    minRows={3}
                    placeholder="One bullet per line"
                    value={entry.highlights}
                    onChange={(e) =>
                      updateExperience(entry.id, "highlights", e.target.value)
                    }
                  />
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
      ),
    },
    {
      id: "education",
      label: "Education",
      content: (
        <Box>
          <Stack
            direction="row"
            sx={{
              mb: 2,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="subtitle2">Schools</Typography>
            <Button
              type="button"
              size="small"
              onClick={() =>
                setEducation((items) => [...items, newEducation()])
              }
            >
              Add school
            </Button>
          </Stack>
          <Stack spacing={2}>
            {education.map((entry, index) => (
              <Paper key={entry.id} variant="outlined" sx={{ p: 2 }}>
                <Stack
                  direction="row"
                  sx={{
                    mb: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="subtitle2">
                    School {index + 1}
                  </Typography>
                  <Button
                    type="button"
                    size="small"
                    color="inherit"
                    onClick={() => removeEducation(entry.id)}
                  >
                    Remove
                  </Button>
                </Stack>
                <Stack spacing={2}>
                  <TextField
                    label="School"
                    required
                    fullWidth
                    value={entry.school}
                    onChange={(e) =>
                      updateEducation(entry.id, "school", e.target.value)
                    }
                  />
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      label="Degree"
                      required
                      fullWidth
                      value={entry.degree}
                      onChange={(e) =>
                        updateEducation(entry.id, "degree", e.target.value)
                      }
                    />
                    <TextField
                      label="Field of study"
                      fullWidth
                      value={entry.field}
                      onChange={(e) =>
                        updateEducation(entry.id, "field", e.target.value)
                      }
                    />
                  </Stack>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      label="Start"
                      fullWidth
                      placeholder="2016"
                      value={entry.startDate}
                      onChange={(e) =>
                        updateEducation(entry.id, "startDate", e.target.value)
                      }
                    />
                    <TextField
                      label="End"
                      fullWidth
                      placeholder="2020"
                      value={entry.endDate}
                      onChange={(e) =>
                        updateEducation(entry.id, "endDate", e.target.value)
                      }
                    />
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
      ),
    },
    {
      id: "review",
      label: "Review",
      content: (
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Confirm your details, then save your resume to your library.
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
            <Typography variant="body2" color="text.secondary">
              Template:
            </Typography>
            <Chip
              label={selectedTemplate.label}
              size="small"
              variant="outlined"
            />
            <Button
              type="button"
              size="small"
              variant="text"
              onClick={openTemplatePicker}
              disabled={pending}
            >
              Change template
            </Button>
          </Stack>
        </Stack>
      ),
    },
  ];

  const alerts = (
    <Stack spacing={2} sx={{ mt: 2, px: 2 }}>
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
      <Button type="submit" variant="contained" fullWidth disabled={pending}>
        {pending ? "Saving..." : "Save resume"}
      </Button>
    </Paper>
  );

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
