"use client";

import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import NextLink from "next/link";

const links = [
  { href: "/dashboard", label: "Home", prefix: "/dashboard" },
  { href: "/pipeline", label: "Pipeline", prefix: "/pipeline" },
  { href: "/resume", label: "Resume", prefix: "/resume" },
  { href: "/settings", label: "Settings", prefix: "/settings" },
] as const;

function isLinkActive(pathname: string, prefix: string): boolean {
  if (prefix === "/pipeline") {
    return pathname.startsWith("/pipeline");
  }
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function AppShellMobileNav() {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        gap: 0.5,
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
