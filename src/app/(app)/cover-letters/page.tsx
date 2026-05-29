import Box from "@mui/material/Box";
import { CoverLetterLibrary } from "@/components/cover-letter/CoverLetterLibrary";
import { CoverLetterPageActions } from "@/components/cover-letter/CoverLetterPageActions";
import { NextLinkButton } from "@/components/NextLinkButton";
import { EmptyStatePanel } from "@/components/ui/EmptyStatePanel";
import { PageHeader } from "@/components/ui/PageHeader";
import { requireUserId } from "@/lib/auth";
import { listCoverLetters } from "@/lib/cover-letter";
import type { CoverLetterLibraryItem } from "@/lib/cover-letter-types";

export const dynamic = "force-dynamic";

export default async function CoverLettersPage() {
  const userId = await requireUserId();
  const letters = await listCoverLetters(userId);

  const libraryItems: CoverLetterLibraryItem[] = letters.map((letter) => ({
    id: letter.id,
    label: letter.label,
    updatedAt: letter.updatedAt.toISOString(),
  }));

  return (
    <Box>
      <PageHeader
        title="Cover letters"
        subtitle="Write tailored letters and download polished PDFs for each application."
        actions={<CoverLetterPageActions />}
      />

      {letters.length === 0 ? (
        <EmptyStatePanel
          illustrationSrc="/illustrations/empty-resume.svg"
          title="No cover letters yet"
          description="Create a cover letter in the editor, then link it to applications when you apply."
          action={
            <NextLinkButton
              href="/cover-letters/create"
              variant="outlined"
              size="small"
            >
              Create your first letter
            </NextLinkButton>
          }
          marginTop={false}
        />
      ) : (
        <CoverLetterLibrary letters={libraryItems} />
      )}
    </Box>
  );
}
