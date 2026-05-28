import type { Metadata } from "next";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ProfilePageClient } from "@/components/profile/ProfilePageClient";
import { profileCompletionPercent } from "@/lib/career-profile-form";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getOrSeedUserProfile,
  getUserProfileRow,
} from "@/lib/user-profile";

export const metadata: Metadata = {
  title: "Profile",
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await requireUser();
  const userId = session.user.id;

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { email: true, plan: true },
  });

  const careerDefaults = await getOrSeedUserProfile(userId);
  const profileRow = await getUserProfileRow(userId);
  const formKey = profileRow?.updatedAt.toISOString() ?? "new";

  const completion = profileCompletionPercent(careerDefaults);

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          mb: 3,
          justifyContent: "space-between",
          alignItems: { sm: "flex-start" },
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Keep your career details in one place. New resumes start from this
            information—you can still customize each resume separately.
          </Typography>
        </Box>
        <Chip
          label={`${completion}% complete`}
          size="small"
          color={completion >= 75 ? "success" : "default"}
          variant="outlined"
          sx={{ flexShrink: 0, alignSelf: { xs: "flex-start", sm: "center" } }}
        />
      </Stack>

      <ProfilePageClient
        careerDefaults={careerDefaults}
        email={user.email}
        plan={user.plan}
        formKey={formKey}
      />
    </Box>
  );
}
