import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          Privacy Policy
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Job Finder stores the account and job-search data you enter (applications,
          stage history, and resume profile) to provide the service. We do not sell
          your personal information.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You may delete your account at any time from Settings. Deleting your
          account permanently removes your applications and resume data from our
          database.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This is a placeholder policy for the free tier. A full legal review will
          be added before public launch.
        </Typography>
      </Stack>
    </Container>
  );
}
