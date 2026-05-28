import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { newExperience } from "@/lib/career-profile-form";
import type { ResumeExperienceEntry } from "@/lib/resume-types";

type CareerExperienceListProps = {
  experience: ResumeExperienceEntry[];
  onChange: (entries: ResumeExperienceEntry[]) => void;
};

export function CareerExperienceList({
  experience,
  onChange,
}: CareerExperienceListProps) {
  function updateEntry(
    id: string,
    field: keyof ResumeExperienceEntry,
    value: string,
  ) {
    onChange(
      experience.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  }

  function removeEntry(id: string) {
    const next = experience.filter((item) => item.id !== id);
    onChange(next.length > 0 ? next : [newExperience()]);
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
        <Typography variant="subtitle2">Roles</Typography>
        <Button
          type="button"
          size="small"
          onClick={() => onChange([...experience, newExperience()])}
        >
          Add role
        </Button>
      </Stack>
      <Stack spacing={2}>
        {experience.map((entry, index) => (
          <Paper key={entry.id} variant="outlined" sx={{ p: 2 }}>
            <Stack
              direction="row"
              sx={{
                mb: 2,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle2">Role {index + 1}</Typography>
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
                label="Company"
                required
                fullWidth
                value={entry.company}
                onChange={(e) =>
                  updateEntry(entry.id, "company", e.target.value)
                }
              />
              <TextField
                label="Title"
                required
                fullWidth
                value={entry.title}
                onChange={(e) => updateEntry(entry.id, "title", e.target.value)}
              />
              <TextField
                label="Location"
                fullWidth
                value={entry.location}
                onChange={(e) =>
                  updateEntry(entry.id, "location", e.target.value)
                }
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Start"
                  fullWidth
                  placeholder="Jan 2022"
                  value={entry.startDate}
                  onChange={(e) =>
                    updateEntry(entry.id, "startDate", e.target.value)
                  }
                />
                <TextField
                  label="End"
                  fullWidth
                  placeholder="Present"
                  value={entry.endDate}
                  onChange={(e) =>
                    updateEntry(entry.id, "endDate", e.target.value)
                  }
                />
              </Stack>
              <TextField
                label="Highlights"
                fullWidth
                multiline
                minRows={3}
                placeholder="One bullet per line"
                value={entry.highlights}
                onChange={(e) =>
                  updateEntry(entry.id, "highlights", e.target.value)
                }
              />
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
