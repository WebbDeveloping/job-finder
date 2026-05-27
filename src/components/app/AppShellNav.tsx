"use client";

import { usePathname } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { NextMuiLink } from "@/components/NextMuiLink";

const topLevelItems = [
  { href: "/dashboard", label: "Dashboard", match: "dashboard" as const, icon: DashboardOutlinedIcon },
  { href: "/applications", label: "Applications", match: "applications" as const, icon: WorkOutlineOutlinedIcon },
] as const;

const resumeSubItems = [
  { href: "/resume", label: "View Resumes", match: "resume-list" as const },
  { href: "/resume/create", label: "Create Resume", match: "resume-create" as const },
  { href: "/resume/upload", label: "Upload Resume", match: "resume-upload" as const },
] as const;

function isApplicationsSection(pathname: string): boolean {
  return pathname === "/applications" || pathname.startsWith("/applications/");
}

function isJobTrackerSection(pathname: string): boolean {
  return pathname === "/pipeline" || pathname.startsWith("/pipeline/");
}

function isResumeSection(pathname: string): boolean {
  return pathname === "/resume" || pathname.startsWith("/resume/");
}

function isTopLevelActive(
  pathname: string,
  match: (typeof topLevelItems)[number]["match"],
): boolean {
  if (match === "dashboard") {
    return pathname === "/dashboard";
  }
  if (match === "applications") {
    return isApplicationsSection(pathname);
  }
  return false;
}

function isResumeSubActive(
  pathname: string,
  match: (typeof resumeSubItems)[number]["match"],
): boolean {
  if (match === "resume-list") {
    return pathname === "/resume";
  }
  if (match === "resume-create") {
    return pathname === "/resume/create";
  }
  return pathname === "/resume/upload";
}

const listItemSx = {
  borderRadius: 1,
  mb: 0.5,
  "&.Mui-selected": {
    bgcolor: "primary.main",
    color: "primary.contrastText",
    "& .MuiListItemIcon-root": { color: "inherit" },
    "&:hover": { bgcolor: "primary.dark" },
  },
};

const pipelineSubItemSx = {
  ...listItemSx,
  pl: 4,
  py: 0.75,
  "& .MuiListItemText-primary": { fontSize: "0.875rem" },
};

export function AppShellNav() {
  const pathname = usePathname();
  const jobTrackerOpen = isJobTrackerSection(pathname);
  const resumeOpen = isResumeSection(pathname);

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
        <ListItemButton
          component={NextMuiLink}
          href="/dashboard"
          selected={isTopLevelActive(pathname, "dashboard")}
          sx={listItemSx}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <DashboardOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton
          component={NextMuiLink}
          href="/applications"
          selected={isTopLevelActive(pathname, "applications")}
          sx={listItemSx}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <WorkOutlineOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Applications" />
        </ListItemButton>

        <ListItemButton
          component={NextMuiLink}
          href="/pipeline"
          selected={jobTrackerOpen}
          sx={listItemSx}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <TimelineOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Job Tracker" />
        </ListItemButton>

        <ListItemButton
          component={NextMuiLink}
          href="/resume"
          sx={{
            ...listItemSx,
            ...(resumeOpen && {
              color: "text.primary",
              fontWeight: 600,
            }),
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <DescriptionOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Resume" />
        </ListItemButton>
        <Collapse in={resumeOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding dense>
            {resumeSubItems.map(({ href, label, match }) => (
              <ListItemButton
                key={href}
                component={NextMuiLink}
                href={href}
                selected={isResumeSubActive(pathname, match)}
                sx={pipelineSubItemSx}
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  {match === "resume-create" ? (
                    <AddIcon fontSize="small" />
                  ) : match === "resume-upload" ? (
                    <UploadFileOutlinedIcon fontSize="small" />
                  ) : (
                    <DescriptionOutlinedIcon fontSize="small" />
                  )}
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
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
