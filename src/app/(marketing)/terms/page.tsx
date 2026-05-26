import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          Terms of Service
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Job Finder is provided as-is during the free tier. You are responsible for
          the accuracy of information you enter and for keeping your login
          credentials secure.
        </Typography>
        <Typography variant="body1" color="text.secondary">
          We may update features, limits, or pricing as the product evolves. Paid
          plans and billing terms will be described separately when they become
          available.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This is a placeholder terms page for development. Formal terms will be
          published before general availability.
        </Typography>
      </Stack>
    </Container>
  );
}
