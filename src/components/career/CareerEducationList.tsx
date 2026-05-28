import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { newEducation } from "@/lib/career-profile-form";
import type { ResumeEducationEntry } from "@/lib/resume-types";

type CareerEducationListProps = {
  education: ResumeEducationEntry[];
  onChange: (entries: ResumeEducationEntry[]) => void;
};

export function CareerEducationList({
  education,
  onChange,
}: CareerEducationListProps) {
  function updateEntry(
    id: string,
    field: keyof ResumeEducationEntry,
    value: string,
  ) {
    onChange(
      education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  }

  function removeEntry(id: string) {
    const next = education.filter((item) => item.id !== id);
    onChange(next.length > 0 ? next : [newEducation()]);
  }

  return (
    <Box>
      <Stack
        direction="row"
        sx={{
          mb: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="subtitle2">Schools</Typography>
        <Button
          type="button"
          size="small"
          onClick={() => onChange([...education, newEducation()])}
        >
          Add school
        </Button>
      </Stack>
      <Stack spacing={2}>
        {education.map((entry, index) => (
          <Paper key={entry.id} variant="outlined" sx={{ p: 2 }}>
            <Stack
              direction="row"
              sx={{
                mb: 2,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle2">School {index + 1}</Typography>
              <Button
                type="button"
                size="small"
                color="inherit"
                onClick={() => removeEntry(entry.id)}
              >
                Remove
              </Button>
            </Stack>
            <Stack spacing={2}>
              <TextField
                label="School"
                required
                fullWidth
                value={entry.school}
                onChange={(e) =>
                  updateEntry(entry.id, "school", e.target.value)
                }
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Degree"
                  required
                  fullWidth
                  value={entry.degree}
                  onChange={(e) =>
                    updateEntry(entry.id, "degree", e.target.value)
                  }
                />
                <TextField
                  label="Field of study"
                  fullWidth
                  value={entry.field}
                  onChange={(e) =>
                    updateEntry(entry.id, "field", e.target.value)
                  }
                />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Start"
                  fullWidth
                  placeholder="2016"
                  value={entry.startDate}
                  onChange={(e) =>
                    updateEntry(entry.id, "startDate", e.target.value)
                  }
                />
                <TextField
                  label="End"
                  fullWidth
                  placeholder="2020"
                  value={entry.endDate}
                  onChange={(e) =>
                    updateEntry(entry.id, "endDate", e.target.value)
                  }
                />
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
