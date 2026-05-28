import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { NextMuiLink } from "@/components/NextMuiLink";
import { ApplicationForm } from "@/components/pipeline/ApplicationForm";
import { ApplicationResumeSection } from "@/components/pipeline/ApplicationResumeSection";
import { DeleteApplicationButton } from "@/components/pipeline/DeleteApplicationButton";
import { StageChangeForm } from "@/components/pipeline/StageChangeForm";
import { StageHistory } from "@/components/pipeline/StageHistory";
import { getApplication, getCurrentStage } from "@/lib/application";
import { requireUserId } from "@/lib/auth";
import { listResumes } from "@/lib/resume";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function ApplicationDetailPage({ params }: PageProps) {
  const userId = await requireUserId();
  const { id } = await params;
  const [application, resumes] = await Promise.all([
    getApplication(id, userId),
    listResumes(userId),
  ]);

  if (!application) {
    notFound();
  }

  const currentStage = getCurrentStage(application.stageEvents);
  const resumeOptions = resumes.map((resume) => ({
    id: resume.id,
    label: resume.label,
    kind: resume.kind,
  }));

  return (
    <Box>
      <NextMuiLink
        href="/applications"
        underline="hover"
        variant="body2"
        color="text.secondary"
      >
        ← Back to applications
      </NextMuiLink>
      <Typography variant="h4" component="h1" sx={{ mt: 2 }}>
        {application.company}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {application.role}
      </Typography>

      {application.companyWebsite && (
        <Typography variant="body2" color="text.secondary">
          Website: {application.companyWebsite}
        </Typography>
      )}

      {application.salaryRange && (
        <Typography variant="body2" color="text.secondary">
          Salary: {application.salaryRange}
        </Typography>
      )}

      <Box sx={{ mt: 4, maxWidth: 480 }}>
        <Typography variant="h6" gutterBottom>
          Resume used
        </Typography>
        <ApplicationResumeSection
          resume={
            application.resume
              ? {
                  id: application.resume.id,
                  label: application.resume.label,
                  kind: application.resume.kind,
                }
              : null
          }
        />
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Typography variant="h6" gutterBottom>
            Application details
          </Typography>
          <Box sx={{ maxWidth: 480 }}>
            <ApplicationForm
              mode="edit"
              applicationId={application.id}
              resumes={resumeOptions}
              defaultValues={{
                company: application.company,
                role: application.role,
                source: application.source ?? "",
                companyWebsite: application.companyWebsite ?? "",
                salaryRange: application.salaryRange ?? "",
                notes: application.notes ?? "",
                resumeId: application.resumeId,
              }}
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Typography variant="h6" gutterBottom>
            Log stage change
          </Typography>
          <Box sx={{ maxWidth: 480 }}>
            <StageChangeForm
              applicationId={application.id}
              currentStage={currentStage}
            />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h6" gutterBottom>
          Stage history
        </Typography>
        <StageHistory events={application.stageEvents} />
      </Box>

      <Paper variant="outlined" sx={{ mt: 6, p: 3, maxWidth: 480 }}>
        <Typography variant="h6" component="h2" gutterBottom color="error">
          Danger zone
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Permanently remove this application and its stage history.
        </Typography>
        <DeleteApplicationButton
          applicationId={application.id}
          company={application.company}
          role={application.role}
        />
      </Paper>
    </Box>
  );
}
