import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  DashboardApplicationsList,
  type DashboardApplicationRow,
} from "@/components/app/DashboardApplicationsList";
import { DashboardStats } from "@/components/app/DashboardStats";
import { OnboardingBanner } from "@/components/app/OnboardingBanner";
import { NextLinkButton } from "@/components/NextLinkButton";
import {
  getCurrentStage,
  getLastStageEventAt,
  listApplications,
} from "@/lib/application";
import { requireUser } from "@/lib/auth";
import { listResumes } from "@/lib/resume";

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
  const [applications, resumes] = await Promise.all([
    listApplications(userId),
    listResumes(userId),
  ]);
  const hasResume = resumes.length > 0;

  const greeting = session.user.name?.split(" ")[0] ?? "there";
  const applicationRows = toDashboardRows(applications);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Hi {greeting} — here is an overview of your job search.
      </Typography>

      <OnboardingBanner
        hasApplications={applications.length > 0}
        hasResume={hasResume}
      />

      <Typography variant="h6" component="h2" gutterBottom>
        Quick actions
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mb: 4 }}>
        <NextLinkButton href="/pipeline/new" variant="contained">
          Add application
        </NextLinkButton>
        <NextLinkButton href="/pipeline" variant="outlined">
          View pipeline
        </NextLinkButton>
        <NextLinkButton href="/pipeline/analytics" variant="outlined">
          Analytics
        </NextLinkButton>
        <NextLinkButton href="/resume" variant="outlined">
          Resume
        </NextLinkButton>
      </Stack>

      <DashboardStats
        applicationCount={applications.length}
        hasResume={hasResume}
      />

      <DashboardApplicationsList applications={applicationRows} />
    </Box>
  );
}
