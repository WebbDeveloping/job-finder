import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DashboardStats } from "@/components/app/DashboardStats";
import { OnboardingBanner } from "@/components/app/OnboardingBanner";
import { NextLinkButton } from "@/components/NextLinkButton";
import { listApplications } from "@/lib/application";
import { requireUser } from "@/lib/auth";
import { getResumeProfile } from "@/lib/resume";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireUser();
  const userId = session.user.id!;
  const [applications, resume] = await Promise.all([
    listApplications(userId),
    getResumeProfile(userId),
  ]);

  const greeting = session.user.name?.split(" ")[0] ?? "there";

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
        hasResume={resume !== null}
      />

      <DashboardStats
        applicationCount={applications.length}
        hasResume={resume !== null}
      />

      <Typography variant="h6" component="h2" gutterBottom>
        Quick actions
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
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
    </Box>
  );
}
