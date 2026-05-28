import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { NextLinkButton } from "@/components/NextLinkButton";
import { NextMuiLink } from "@/components/NextMuiLink";
import { OnboardingBanner } from "@/components/app/OnboardingBanner";
import { AppCard } from "@/components/ui/AppCard";
import { EmptyStatePanel } from "@/components/ui/EmptyStatePanel";
import { PageHeader } from "@/components/ui/PageHeader";
import { StageBadge } from "@/components/pipeline/StageBadge";
import {
  getCurrentStage,
  getLastStageEventAt,
  listApplications,
} from "@/lib/application";
import { requireUserId } from "@/lib/auth";
import { formatDateTime } from "@/lib/datetime";
import { listResumes } from "@/lib/resume";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const userId = await requireUserId();
  const [applications, resumes] = await Promise.all([
    listApplications(userId),
    listResumes(userId),
  ]);
  const hasResume = resumes.length > 0;

  return (
    <Box>
      <OnboardingBanner
        hasApplications={applications.length > 0}
        hasResume={hasResume}
      />
      <PageHeader
        title="Applications"
        subtitle="Track job applications and stage changes."
        actions={
          <NextLinkButton href="/applications/new" variant="contained">
            Add application
          </NextLinkButton>
        }
      />

      {applications.length === 0 ? (
        <EmptyStatePanel
          illustrationSrc="/illustrations/empty-pipeline.svg"
          title="No applications yet"
          description="Add your first role to start tracking stages and viewing your job tracker."
          action={
            <NextLinkButton href="/applications/new" variant="contained">
              Add application
            </NextLinkButton>
          }
        />
      ) : (
        <AppCard padding="none" sx={{ mt: 4 }}>
          <TableContainer>
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
                          href={`/applications/${app.id}`}
                          underline="hover"
                        >
                          {app.company}
                        </NextMuiLink>
                        {app.resume && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            component="div"
                            sx={{ mt: 0.25 }}
                          >
                            {app.resume.label}
                          </Typography>
                        )}
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
        </AppCard>
      )}
    </Box>
  );
}
