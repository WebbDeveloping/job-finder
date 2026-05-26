import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DeleteAccountButton } from "@/components/settings/DeleteAccountButton";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Settings",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await requireUser();
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { name: true, email: true, plan: true },
  });

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Manage your profile and account.
      </Typography>

      <Stack spacing={4} sx={{ maxWidth: 560 }}>
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Profile
          </Typography>
          <ProfileForm name={user.name ?? ""} email={user.email} />
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Billing
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            You are on the <strong>{user.plan}</strong> plan.
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
      </Stack>

      <Divider sx={{ my: 4 }} />
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
    </Box>
  );
}
