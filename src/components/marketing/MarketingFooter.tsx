import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { NextMuiLink } from "@/components/NextMuiLink";

export function MarketingFooter() {
  return (
    <Box component="footer" sx={{ mt: "auto", py: 4 }}>
      <Container maxWidth="lg">
        <Divider sx={{ mb: 3 }} />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Job Finder
          </Typography>
          <Stack direction="row" spacing={3}>
            <NextMuiLink href="/privacy" variant="body2" color="text.secondary">
              Privacy
            </NextMuiLink>
            <NextMuiLink href="/terms" variant="body2" color="text.secondary">
              Terms
            </NextMuiLink>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
