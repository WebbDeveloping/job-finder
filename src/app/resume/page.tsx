import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ResumeEditorForm } from "@/components/resume/ResumeEditorForm";
import { getResumeProfile, toResumeFormData } from "@/lib/resume";
import type { ResumeProfileFormData } from "@/lib/resume-types";

const emptyDefaults: ResumeProfileFormData = {
  fullName: "",
  email: "",
  phone: null,
  location: null,
  website: null,
  linkedIn: null,
  github: null,
  summary: "",
  skills: "",
  experience: [],
  education: [],
};

export default async function ResumePage() {
  const profile = await getResumeProfile();
  const defaultValues = profile ? toResumeFormData(profile) : emptyDefaults;

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Resume
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Build your resume profile. PDF download comes in a later phase.
      </Typography>
      <ResumeEditorForm
        key={profile?.updatedAt.toISOString() ?? "new"}
        defaultValues={defaultValues}
      />
    </Box>
  );
}
