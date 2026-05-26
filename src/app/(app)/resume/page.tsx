import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { NextLinkButton } from "@/components/NextLinkButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ResumeDownloadButton } from "@/components/resume/ResumeDownloadButton";
import { ResumeEditorForm } from "@/components/resume/ResumeEditorForm";
import { requireUserId } from "@/lib/auth";
import { getResumeProfile, toResumeFormData } from "@/lib/resume";
import type { ResumeProfileFormData } from "@/lib/resume-types";

const emptyDefaults: ResumeProfileFormData = {
  fullName: "",
  email: "",
  phone: null,
  location: null,
  website: null,
  linkedIn: null,
  github: null,
  summary: "",
  skills: "",
  experience: [],
  education: [],
};

export const dynamic = "force-dynamic";

export default async function ResumePage() {
  const userId = await requireUserId();
  const profile = await getResumeProfile(userId);
  const defaultValues = profile ? toResumeFormData(profile) : emptyDefaults;

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          mb: 4,
          justifyContent: "space-between",
          alignItems: { sm: "flex-start" },
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Resume
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Build your resume profile and download a PDF when you are ready.
          </Typography>
        </Box>
        <ResumeDownloadButton hasSavedProfile={profile !== null} />
      </Stack>
      {profile === null ? (
        <Paper
          variant="outlined"
          sx={{ mb: 3, py: 4, px: 3, borderStyle: "dashed" }}
        >
          <EmptyState
            illustrationSrc="/illustrations/empty-resume.svg"
            title="No resume saved yet"
            description="Fill in the form below and save to enable PDF download."
            action={
              <NextLinkButton href="/pipeline/new" variant="outlined" size="small">
                Or track applications first
              </NextLinkButton>
            }
          />
        </Paper>
      ) : null}
      <ResumeEditorForm
        key={profile?.updatedAt.toISOString() ?? "new"}
        defaultValues={defaultValues}
      />
    </Box>
  );
}
