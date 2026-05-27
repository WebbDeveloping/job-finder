import Box from "@mui/material/Box";
import { NextLinkButton } from "@/components/NextLinkButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { EmptyState } from "@/components/ui/EmptyState";
import { SankeyFilters } from "@/components/pipeline/SankeyFilters";
import { SankeyPanel } from "@/components/pipeline/SankeyPanel";
import { aggregateSankeyGraph } from "@/lib/sankey/aggregate";
import { requireUserId } from "@/lib/auth";
import {
  fetchStageEventsWithSource,
  getApplicationsByIds,
  listDistinctSources,
  parseSankeyFilters,
} from "@/lib/sankey/queries";

type JobTrackerPageProps = {
  searchParams: Promise<{
    from?: string;
    to?: string;
    source?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function JobTrackerPage({
  searchParams,
}: JobTrackerPageProps) {
  const userId = await requireUserId();
  const params = await searchParams;
  const filters = parseSankeyFilters(params);

  const [events, sources] = await Promise.all([
    fetchStageEventsWithSource(userId),
    listDistinctSources(userId),
  ]);

  const graph = aggregateSankeyGraph(events, filters);

  const allApplicationIds = new Set<string>();
  for (const link of graph.links) {
    for (const id of link.applicationIds) {
      allApplicationIds.add(id);
    }
  }

  const applications = await getApplicationsByIds(userId, [...allApplicationIds]);
  const applicationsById = Object.fromEntries(applications.map((app) => [app.id, app]));

  const hasAnyEvents = events.length > 0;

  return (
    <Box>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Job Tracker
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Sankey flow of stage transitions across your applications.
        </Typography>
      </Box>

      <Box sx={{ mt: 3 }}>
        <SankeyFilters
          sources={sources}
          dateFrom={params.from ?? ""}
          dateTo={params.to ?? ""}
          source={params.source ?? ""}
        />
      </Box>

      {!hasAnyEvents ? (
        <Paper
          variant="outlined"
          sx={{ mt: 6, py: 6, px: 3, borderStyle: "dashed" }}
        >
          <EmptyState
            illustrationSrc="/illustrations/empty-pipeline.svg"
            title="No stage events yet"
            description="Log stage changes on an application to visualize your funnel here."
            action={
              <NextLinkButton href="/applications" variant="contained">
                Add application
              </NextLinkButton>
            }
          />
        </Paper>
      ) : (
        <SankeyPanel graph={graph} applicationsById={applicationsById} />
      )}
    </Box>
  );
}
