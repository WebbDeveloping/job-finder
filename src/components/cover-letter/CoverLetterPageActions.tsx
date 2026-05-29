import Stack from "@mui/material/Stack";
import { NextLinkButton } from "@/components/NextLinkButton";

export function CoverLetterPageActions() {
  return (
    <Stack direction="row" spacing={1}>
      <NextLinkButton href="/cover-letters/create" variant="contained" size="small">
        Create cover letter
      </NextLinkButton>
    </Stack>
  );
}
