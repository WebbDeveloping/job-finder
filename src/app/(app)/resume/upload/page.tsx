import Box from "@mui/material/Box";
import { ResumePageActions } from "@/components/resume/ResumePageActions";
import { ResumeUploadForm } from "@/components/resume/ResumeUploadForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireUserId } from "@/lib/auth";

export default async function ResumeUploadPage() {
  await requireUserId();

  return (
    <Box>
      <PageHeader
        title="Upload resume"
        subtitle="Upload a PDF resume to keep it in your private library."
        actions={<ResumePageActions />}
      />

      <ResumeUploadForm />
    </Box>
  );
}
