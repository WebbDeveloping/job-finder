import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { ApplicationForm } from "@/components/pipeline/ApplicationForm";
import { ApplicationCoverLetterSection } from "@/components/pipeline/ApplicationCoverLetterSection";
import { ApplicationResumeSection } from "@/components/pipeline/ApplicationResumeSection";
import { DeleteApplicationButton } from "@/components/pipeline/DeleteApplicationButton";
import { StageChangeForm } from "@/components/pipeline/StageChangeForm";
import { StageHistory } from "@/components/pipeline/StageHistory";
import { DangerZone } from "@/components/ui/DangerZone";
import { FormColumn } from "@/components/ui/FormColumn";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageSection } from "@/components/ui/PageSection";
import { getApplication, getCurrentStage } from "@/lib/application";
import { requireUserId } from "@/lib/auth";
import { listCoverLetters } from "@/lib/cover-letter";
import { listResumes } from "@/lib/resume";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export default async function ApplicationDetailPage({ params }: PageProps) {
  const userId = await requireUserId();
  const { id } = await params;
  const [application, resumes, coverLetters] = await Promise.all([
    getApplication(id, userId),
    listResumes(userId),
    listCoverLetters(userId),
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

  const coverLetterOptions = coverLetters.map((letter) => ({
    id: letter.id,
    label: letter.label,
  }));

  const metaLines = [
    application.companyWebsite
      ? `Website: ${application.companyWebsite}`
      : null,
    application.salaryRange ? `Salary: ${application.salaryRange}` : null,
  ].filter(Boolean);

  return (
    <Box>
      <PageHeader
        title={application.company}
        subtitle={application.role}
        backHref="/applications"
        backLabel="Back to applications"
      />

      {metaLines.length > 0 ? (
        <Box sx={{ mt: -2, mb: 2 }}>
          {metaLines.map((line) => (
            <Typography key={line} variant="body2" color="text.secondary">
              {line}
            </Typography>
          ))}
        </Box>
      ) : null}

      <PageSection title="Resume used">
        <FormColumn>
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
        </FormColumn>
      </PageSection>

      <PageSection title="Cover letter">
        <FormColumn>
          <ApplicationCoverLetterSection
            applicationId={application.id}
            coverLetter={
              application.coverLetter
                ? {
                    id: application.coverLetter.id,
                    label: application.coverLetter.label,
                  }
                : null
            }
          />
        </FormColumn>
      </PageSection>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <PageSection title="Application details">
            <FormColumn>
              <ApplicationForm
                mode="edit"
                applicationId={application.id}
                resumes={resumeOptions}
                coverLetters={coverLetterOptions}
                defaultValues={{
                  company: application.company,
                  role: application.role,
                  source: application.source ?? "",
                  companyWebsite: application.companyWebsite ?? "",
                  salaryRange: application.salaryRange ?? "",
                  notes: application.notes ?? "",
                  resumeId: application.resumeId,
                  coverLetterId: application.coverLetterId,
                }}
              />
            </FormColumn>
          </PageSection>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <PageSection title="Log stage change">
            <FormColumn>
              <StageChangeForm
                applicationId={application.id}
                currentStage={currentStage}
              />
            </FormColumn>
          </PageSection>
        </Grid>
      </Grid>

      <PageSection title="Stage history" gap="large">
        <StageHistory events={application.stageEvents} />
      </PageSection>

      <DangerZone
        description="Permanently remove this application and its stage history."
        action={
          <DeleteApplicationButton
            applicationId={application.id}
            company={application.company}
            role={application.role}
          />
        }
      />
    </Box>
  );
}
