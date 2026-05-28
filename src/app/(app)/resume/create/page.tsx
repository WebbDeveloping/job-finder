import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { NextLinkButton } from "@/components/NextLinkButton";
import { ResumeEditorForm } from "@/components/resume/ResumeEditorForm";
import { ResumePageActions } from "@/components/resume/ResumePageActions";
import { requireUserId } from "@/lib/auth";
import { assertTemplateId } from "@/lib/resume-templates/registry";
import { getResume, isBuiltResume, toResumeDesign, toResumeFormData } from "@/lib/resume";
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

type ResumeCreatePageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function ResumeCreatePage({
  searchParams,
}: ResumeCreatePageProps) {
  const userId = await requireUserId();
  const params = await searchParams;
  const editingId = params.id ?? null;

  let editorResume = null;
  if (editingId) {
    const found = await getResume(userId, editingId);
    if (found && isBuiltResume(found)) {
      editorResume = found;
    }
  }

  const defaultValues = editorResume ? toResumeFormData(editorResume) : emptyDefaults;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 1,
          }}
        >
          <Typography variant="h4" component="h1" sx={{ mb: 0 }}>
            {editingId ? "Edit resume" : "Create resume"}
          </Typography>
          <Box sx={{ alignSelf: { xs: "flex-end", sm: "auto" }, flexShrink: 0 }}>
            <ResumePageActions />
          </Box>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Fill in each section and see your resume update live as you type.
        </Typography>
      </Box>

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
          defaultTemplateId={
            editorResume
              ? assertTemplateId(editorResume.templateId)
              : undefined
          }
          defaultTheme={
            editorResume ? toResumeDesign(editorResume).theme : null
          }
        />
      )}
    </Box>
  );
}
