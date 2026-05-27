import Box from "@mui/material/Box";
import { NextMuiLink } from "@/components/NextMuiLink";
import Typography from "@mui/material/Typography";
import { ApplicationForm } from "@/components/pipeline/ApplicationForm";
import { requireUserId } from "@/lib/auth";
import { getDefaultResume, listResumes } from "@/lib/resume";

export const dynamic = "force-dynamic";

export default async function NewApplicationPage() {
  const userId = await requireUserId();
  const [resumes, defaultResume] = await Promise.all([
    listResumes(userId),
    getDefaultResume(userId),
  ]);

  const resumeOptions = resumes.map((resume) => ({
    id: resume.id,
    label: resume.label,
    kind: resume.kind,
  }));

  return (
    <Box>
      <NextMuiLink
        href="/pipeline"
        underline="hover"
        variant="body2"
        color="text.secondary"
      >
        ← Back to pipeline
      </NextMuiLink>
      <Typography variant="h4" component="h1" sx={{ mt: 2 }}>
        Add application
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        New applications start on your wishlist until you submit.
      </Typography>
      <Box sx={{ mt: 4, maxWidth: 480 }}>
        <ApplicationForm
          mode="create"
          resumes={resumeOptions}
          defaultResumeId={defaultResume?.id ?? null}
        />
      </Box>
    </Box>
  );
}
