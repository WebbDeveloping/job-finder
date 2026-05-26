"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { NextLinkButton } from "@/components/NextLinkButton";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

type SankeyFiltersProps = {
  sources: string[];
  dateFrom: string;
  dateTo: string;
  source: string;
};

export function SankeyFilters({
  sources,
  dateFrom,
  dateTo,
  source,
}: SankeyFiltersProps) {
  return (
    <Paper component="form" method="get" variant="outlined" sx={{ p: 2 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { sm: "flex-end" }, flexWrap: "wrap" }}
      >
        <TextField
          id="from"
          name="from"
          label="From date"
          type="date"
          defaultValue={dateFrom}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: 160, flex: 1 }}
        />

        <TextField
          id="to"
          name="to"
          label="To date"
          type="date"
          defaultValue={dateTo}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: 160, flex: 1 }}
        />

        <TextField
          id="source"
          name="source"
          label="Source"
          select
          defaultValue={source}
          sx={{ minWidth: 160, flex: 1 }}
        >
          <MenuItem value="">All sources</MenuItem>
          {sources.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button type="submit" variant="contained">
            Apply
          </Button>
          <NextLinkButton href="/pipeline/analytics" variant="outlined">
            Clear
          </NextLinkButton>
        </Box>
      </Stack>
    </Paper>
  );
}
