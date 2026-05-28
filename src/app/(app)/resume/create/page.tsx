import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { NextLinkButton } from "@/components/NextLinkButton";
import { ResumeEditorForm } from "@/components/resume/ResumeEditorForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireUser } from "@/lib/auth";
import {
  getOrSeedUserProfile,
  mergeProfileIntoResumeDefaults,
} from "@/lib/user-profile";
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
  const session = await requireUser();
  const userId = session.user.id;
  const params = await searchParams;
  const editingId = params.id ?? null;

  let editorResume = null;
  if (editingId) {
    const found = await getResume(userId, editingId);
    if (found && isBuiltResume(found)) {
      editorResume = found;
    }
  }

  const isNewResume = !editorResume;
  let defaultValues = editorResume
    ? toResumeFormData(editorResume)
    : emptyDefaults;

  let prefilledFromProfile = false;
  if (isNewResume) {
    const profile = await getOrSeedUserProfile(userId);
    defaultValues = mergeProfileIntoResumeDefaults(
      profile,
      session.user.email ?? "",
      emptyDefaults,
    );
    prefilledFromProfile =
      profile.fullName.trim() !== "" ||
      profile.email.trim() !== "" ||
      profile.summary.trim() !== "" ||
      profile.skills.trim() !== "" ||
      profile.experience.length > 0 ||
      profile.education.length > 0 ||
      Boolean(profile.phone) ||
      Boolean(profile.location);
  }

  return (
    <Box>
      <PageHeader
        title={editingId ? "Edit resume" : "Create resume"}
        subtitle="Fill in each section and see your resume update live as you type."
      />

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
          prefilledFromProfile={prefilledFromProfile}
        />
      )}
    </Box>
  );
}
