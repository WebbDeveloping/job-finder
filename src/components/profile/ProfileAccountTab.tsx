import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DeleteAccountButton } from "@/components/profile/DeleteAccountButton";

type ProfileAccountTabProps = {
  email: string;
  plan: string;
};

export function ProfileAccountTab({ email, plan }: ProfileAccountTabProps) {
  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Account
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Email"
            value={email}
            fullWidth
            disabled
            helperText="Email cannot be changed."
          />
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Billing
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          You are on the <strong>{plan}</strong> plan.
        </Typography>
        <Button variant="outlined" disabled>
          Upgrade to Pro — coming soon
        </Button>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom color="error">
          Danger zone
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Permanently delete your account and all associated data.
        </Typography>
        <DeleteAccountButton />
      </Paper>

      <Divider />
      <Typography variant="caption" color="text.secondary">
        Need help? See our{" "}
        <Typography
          component="a"
          href="/privacy"
          variant="caption"
          color="primary"
        >
          Privacy Policy
        </Typography>
        .
      </Typography>
    </Stack>
  );
}
