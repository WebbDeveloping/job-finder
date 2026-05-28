import type { Metadata } from "next";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { MarketingSection } from "@/components/ui/MarketingSection";
import { marketingTokens } from "@/theme/tokens";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <MarketingSection maxWidth={marketingTokens.containerNarrow} py="default">
      <Stack spacing={3}>
        <Typography variant="marketingSectionTitle" component="h1">
          Privacy Policy
        </Typography>
        <Typography variant="marketingLead" color="text.secondary">
          Job Finder stores the account and job-search data you enter (applications,
          stage history, and resume profile) to provide the service. We do not sell
          your personal information.
        </Typography>
        <Typography variant="marketingLead" color="text.secondary">
          You may delete your account at any time from Settings. Deleting your
          account permanently removes your applications and resume data from our
          database.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This is a placeholder policy for the free tier. A full legal review will
          be added before public launch.
        </Typography>
      </Stack>
    </MarketingSection>
  );
}
