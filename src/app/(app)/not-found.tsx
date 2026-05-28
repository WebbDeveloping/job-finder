import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { NextLinkButton } from "@/components/NextLinkButton";
import { IconBadge } from "@/components/ui/IconBadge";
import { FormColumn } from "@/components/ui/FormColumn";

export default function AppNotFound() {
  return (
    <FormColumn>
      <Stack spacing={3}>
        <IconBadge icon={<SearchOffOutlinedIcon />} size={56} />
        <Stack spacing={0.5}>
          <Typography variant="appPageTitle" component="h1">
            Page not found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This page does not exist or you may not have access to it.
          </Typography>
        </Stack>
        <NextLinkButton href="/dashboard" variant="contained" sx={{ alignSelf: "flex-start" }}>
          Back to dashboard
        </NextLinkButton>
      </Stack>
    </FormColumn>
  );
}
