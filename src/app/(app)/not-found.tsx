import SearchOffOutlinedIcon from "@mui/icons-material/SearchOffOutlined";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { NextLinkButton } from "@/components/NextLinkButton";
import { IconBadge } from "@/components/ui/IconBadge";

export default function AppNotFound() {
  return (
    <Box sx={{ maxWidth: 480 }}>
      <Stack spacing={3}>
        <IconBadge icon={<SearchOffOutlinedIcon />} size={56} />
        <Box>
          <Typography variant="h5" component="h1" gutterBottom>
            Page not found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This page does not exist or you may not have access to it.
          </Typography>
        </Box>
        <NextLinkButton href="/dashboard" variant="contained" sx={{ alignSelf: "flex-start" }}>
          Back to dashboard
        </NextLinkButton>
      </Stack>
    </Box>
  );
}
