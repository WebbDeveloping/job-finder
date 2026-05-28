"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { CareerProfileForm } from "@/components/profile/CareerProfileForm";
import { ProfileAccountTab } from "@/components/profile/ProfileAccountTab";
import type { CareerProfileData } from "@/lib/resume-types";

type ProfilePageClientProps = {
  careerDefaults: CareerProfileData;
  email: string;
  plan: string;
  formKey: string;
};

export function ProfilePageClient({
  careerDefaults,
  email,
  plan,
  formKey,
}: ProfilePageClientProps) {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Career" />
        <Tab label="Account" />
      </Tabs>

      {tab === 0 ? (
        <CareerProfileForm key={formKey} defaultValues={careerDefaults} />
      ) : (
        <ProfileAccountTab email={email} plan={plan} />
      )}
    </Box>
  );
}
