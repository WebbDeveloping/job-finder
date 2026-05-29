import Box from "@mui/material/Box";
import { CoverLetterEditorForm } from "@/components/cover-letter/CoverLetterEditorForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { getApplication } from "@/lib/application";
import { requireUser } from "@/lib/auth";
import {
  getCoverLetter,
  toCoverLetterFormData,
  toCoverLetterThemeFromRow,
} from "@/lib/cover-letter";
import { EMPTY_COVER_LETTER } from "@/lib/cover-letter-types";
import {
  getOrSeedUserProfile,
  mergeProfileIntoResumeDefaults,
} from "@/lib/user-profile";
import type { CoverLetterFormData } from "@/lib/cover-letter-types";
import type { ResumeProfileFormData } from "@/lib/resume-types";

type CoverLetterCreatePageProps = {
  searchParams: Promise<{ id?: string; applicationId?: string }>;
};

const emptyResumeDefaults: ResumeProfileFormData = {
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

export default async function CoverLetterCreatePage({
  searchParams,
}: CoverLetterCreatePageProps) {
  const session = await requireUser();
  const userId = session.user.id!;
  const params = await searchParams;
  const editingId = params.id?.trim() ?? null;
  const applicationId = params.applicationId?.trim() ?? null;

  let defaultValues: CoverLetterFormData = { ...EMPTY_COVER_LETTER };
  let coverLetterId: string | null = null;
  let defaultTheme = null;

  if (editingId) {
    const existing = await getCoverLetter(userId, editingId);
    if (existing) {
      defaultValues = toCoverLetterFormData(existing);
      coverLetterId = existing.id;
      defaultTheme = toCoverLetterThemeFromRow(existing);
    }
  } else {
    const profile = await getOrSeedUserProfile(userId);
    const merged = mergeProfileIntoResumeDefaults(
      profile,
      session.user.email ?? "",
      emptyResumeDefaults,
    );
    defaultValues = {
      ...EMPTY_COVER_LETTER,
      fullName: merged.fullName,
      email: merged.email,
      phone: merged.phone,
      location: merged.location,
    };

    if (applicationId) {
      const application = await getApplication(applicationId, userId);
      if (application) {
        defaultValues = {
          ...defaultValues,
          label:
            defaultValues.label ||
            `${application.company} — ${application.role}`,
          company: application.company,
        };
      }
    }
  }

  const isEdit = coverLetterId !== null;

  return (
    <Box>
      <PageHeader
        title={isEdit ? "Edit cover letter" : "Create cover letter"}
        subtitle="Fill in each section and see your cover letter update live as you type."
        backHref="/cover-letters"
        backLabel="Back to cover letters"
      />
      <CoverLetterEditorForm
        defaultValues={defaultValues}
        coverLetterId={coverLetterId}
        applicationId={applicationId}
        defaultTheme={defaultTheme}
      />
    </Box>
  );
}
