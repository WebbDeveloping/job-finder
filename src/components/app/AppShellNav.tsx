"use client";

import { usePathname } from "next/navigation";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { NextMuiLink } from "@/components/NextMuiLink";

const navItems = [
  { href: "/dashboard", label: "Dashboard", match: "dashboard", icon: DashboardOutlinedIcon },
  { href: "/pipeline", label: "Pipeline", match: "pipeline", icon: TimelineOutlinedIcon },
  {
    href: "/pipeline/analytics",
    label: "Analytics",
    match: "analytics",
    icon: BarChartOutlinedIcon,
  },
  { href: "/resume", label: "Resume", match: "resume", icon: DescriptionOutlinedIcon },
] as const;

function isActive(pathname: string, match: (typeof navItems)[number]["match"]): boolean {
  if (match === "dashboard") {
    return pathname === "/dashboard";
  }
  if (match === "analytics") {
    return pathname === "/pipeline/analytics";
  }
  if (match === "resume") {
    return pathname === "/resume" || pathname.startsWith("/resume/");
  }
  if (match === "pipeline") {
    return (
      pathname === "/pipeline" ||
      pathname === "/pipeline/new" ||
      /^\/pipeline\/[^/]+$/.test(pathname)
    );
  }
  return false;
}

export function AppShellNav() {
  const pathname = usePathname();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ px: 2, py: 2 }}>
        <NextMuiLink
          href="/dashboard"
          underline="none"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "text.primary",
            fontWeight: 700,
          }}
        >
          <WorkOutlineOutlinedIcon color="primary" fontSize="small" aria-hidden />
          Job Finder
        </NextMuiLink>
      </Box>
      <List component="nav" sx={{ px: 1, flexGrow: 1 }}>
        {navItems.map(({ href, label, match, icon: Icon }) => {
          const active = isActive(pathname, match);
          return (
            <ListItemButton
              key={href}
              component={NextMuiLink}
              href={href}
              selected={active}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "& .MuiListItemIcon-root": { color: "inherit" },
                  "&:hover": { bgcolor: "primary.dark" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          );
        })}
      </List>
      <Divider />
      <List sx={{ px: 1, py: 1 }}>
        <ListItemButton
          component={NextMuiLink}
          href="/settings"
          selected={pathname === "/settings"}
          sx={{ borderRadius: 1 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <SettingsOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </List>
    </Box>
  );
}
