"use client";

import { useActionState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { ResumeKind } from "@/generated/prisma/client";
import type { ActionState } from "@/app/(app)/pipeline/actions";
import {
  createApplication,
  updateApplication,
} from "@/app/(app)/pipeline/actions";
import { NextMuiLink } from "@/components/NextMuiLink";
import { resumeKindHint } from "@/lib/resume-types";

export type ApplicationFormResumeOption = {
  id: string;
  label: string;
  kind: ResumeKind;
};

type ApplicationFormProps = {
  mode: "create" | "edit";
  applicationId?: string;
  resumes: ApplicationFormResumeOption[];
  defaultResumeId?: string | null;
  defaultValues?: {
    company: string;
    role: string;
    source: string;
    companyWebsite?: string;
    salaryRange?: string;
    notes: string;
    resumeId?: string | null;
  };
};

const initialState: ActionState = {};

export function ApplicationForm({
  mode,
  applicationId,
  resumes,
  defaultResumeId,
  defaultValues,
}: ApplicationFormProps) {
  const action =
    mode === "create"
      ? createApplication
      : updateApplication.bind(null, applicationId!);

  const [state, formAction, pending] = useActionState(action, initialState);

  const selectedResumeId =
    mode === "edit"
      ? (defaultValues?.resumeId ?? "")
      : (defaultResumeId ?? "");

  return (
    <Stack component="form" action={formAction} spacing={2.5}>
      <TextField
        id="company"
        name="company"
        label="Company"
        required
        fullWidth
        defaultValue={defaultValues?.company ?? ""}
      />

      <TextField
        id="role"
        name="role"
        label="Role"
        required
        fullWidth
        defaultValue={defaultValues?.role ?? ""}
      />

      <TextField
        id="source"
        name="source"
        label="Source"
        fullWidth
        placeholder="LinkedIn, referral, etc."
        defaultValue={defaultValues?.source ?? ""}
      />

      <TextField
        id="companyWebsite"
        name="companyWebsite"
        label="Company website (optional)"
        fullWidth
        placeholder="https://company.com"
        defaultValue={defaultValues?.companyWebsite ?? ""}
      />

      <TextField
        id="salaryRange"
        name="salaryRange"
        label="Salary / salary range (optional)"
        fullWidth
        placeholder="$120k-$150k"
        defaultValue={defaultValues?.salaryRange ?? ""}
      />

      <FormControl fullWidth>
        <InputLabel id="resume-used-label">Resume used (optional)</InputLabel>
        <Select
          labelId="resume-used-label"
          id="resumeId"
          name="resumeId"
          label="Resume used (optional)"
          defaultValue={selectedResumeId}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {resumes.map((resume) => (
            <MenuItem key={resume.id} value={resume.id}>
              {resume.label} ({resumeKindHint(resume.kind)})
            </MenuItem>
          ))}
        </Select>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
          <NextMuiLink href="/resume" underline="hover">
            Manage resumes
          </NextMuiLink>
        </Typography>
      </FormControl>

      <TextField
        id="notes"
        name="notes"
        label="Notes"
        fullWidth
        multiline
        minRows={4}
        defaultValue={defaultValues?.notes ?? ""}
      />

      {state.error && <Alert severity="error">{state.error}</Alert>}

      <Button type="submit" variant="contained" disabled={pending}>
        {pending
          ? "Saving…"
          : mode === "create"
            ? "Create application"
            : "Save changes"}
      </Button>
    </Stack>
  );
}
