"use client";

import { useRouter } from "next/navigation";
import { useActionState, useCallback, useEffect, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import type { CoverLetterActionState } from "@/app/(app)/cover-letters/actions";
import { saveCoverLetter } from "@/app/(app)/cover-letters/actions";
import { CoverLetterEditorDesignAside } from "@/components/cover-letter/CoverLetterEditorDesignAside";
import { CoverLetterEditorLayout } from "@/components/cover-letter/CoverLetterEditorLayout";
import {
  CoverLetterEditorSectionNav,
  type CoverLetterEditorSection,
} from "@/components/cover-letter/CoverLetterEditorSectionNav";
import { CoverLetterPreview } from "@/components/cover-letter/CoverLetterPreview";
import { NextLinkButton } from "@/components/NextLinkButton";
import { readFormCoverLetterData } from "@/lib/cover-letter-form";
import type { CoverLetterTheme } from "@/lib/cover-letter-theme";
import type { CoverLetterFormData } from "@/lib/cover-letter-types";

type CoverLetterEditorFormProps = {
  defaultValues: CoverLetterFormData;
  coverLetterId?: string | null;
  applicationId?: string | null;
  defaultTheme?: CoverLetterTheme | null;
};

const initialState: CoverLetterActionState = {};

type SectionId = "label" | "contact" | "recipient" | "letter";

export function CoverLetterEditorForm({
  defaultValues,
  coverLetterId = null,
  applicationId = null,
  defaultTheme = null,
}: CoverLetterEditorFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    saveCoverLetter,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      router.replace("/cover-letters");
    }
  }, [state.success, router]);

  const [previewData, setPreviewData] = useState<CoverLetterFormData>(
    () => defaultValues,
  );
  const [expandedSection, setExpandedSection] = useState<SectionId | false>(
    "label",
  );
  const [theme, setTheme] = useState<CoverLetterTheme | null>(
    () => defaultTheme,
  );

  const syncPreview = useCallback(() => {
    const form = formRef.current;
    setPreviewData(readFormCoverLetterData(form, defaultValues));
  }, [defaultValues]);

  useEffect(() => {
    syncPreview();
  }, [syncPreview]);

  const sections: CoverLetterEditorSection[] = [
    {
      id: "label",
      label: "Library name",
      content: (
        <TextField
          id="label"
          name="label"
          label="Label"
          required
          fullWidth
          defaultValue={defaultValues.label}
          helperText="Shown in your cover letter library, e.g. “Acme — Product Manager”."
        />
      ),
    },
    {
      id: "contact",
      label: "Your contact",
      content: (
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
          <TextField
            id="phone"
            name="phone"
            label="Phone (optional)"
            fullWidth
            defaultValue={defaultValues.phone ?? ""}
          />
          <TextField
            id="location"
            name="location"
            label="Location (optional)"
            fullWidth
            defaultValue={defaultValues.location ?? ""}
          />
        </Stack>
      ),
    },
    {
      id: "recipient",
      label: "Recipient",
      content: (
        <Stack spacing={2}>
          <TextField
            id="letterDate"
            name="letterDate"
            label="Date (optional)"
            fullWidth
            placeholder="May 28, 2026"
            defaultValue={defaultValues.letterDate ?? ""}
          />
          <TextField
            id="recipientName"
            name="recipientName"
            label="Hiring manager name (optional)"
            fullWidth
            defaultValue={defaultValues.recipientName ?? ""}
          />
          <TextField
            id="recipientTitle"
            name="recipientTitle"
            label="Title (optional)"
            fullWidth
            defaultValue={defaultValues.recipientTitle ?? ""}
          />
          <TextField
            id="company"
            name="company"
            label="Company (optional)"
            fullWidth
            defaultValue={defaultValues.company ?? ""}
          />
          <TextField
            id="companyAddress"
            name="companyAddress"
            label="Company address (optional)"
            fullWidth
            multiline
            minRows={2}
            defaultValue={defaultValues.companyAddress ?? ""}
          />
        </Stack>
      ),
    },
    {
      id: "letter",
      label: "Letter",
      content: (
        <Stack spacing={2}>
          <TextField
            id="salutation"
            name="salutation"
            label="Salutation"
            fullWidth
            defaultValue={defaultValues.salutation}
          />
          <TextField
            id="body"
            name="body"
            label="Body"
            required
            fullWidth
            multiline
            minRows={12}
            defaultValue={defaultValues.body}
            helperText="Separate paragraphs with a blank line."
          />
          <TextField
            id="closing"
            name="closing"
            label="Closing"
            fullWidth
            defaultValue={defaultValues.closing}
          />
        </Stack>
      ),
    },
  ];

  const alerts = state.error ? (
    <Stack spacing={2} sx={{ mt: 2, px: 2 }}>
      <Alert severity="error">{state.error}</Alert>
    </Stack>
  ) : null;

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
          {pending
            ? "Saving…"
            : coverLetterId
              ? "Save cover letter"
              : "Create cover letter"}
        </Button>
        <NextLinkButton
          href="/cover-letters"
          variant="text"
          color="inherit"
          fullWidth
          disabled={pending}
        >
          Cancel
        </NextLinkButton>
      </Stack>
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
      {coverLetterId ? (
        <input type="hidden" name="coverLetterId" value={coverLetterId} />
      ) : null}
      {applicationId ? (
        <input type="hidden" name="applicationId" value={applicationId} />
      ) : null}
      <input
        type="hidden"
        name="themeJson"
        value={theme === null ? "" : JSON.stringify(theme)}
        readOnly
      />

      <CoverLetterEditorLayout
        nav={
          <CoverLetterEditorSectionNav
            sections={sections}
            expanded={expandedSection}
            onExpandedChange={(id) => setExpandedSection(id as SectionId | false)}
            disabled={pending}
            alerts={alerts}
            footer={saveFooter}
          />
        }
        preview={<CoverLetterPreview data={previewData} theme={theme} />}
        design={
          <CoverLetterEditorDesignAside
            theme={theme}
            onThemeChange={setTheme}
            disabled={pending}
          />
        }
      />
    </Box>
  );
}
