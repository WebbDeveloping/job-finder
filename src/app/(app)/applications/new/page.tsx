import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ApplicationForm } from "@/components/pipeline/ApplicationForm";
import { FormColumn } from "@/components/ui/FormColumn";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireUserId } from "@/lib/auth";
import { listCoverLetters } from "@/lib/cover-letter";
import { getDefaultResume, listResumes } from "@/lib/resume";

export const dynamic = "force-dynamic";

export default async function NewApplicationPage() {
  const userId = await requireUserId();
  const [resumes, coverLetters, defaultResume] = await Promise.all([
    listResumes(userId),
    listCoverLetters(userId),
    getDefaultResume(userId),
  ]);

  const resumeOptions = resumes.map((resume) => ({
    id: resume.id,
    label: resume.label,
    kind: resume.kind,
  }));

  const coverLetterOptions = coverLetters.map((letter) => ({
    id: letter.id,
    label: letter.label,
  }));

  return (
    <Box>
      <PageHeader
        title="Add application"
        subtitle="New applications start on your wishlist until you submit."
        backHref="/applications"
        backLabel="Back to applications"
      />
      <FormColumn>
        <ApplicationForm
          mode="create"
          resumes={resumeOptions}
          coverLetters={coverLetterOptions}
          defaultResumeId={defaultResume?.id ?? null}
        />
      </FormColumn>
    </Box>
  );
}
