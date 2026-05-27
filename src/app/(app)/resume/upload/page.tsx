import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ResumePageActions } from "@/components/resume/ResumePageActions";
import { ResumeUploadForm } from "@/components/resume/ResumeUploadForm";
import { requireUserId } from "@/lib/auth";

export default async function ResumeUploadPage() {
  await requireUserId();

  return (
    <Box>
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Upload resume
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload a PDF resume to keep it in your private library.
          </Typography>
        </Box>
        <ResumePageActions />
      </Stack>

      <ResumeUploadForm />
    </Box>
  );
}
