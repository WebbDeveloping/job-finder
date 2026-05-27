"use client";

import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { NextLinkButton } from "@/components/NextLinkButton";
import { ResumeUploadDialog } from "@/components/resume/ResumeUploadDialog";

export function ResumePageActions() {
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <NextLinkButton href="/resume?new=built" variant="contained" startIcon={<AddIcon />}>
          New built resume
        </NextLinkButton>
        <Button
          variant="outlined"
          startIcon={<UploadFileOutlinedIcon />}
          onClick={() => setUploadOpen(true)}
        >
          Upload PDF
        </Button>
      </Stack>
      <ResumeUploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </>
  );
}
