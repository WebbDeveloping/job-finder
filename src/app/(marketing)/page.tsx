import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { LandingHero } from "@/components/marketing/LandingHero";
import { NextLinkButton } from "@/components/NextLinkButton";
import { auth } from "@/lib/auth";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <>
      <LandingHero />

      <Container maxWidth="lg" sx={{ pb: 10 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
          Everything you need in one place
        </Typography>
        <FeatureGrid />

        <Paper
          variant="outlined"
          sx={{
            mt: 8,
            p: { xs: 3, md: 5 },
            textAlign: "center",
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            Ready to take control of your search?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 480, mx: "auto" }}
          >
            Create a free account and add your first application in minutes.
          </Typography>
          <NextLinkButton href="/signup" variant="contained" size="large">
            Create free account
          </NextLinkButton>
        </Paper>
      </Container>
    </>
  );
}
