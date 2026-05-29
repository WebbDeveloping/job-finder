import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { CoverLetterDownloadButton } from "@/components/cover-letter/CoverLetterDownloadButton";
import { NextMuiLink } from "@/components/NextMuiLink";

type ApplicationCoverLetterSectionProps = {
  applicationId: string;
  coverLetter: {
    id: string;
    label: string;
  } | null;
};

export function ApplicationCoverLetterSection({
  applicationId,
  coverLetter,
}: ApplicationCoverLetterSectionProps) {
  if (!coverLetter) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary">
          No cover letter linked
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Choose a letter in{" "}
          <Typography component="span" variant="body2" color="text.primary">
            Application details
          </Typography>{" "}
          below,{" "}
          <NextMuiLink
            href={`/cover-letters/create?applicationId=${applicationId}`}
            underline="hover"
          >
            create one for this role
          </NextMuiLink>
          , or{" "}
          <NextMuiLink href="/cover-letters" underline="hover">
            manage cover letters
          </NextMuiLink>
          .
        </Typography>
      </Box>
    );
  }

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{ alignItems: { sm: "center" } }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle2">{coverLetter.label}</Typography>
        <Typography variant="caption" color="text.secondary">
          Cover letter
        </Typography>
      </Box>
      <CoverLetterDownloadButton
        coverLetterId={coverLetter.id}
        coverLetterLabel={coverLetter.label}
      />
    </Stack>
  );
}
