"use client";

import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { NextLinkButton } from "@/components/NextLinkButton";
import { NextMuiLink } from "@/components/NextMuiLink";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";

const links = [
  { href: "/pipeline", label: "Pipeline", match: "pipeline-list" },
  { href: "/pipeline/analytics", label: "Analytics", match: "pipeline-analytics" },
  { href: "/resume", label: "Resume", match: "resume" },
] as const;

function isActive(
  pathname: string,
  match: (typeof links)[number]["match"],
): boolean {
  if (match === "resume") {
    return pathname === "/resume" || pathname.startsWith("/resume/");
  }
  if (match === "pipeline-analytics") {
    return pathname === "/pipeline/analytics";
  }
  return (
    pathname === "/pipeline" ||
    pathname === "/pipeline/new" ||
    /^\/pipeline\/[^/]+$/.test(pathname)
  );
}

export function AppNav() {
  const pathname = usePathname();

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 4, minHeight: 56 }}>
          <NextMuiLink
            href="/pipeline"
            variant="subtitle1"
            underline="none"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            Job Finder
          </NextMuiLink>
          <Box component="nav" sx={{ display: "flex", gap: 0.5 }}>
            {links.map(({ href, label, match }) => {
              const active = isActive(pathname, match);
              return (
                <NextLinkButton
                  key={href}
                  href={href}
                  size="small"
                  color={active ? "primary" : "inherit"}
                  variant={active ? "contained" : "text"}
                  sx={{ textTransform: "none" }}
                >
                  {label}
                </NextLinkButton>
              );
            })}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
