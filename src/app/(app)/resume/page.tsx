import Box from "@mui/material/Box";
import { NextLinkButton } from "@/components/NextLinkButton";
import { EmptyStatePanel } from "@/components/ui/EmptyStatePanel";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  ResumeLibrary,
} from "@/components/resume/ResumeLibrary";
import { ResumePageActions } from "@/components/resume/ResumePageActions";
import { requireUserId } from "@/lib/auth";
import { getTemplate } from "@/lib/resume-templates/registry";
import { listResumes } from "@/lib/resume";
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
    ...(r.kind === "BUILT"
      ? {
          templateLabel: getTemplate(r.templateId).label,
          templateThumbnailSrc: getTemplate(r.templateId).thumbnailSrc,
        }
      : {}),
  }));

  return (
    <Box>
      <PageHeader
        title="Resume library"
        subtitle="Create built resumes, upload PDFs, and manage a default for downloads."
        actions={<ResumePageActions />}
      />

      {resumes.length === 0 ? (
        <EmptyStatePanel
          illustrationSrc="/illustrations/empty-resume.svg"
          title="No resumes yet"
          description="Create a built resume in the editor or upload a PDF to start your library."
          action={
            <NextLinkButton href="/applications/new" variant="outlined" size="small">
              Or track applications first
            </NextLinkButton>
          }
          marginTop={false}
        />
      ) : (
        <ResumeLibrary resumes={libraryItems} selectedId={null} />
      )}
    </Box>
  );
}
