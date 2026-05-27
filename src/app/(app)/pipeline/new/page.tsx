import Box from "@mui/material/Box";
import { NextMuiLink } from "@/components/NextMuiLink";
import Typography from "@mui/material/Typography";
import { ApplicationForm } from "@/components/pipeline/ApplicationForm";

export default function NewApplicationPage() {
  return (
    <Box>
      <NextMuiLink
        href="/pipeline"
        underline="hover"
        variant="body2"
        color="text.secondary"
      >
        ← Back to pipeline
      </NextMuiLink>
      <Typography variant="h4" component="h1" sx={{ mt: 2 }}>
        Add application
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        New applications start on your wishlist until you submit.
      </Typography>
      <Box sx={{ mt: 4, maxWidth: 480 }}>
        <ApplicationForm mode="create" />
      </Box>
    </Box>
  );
}
