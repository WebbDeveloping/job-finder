import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ResumeKind } from "@/generated/prisma/client";
import { NextMuiLink } from "@/components/NextMuiLink";
import { ResumeDownloadButton } from "@/components/resume/ResumeDownloadButton";
import { resumeKindHint } from "@/lib/resume-types";

type ApplicationResumeSectionProps = {
  resume: {
    id: string;
    label: string;
    kind: ResumeKind;
  } | null;
};

export function ApplicationResumeSection({
  resume,
}: ApplicationResumeSectionProps) {
  if (!resume) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary">
          No resume linked
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Choose a resume in{" "}
          <Typography component="span" variant="body2" color="text.primary">
            Application details
          </Typography>{" "}
          below, or{" "}
          <NextMuiLink href="/resume" underline="hover">
            manage resumes
          </NextMuiLink>
          .
        </Typography>
      </Box>
    );
  }

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{ alignItems: { sm: "center" } }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {resume.label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {resumeKindHint(resume.kind)}
        </Typography>
      </Box>
      <ResumeDownloadButton
        resumeId={resume.id}
        kind={resume.kind}
        resumeLabel={resume.label}
      />
    </Stack>
  );
}
