import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { NextLinkButton } from "@/components/NextLinkButton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ResumeEditorForm } from "@/components/resume/ResumeEditorForm";
import {
  ResumeLibrary,
} from "@/components/resume/ResumeLibrary";
import { ResumePageActions } from "@/components/resume/ResumePageActions";
import { requireUserId } from "@/lib/auth";
import {
  getResume,
  isBuiltResume,
  listResumes,
  toResumeFormData,
} from "@/lib/resume";
import type { ResumeLibraryItem, ResumeProfileFormData } from "@/lib/resume-types";

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

type ResumePageProps = {
  searchParams: Promise<{ id?: string; new?: string }>;
};

export default async function ResumePage({ searchParams }: ResumePageProps) {
  const userId = await requireUserId();
  const params = await searchParams;
  const resumes = await listResumes(userId);

  const libraryItems: ResumeLibraryItem[] = resumes.map((r) => ({
    id: r.id,
    kind: r.kind,
    label: r.label,
    isDefault: r.isDefault,
    updatedAt: r.updatedAt.toISOString(),
  }));

  const editingNew = params.new === "built";
  const editingId = params.id ?? null;
  const showEditor = editingNew || editingId !== null;

  let editorResume = null;
  if (editingId) {
    const found = await getResume(userId, editingId);
    if (found && isBuiltResume(found)) {
      editorResume = found;
    }
  }

  const defaultValues = editorResume
    ? toResumeFormData(editorResume)
    : emptyDefaults;

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
        <ResumePageActions />
      </Stack>

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
              <NextLinkButton href="/pipeline/new" variant="outlined" size="small">
                Or track applications first
              </NextLinkButton>
            }
          />
        </Paper>
      ) : (
        <ResumeLibrary resumes={libraryItems} selectedId={editingId} />
      )}

      {showEditor ? (
        <>
          <Divider sx={{ my: 4 }} />
          <Stack
            direction="row"
            spacing={2}
            sx={{ mb: 3, alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography variant="h6" component="h2">
              {editingNew ? "New built resume" : `Edit: ${editorResume?.label ?? "Resume"}`}
            </Typography>
            <NextLinkButton href="/resume" variant="text" size="small">
              Back to library
            </NextLinkButton>
          </Stack>
          {editingId && !editorResume ? (
            <Typography color="error">
              Built resume not found.{" "}
              <NextLinkButton href="/resume" size="small">
                Return to library
              </NextLinkButton>
            </Typography>
          ) : (
            <ResumeEditorForm
              key={editorResume?.updatedAt.toISOString() ?? "new"}
              defaultValues={defaultValues}
              resumeId={editorResume?.id ?? null}
              label={editorResume?.label ?? ""}
            />
          )}
        </>
      ) : null}
    </Box>
  );
}
