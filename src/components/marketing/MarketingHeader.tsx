import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { NextLinkButton } from "@/components/NextLinkButton";
import { NextMuiLink } from "@/components/NextMuiLink";

export function MarketingHeader() {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 64 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <WorkOutlineOutlinedIcon color="primary" aria-hidden />
            <NextMuiLink
              href="/"
              variant="subtitle1"
              underline="none"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              Job Finder
            </NextMuiLink>
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <NextLinkButton href="/login" size="small" variant="text">
              Sign in
            </NextLinkButton>
            <NextLinkButton href="/signup" size="small" variant="contained">
              Get started
            </NextLinkButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
