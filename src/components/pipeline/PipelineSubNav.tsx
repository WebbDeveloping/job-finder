"use client";

import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import NextLink from "next/link";

const tabs = [
  { href: "/pipeline", label: "Applications", match: "applications" as const },
  { href: "/pipeline/analytics", label: "Analytics", match: "analytics" as const },
] as const;

function isTabActive(pathname: string, match: (typeof tabs)[number]["match"]): boolean {
  if (match === "analytics") {
    return pathname === "/pipeline/analytics";
  }
  return (
    pathname === "/pipeline" ||
    pathname === "/pipeline/new" ||
    /^\/pipeline\/[^/]+$/.test(pathname)
  );
}

export function PipelineSubNav() {
  const pathname = usePathname();
  const activeIndex = tabs.findIndex((tab) => isTabActive(pathname, tab.match));

  return (
    <Box
      sx={{
        display: { xs: "block", md: "none" },
        borderBottom: 1,
        borderColor: "divider",
        mb: 2,
      }}
    >
      <Tabs
        value={activeIndex === -1 ? false : activeIndex}
        variant="fullWidth"
        aria-label="Pipeline views"
      >
        {tabs.map(({ href, label, match }, index) => (
          <Tab
            key={href}
            component={NextLink}
            href={href}
            label={label}
            value={index}
            aria-current={isTabActive(pathname, match) ? "page" : undefined}
            sx={{ textTransform: "none", minHeight: 44 }}
          />
        ))}
      </Tabs>
    </Box>
  );
}
