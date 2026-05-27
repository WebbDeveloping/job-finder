import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { NextLinkButton } from "@/components/NextLinkButton";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  ResumeLibrary,
} from "@/components/resume/ResumeLibrary";
import { ResumePageActions } from "@/components/resume/ResumePageActions";
import { requireUserId } from "@/lib/auth";
import {
  listResumes,
} from "@/lib/resume";
import type { ResumeLibraryItem } from "@/lib/resume-types";

export const dynamic = "force-dynamic";

export default async function ResumePage() {
  const userId = await requireUserId();
  const resumes = await listResumes(userId);

  const libraryItems: ResumeLibraryItem[] = resumes.map((r) => ({
    id: r.id,
    kind: r.kind,
    label: r.label,
    isDefault: r.isDefault,
    updatedAt: r.updatedAt.toISOString(),
  }));

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
            Resume library
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create built resumes, upload PDFs, and manage a default for downloads.
          </Typography>
        </Box>
      </Stack>
      <ResumePageActions />

      {resumes.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{ mb: 3, py: 4, px: 3, borderStyle: "dashed" }}
        >
          <EmptyState
            illustrationSrc="/illustrations/empty-resume.svg"
            title="No resumes yet"
            description="Create a built resume in the editor or upload a PDF to start your library."
            action={
              <NextLinkButton href="/applications/new" variant="outlined" size="small">
                Or track applications first
              </NextLinkButton>
            }
          />
        </Paper>
      ) : (
        <ResumeLibrary resumes={libraryItems} selectedId={null} />
      )}
    </Box>
  );
}
