import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { NextMuiLink } from "@/components/NextMuiLink";
import Typography from "@mui/material/Typography";
import { ApplicationForm } from "@/components/pipeline/ApplicationForm";
import { StageChangeForm } from "@/components/pipeline/StageChangeForm";
import { StageHistory } from "@/components/pipeline/StageHistory";
import { getApplication, getCurrentStage } from "@/lib/application";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const application = await getApplication(id);

  if (!application) {
    notFound();
  }

  const currentStage = getCurrentStage(application.stageEvents);

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
        {application.company}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {application.role}
      </Typography>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Typography variant="h6" gutterBottom>
            Application details
          </Typography>
          <Box sx={{ maxWidth: 480 }}>
            <ApplicationForm
              mode="edit"
              applicationId={application.id}
              defaultValues={{
                company: application.company,
                role: application.role,
                source: application.source ?? "",
                notes: application.notes ?? "",
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
    </Box>
  );
}
