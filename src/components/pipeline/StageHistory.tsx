import type { StageEvent } from "@/generated/prisma/client";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { StageBadge } from "@/components/pipeline/StageBadge";
import { formatDateTime } from "@/lib/datetime";
import { formatStage } from "@/lib/stages";

type StageHistoryProps = {
  events: StageEvent[];
};

export function StageHistory({ events }: StageHistoryProps) {
  const sorted = [...events].sort((a, b) => {
    const timeDiff = b.timestamp.getTime() - a.timestamp.getTime();
    if (timeDiff !== 0) return timeDiff;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  if (sorted.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No stage history yet.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>When</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((event) => (
            <TableRow key={event.id} hover>
              <TableCell>{formatStage(event.fromStage)}</TableCell>
              <TableCell>
                <StageBadge stage={event.toStage} />
              </TableCell>
              <TableCell>{formatDateTime(event.timestamp)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
