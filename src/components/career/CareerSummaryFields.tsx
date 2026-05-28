import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { CareerProfileData } from "@/lib/resume-types";

type CareerSummaryFieldsProps = {
  defaultValues: Pick<CareerProfileData, "summary" | "skills">;
};

export function CareerSummaryFields({ defaultValues }: CareerSummaryFieldsProps) {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Summary
        </Typography>
        <TextField
          id="summary"
          name="summary"
          label="Professional summary"
          fullWidth
          multiline
          minRows={4}
          defaultValue={defaultValues.summary}
        />
      </Box>
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Skills
        </Typography>
        <TextField
          id="skills"
          name="skills"
          label="Skills"
          fullWidth
          multiline
          minRows={2}
          placeholder="TypeScript, React, Node.js, PostgreSQL"
          helperText="Comma-separated list"
          defaultValue={defaultValues.skills}
        />
      </Box>
    </Stack>
  );
}
