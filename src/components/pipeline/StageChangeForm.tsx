"use client";

import { useActionState } from "react";
import type { Stage } from "@/generated/prisma/client";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { ActionState } from "@/app/(app)/pipeline/actions";
import { logStageChange } from "@/app/(app)/pipeline/actions";
import { StageBadge } from "@/components/pipeline/StageBadge";
import { toDatetimeLocalValue } from "@/lib/datetime";
import { ALL_STAGES } from "@/lib/stages";

type StageChangeFormProps = {
  applicationId: string;
  currentStage: Stage;
};

const initialState: ActionState = {};

export function StageChangeForm({
  applicationId,
  currentStage,
}: StageChangeFormProps) {
  const action = logStageChange.bind(null, applicationId);
  const [state, formAction, pending] = useActionState(action, initialState);

  const defaultTimestamp = toDatetimeLocalValue(new Date());

  return (
    <Stack component="form" action={formAction} spacing={2.5}>
      <input type="hidden" name="expectedFromStage" value={currentStage} />

      <Box>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Current stage
        </Typography>
        <StageBadge stage={currentStage} />
      </Box>

      <TextField
        id="toStage"
        name="toStage"
        label="Move to"
        select
        required
        fullWidth
        defaultValue=""
      >
        <MenuItem value="" disabled>
          Select stage…
        </MenuItem>
        {ALL_STAGES.filter((s) => s !== currentStage).map((stage) => (
          <MenuItem key={stage} value={stage}>
            {stage}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        id="timestamp"
        name="timestamp"
        label="When"
        type="datetime-local"
        fullWidth
        defaultValue={defaultTimestamp}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      {state.error && <Alert severity="error">{state.error}</Alert>}

      <Button type="submit" variant="contained" disabled={pending}>
        {pending ? "Logging…" : "Log stage change"}
      </Button>
    </Stack>
  );
}
