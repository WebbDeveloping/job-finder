import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DeleteAccountButton } from "@/components/profile/DeleteAccountButton";
import { AppCard } from "@/components/ui/AppCard";
import { DangerZone } from "@/components/ui/DangerZone";

type ProfileAccountTabProps = {
  email: string;
  plan: string;
};

export function ProfileAccountTab({ email, plan }: ProfileAccountTabProps) {
  return (
    <Stack spacing={3}>
      <AppCard padding="card">
        <Stack spacing={2}>
          <Typography variant="appSectionTitle" component="h2">
            Account
          </Typography>
          <TextField
            label="Email"
            value={email}
            fullWidth
            disabled
            helperText="Email cannot be changed."
          />
        </Stack>
      </AppCard>

      <AppCard padding="card">
        <Stack spacing={2}>
          <Typography variant="appSectionTitle" component="h2">
            Billing
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You are on the <strong>{plan}</strong> plan.
          </Typography>
          <Button variant="outlined" disabled>
            Upgrade to Pro — coming soon
          </Button>
        </Stack>
      </AppCard>

      <DangerZone
        description="Permanently delete your account and all associated data."
        action={<DeleteAccountButton />}
      />

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
