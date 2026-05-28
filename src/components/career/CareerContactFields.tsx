import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { ChangeEvent } from "react";
import { formatPhoneInput, formatPhoneForDisplay } from "@/lib/phone-format";
import type { CareerProfileData } from "@/lib/resume-types";

type CareerContactFieldsProps = {
  defaultValues: Pick<
    CareerProfileData,
    | "fullName"
    | "email"
    | "phone"
    | "location"
    | "website"
    | "linkedIn"
    | "github"
  >;
  emailRequired?: boolean;
  fullNameRequired?: boolean;
};

export function CareerContactFields({
  defaultValues,
  emailRequired = false,
  fullNameRequired = false,
}: CareerContactFieldsProps) {
  function handlePhoneInput(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    event.currentTarget.value = formatPhoneInput(event.currentTarget.value);
  }

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Contact
      </Typography>
      <Stack spacing={2}>
        <TextField
          id="fullName"
          name="fullName"
          label="Full name"
          required={fullNameRequired}
          fullWidth
          defaultValue={defaultValues.fullName}
        />
        <TextField
          id="email"
          name="email"
          label="Email"
          type="email"
          required={emailRequired}
          fullWidth
          defaultValue={defaultValues.email}
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            id="phone"
            name="phone"
            label="Phone"
            fullWidth
            defaultValue={formatPhoneForDisplay(defaultValues.phone)}
            onChange={handlePhoneInput}
          />
          <TextField
            id="location"
            name="location"
            label="Location"
            fullWidth
            placeholder="City, State"
            defaultValue={defaultValues.location ?? ""}
          />
        </Stack>
        <TextField
          id="website"
          name="website"
          label="Website"
          fullWidth
          placeholder="https://"
          defaultValue={defaultValues.website ?? ""}
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            id="linkedIn"
            name="linkedIn"
            label="LinkedIn"
            fullWidth
            placeholder="https://linkedin.com/in/..."
            defaultValue={defaultValues.linkedIn ?? ""}
          />
          <TextField
            id="github"
            name="github"
            label="GitHub"
            fullWidth
            placeholder="https://github.com/..."
            defaultValue={defaultValues.github ?? ""}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
