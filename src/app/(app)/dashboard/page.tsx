import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {
  DashboardApplicationsList,
  type DashboardApplicationRow,
} from "@/components/app/DashboardApplicationsList";
import {
  DashboardDocumentsList,
  type DashboardDocumentRow,
} from "@/components/app/DashboardDocumentsList";
import { OnboardingBanner } from "@/components/app/OnboardingBanner";
import { NextLinkButton } from "@/components/NextLinkButton";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageSection } from "@/components/ui/PageSection";
import {
  getCurrentStage,
  getLastStageEventAt,
  listApplications,
} from "@/lib/application";
import { requireUser } from "@/lib/auth";
import { listCoverLetters } from "@/lib/cover-letter";
import { listResumes } from "@/lib/resume";
import { appTokens } from "@/theme/tokens";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

function toDashboardRows(
  applications: Awaited<ReturnType<typeof listApplications>>,
): DashboardApplicationRow[] {
  return applications.map((app) => {
    const lastAt = getLastStageEventAt(app.stageEvents);
    return {
      id: app.id,
      company: app.company,
      role: app.role,
      source: app.source,
      stage: getCurrentStage(app.stageEvents),
      lastUpdatedAt: lastAt?.toISOString() ?? null,
      createdAt: app.createdAt.toISOString(),
    };
  });
}

export default async function DashboardPage() {
  const session = await requireUser();
  const userId = session.user.id!;
  const [applications, resumes, coverLetters] = await Promise.all([
    listApplications(userId),
    listResumes(userId),
    listCoverLetters(userId),
  ]);
  const hasResume = resumes.length > 0;

  const greeting = session.user.name?.split(" ")[0] ?? "there";
  const applicationRows = toDashboardRows(applications);

  const documentRows: DashboardDocumentRow[] = [
    ...resumes.map((resume) => ({
      id: resume.id,
      label: resume.label,
      kind: "resume" as const,
      resumeKind: resume.kind,
      isDefault: resume.isDefault,
      updatedAt: resume.updatedAt.toISOString(),
      href:
        resume.kind === "BUILT"
          ? `/resume/create?id=${resume.id}`
          : "/resume",
    })),
    ...coverLetters.map((letter) => ({
      id: letter.id,
      label: letter.label,
      kind: "cover-letter" as const,
      updatedAt: letter.updatedAt.toISOString(),
      href: `/cover-letters/create?id=${letter.id}`,
    })),
  ];

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle={`Hi ${greeting} — here is an overview of your job search.`}
      />

      <OnboardingBanner
        hasApplications={applications.length > 0}
        hasResume={hasResume}
      />

      <PageSection title="Quick links" gap="large">
        <Stack direction={{ xs: "column", sm: "row" }} spacing={appTokens.quickActionsGap}>
          <NextLinkButton href="/applications/new" variant="contained">
            Add application
          </NextLinkButton>
          <NextLinkButton href="/applications" variant="outlined">
            View applications
          </NextLinkButton>
          <NextLinkButton href="/pipeline" variant="outlined">
            Job tracker
          </NextLinkButton>
          <NextLinkButton href="/resume" variant="outlined">
            Resume
          </NextLinkButton>
          <NextLinkButton href="/cover-letters" variant="outlined">
            Cover letters
          </NextLinkButton>
        </Stack>
      </PageSection>

      <DashboardApplicationsList applications={applicationRows} />

      <DashboardDocumentsList documents={documentRows} />
    </Box>
  );
}
