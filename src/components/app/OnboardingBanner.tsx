import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { NextLinkButton } from "@/components/NextLinkButton";

type OnboardingBannerProps = {
  hasApplications: boolean;
  hasResume: boolean;
};

export function OnboardingBanner({
  hasApplications,
  hasResume,
}: OnboardingBannerProps) {
  if (hasApplications && hasResume) {
    return null;
  }

  return (
    <Alert severity="info" icon={<RocketLaunchOutlinedIcon />} sx={{ mb: 3 }}>
      <AlertTitle>Welcome to Job Finder</AlertTitle>
      {!hasApplications ? (
        <>
          Start by adding your first job application to your pipeline.{" "}
          <NextLinkButton href="/pipeline/new" size="small" variant="outlined" sx={{ ml: 1 }}>
            Add application
          </NextLinkButton>
        </>
      ) : !hasResume ? (
        <>
          Your pipeline is underway. Next, set up your resume profile so you can
          export a PDF.{" "}
          <NextLinkButton href="/resume" size="small" variant="outlined" sx={{ ml: 1 }}>
            Build resume
          </NextLinkButton>
        </>
      ) : null}
    </Alert>
  );
}
