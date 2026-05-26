import Box from "@mui/material/Box";
import { NextLinkButton } from "@/components/NextLinkButton";
import { NextMuiLink } from "@/components/NextMuiLink";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { StageBadge } from "@/components/pipeline/StageBadge";
import {
  getCurrentStage,
  getLastStageEventAt,
  listApplications,
} from "@/lib/application";
import { formatDateTime } from "@/lib/datetime";

export const dynamic = "force-dynamic";

export default async function PipelinePage() {
  const applications = await listApplications();

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { sm: "center" },
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Pipeline
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track job applications and stage changes.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <NextLinkButton href="/pipeline/analytics" variant="outlined">
            Analytics
          </NextLinkButton>
          <NextLinkButton href="/pipeline/new" variant="contained">
            Add application
          </NextLinkButton>
        </Stack>
      </Stack>

      {applications.length === 0 ? (
        <Paper
          variant="outlined"
          sx={{
            mt: 6,
            py: 6,
            px: 3,
            textAlign: "center",
            borderStyle: "dashed",
          }}
        >
          <Typography color="text.secondary">
            No applications yet. Add your first one to start tracking.
          </Typography>
          <NextLinkButton href="/pipeline/new" sx={{ mt: 2 }}>
            Add application
          </NextLinkButton>
        </Paper>
      ) : (
        <TableContainer component={Paper} variant="outlined" sx={{ mt: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Company</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Stage</TableCell>
                <TableCell>Last update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => {
                const currentStage = getCurrentStage(app.stageEvents);
                const lastAt = getLastStageEventAt(app.stageEvents);

                return (
                  <TableRow key={app.id} hover>
                    <TableCell>
                      <NextMuiLink
                        href={`/pipeline/${app.id}`}
                        underline="hover"
                        sx={{ fontWeight: 500 }}
                      >
                        {app.company}
                      </NextMuiLink>
                    </TableCell>
                    <TableCell>{app.role}</TableCell>
                    <TableCell>{app.source ?? "—"}</TableCell>
                    <TableCell>
                      <StageBadge stage={currentStage} />
                    </TableCell>
                    <TableCell>
                      {lastAt ? formatDateTime(lastAt) : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
