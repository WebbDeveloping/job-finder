import type { Metadata } from "next";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { MarketingSection } from "@/components/ui/MarketingSection";
import { marketingTokens } from "@/theme/tokens";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <MarketingSection maxWidth={marketingTokens.containerNarrow} py="default">
      <Stack spacing={3}>
        <Typography variant="marketingSectionTitle" component="h1">
          Terms of Service
        </Typography>
        <Typography variant="marketingLead" color="text.secondary">
          Job Finder is provided as-is during the free tier. You are responsible for
          the accuracy of information you enter and for keeping your login
          credentials secure.
        </Typography>
        <Typography variant="marketingLead" color="text.secondary">
          We may update features, limits, or pricing as the product evolves. Paid
          plans and billing terms will be described separately when they become
          available.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This is a placeholder terms page for development. Formal terms will be
          published before general availability.
        </Typography>
      </Stack>
    </MarketingSection>
  );
}
