"use client";

import { usePathname } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import Stack from "@mui/material/Stack";
import { NextLinkButton } from "@/components/NextLinkButton";

export function ResumePageActions() {
  const pathname = usePathname();
  const createActive = pathname === "/resume/create";
  const uploadActive = pathname === "/resume/upload";

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
      <NextLinkButton
        href="/resume/create"
        variant={createActive ? "contained" : "outlined"}
        startIcon={<AddIcon />}
      >
        Create Resume
      </NextLinkButton>
      <NextLinkButton
        href="/resume/upload"
        variant={uploadActive ? "contained" : "outlined"}
        startIcon={<UploadFileOutlinedIcon />}
      >
        Upload Resume
      </NextLinkButton>
    </Stack>
  );
}
