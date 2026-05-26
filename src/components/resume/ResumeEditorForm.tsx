"use client";

import { useActionState, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { ResumeActionState } from "@/app/(app)/resume/actions";
import { saveResumeProfile } from "@/app/(app)/resume/actions";
import {
  EMPTY_EDUCATION,
  EMPTY_EXPERIENCE,
  type ResumeEducationEntry,
  type ResumeExperienceEntry,
  type ResumeProfileFormData,
} from "@/lib/resume-types";

type ResumeEditorFormProps = {
  defaultValues: ResumeProfileFormData;
};

const initialState: ResumeActionState = {};

function newExperience(): ResumeExperienceEntry {
  return { ...EMPTY_EXPERIENCE, id: crypto.randomUUID() };
}

function newEducation(): ResumeEducationEntry {
  return { ...EMPTY_EDUCATION, id: crypto.randomUUID() };
}

function ensureList<T>(items: T[], emptyFactory: () => T): T[] {
  return items.length > 0 ? items : [emptyFactory()];
}

export function ResumeEditorForm({ defaultValues }: ResumeEditorFormProps) {
  const [state, formAction, pending] = useActionState(
    saveResumeProfile,
    initialState,
  );

  const [experience, setExperience] = useState(() =>
    ensureList(defaultValues.experience, newExperience),
  );
  const [education, setEducation] = useState(() =>
    ensureList(defaultValues.education, newEducation),
  );

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

  return (
    <Stack
      component="form"
      action={formAction}
      spacing={4}
      sx={{ maxWidth: 720 }}
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

      <Box>
        <Typography variant="h6" gutterBottom>
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

      <Divider />

      <Box>
        <Typography variant="h6" gutterBottom>
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

      <Divider />

      <Box>
        <Typography variant="h6" gutterBottom>
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

      <Divider />

      <Box>
        <Stack
          direction="row"
          sx={{
            mb: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Experience</Typography>
          <Button
            type="button"
            size="small"
            onClick={() => setExperience((items) => [...items, newExperience()])}
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
                <Typography variant="subtitle2">
                  Role {index + 1}
                </Typography>
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

      <Divider />

      <Box>
        <Stack
          direction="row"
          sx={{
            mb: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Education</Typography>
          <Button
            type="button"
            size="small"
            onClick={() => setEducation((items) => [...items, newEducation()])}
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

      {state.error && <Alert severity="error">{state.error}</Alert>}
      {state.success && (
        <Alert severity="success">Resume saved.</Alert>
      )}

      <Button type="submit" variant="contained" disabled={pending}>
        {pending ? "Saving…" : "Save resume"}
      </Button>
    </Stack>
  );
}
