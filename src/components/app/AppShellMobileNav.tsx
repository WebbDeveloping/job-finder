"use client";

import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import NextLink from "next/link";
import { appTokens } from "@/theme/tokens";

const links = [
  { href: "/dashboard", label: "Home", prefix: "/dashboard" },
  { href: "/applications", label: "Applications", prefix: "/applications" },
  { href: "/pipeline", label: "Job Tracker", prefix: "/pipeline" },
  { href: "/resume", label: "Resume", prefix: "/resume" },
  { href: "/profile", label: "Profile", prefix: "/profile" },
] as const;

function isLinkActive(pathname: string, prefix: string): boolean {
  if (prefix === "/pipeline") {
    return pathname.startsWith("/pipeline");
  }
  if (prefix === "/profile") {
    return (
      pathname === "/profile" ||
      pathname.startsWith("/profile/") ||
      pathname.startsWith("/settings")
    );
  }
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function AppShellMobileNav() {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        gap: appTokens.quickActionsGap,
        px: 1,
        py: 1,
        overflowX: "auto",
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      {links.map(({ href, label, prefix }) => {
        const active = isLinkActive(pathname, prefix);
        return (
          <Button
            key={href}
            component={NextLink}
            href={href}
            size="small"
            variant={active ? "contained" : "text"}
            sx={{ flexShrink: 0, textTransform: "none" }}
          >
            {label}
          </Button>
        );
      })}
    </Box>
  );
}
