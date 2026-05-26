import Box from "@mui/material/Box";
import { NextLinkButton } from "@/components/NextLinkButton";
import { NextMuiLink } from "@/components/NextMuiLink";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { SankeyFilters } from "@/components/pipeline/SankeyFilters";
import { SankeyPanel } from "@/components/pipeline/SankeyPanel";
import { aggregateSankeyGraph } from "@/lib/sankey/aggregate";
import {
  fetchStageEventsWithSource,
  getApplicationsByIds,
  listDistinctSources,
  parseSankeyFilters,
} from "@/lib/sankey/queries";

type AnalyticsPageProps = {
  searchParams: Promise<{
    from?: string;
    to?: string;
    source?: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function PipelineAnalyticsPage({
  searchParams,
}: AnalyticsPageProps) {
  const params = await searchParams;
  const filters = parseSankeyFilters(params);

  const [events, sources] = await Promise.all([
    fetchStageEventsWithSource(),
    listDistinctSources(),
  ]);

  const graph = aggregateSankeyGraph(events, filters);

  const allApplicationIds = new Set<string>();
  for (const link of graph.links) {
    for (const id of link.applicationIds) {
      allApplicationIds.add(id);
    }
  }

  const applications = await getApplicationsByIds([...allApplicationIds]);
  const applicationsById = Object.fromEntries(
    applications.map((app) => [app.id, app]),
  );

  const hasAnyEvents = events.length > 0;

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: { sm: "flex-start" },
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Pipeline analytics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sankey flow of stage transitions across your applications.
          </Typography>
        </Box>
        <NextMuiLink href="/pipeline" underline="hover" variant="body2">
          Back to list
        </NextMuiLink>
      </Stack>

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
          sx={{
            mt: 6,
            py: 6,
            px: 3,
            textAlign: "center",
            borderStyle: "dashed",
          }}
        >
          <Typography color="text.secondary">
            No stage events yet. Log changes on an application to see flow here.
          </Typography>
          <NextLinkButton href="/pipeline" sx={{ mt: 2 }}>
            Go to pipeline
          </NextLinkButton>
        </Paper>
      ) : (
        <SankeyPanel graph={graph} applicationsById={applicationsById} />
      )}
    </Box>
  );
}
