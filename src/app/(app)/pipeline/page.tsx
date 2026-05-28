import Box from "@mui/material/Box";
import { NextLinkButton } from "@/components/NextLinkButton";
import { EmptyStatePanel } from "@/components/ui/EmptyStatePanel";
import { PageHeader } from "@/components/ui/PageHeader";
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
      <PageHeader
        title="Job Tracker"
        subtitle="Sankey flow of stage transitions across your applications."
      />

      <SankeyFilters
        sources={sources}
        dateFrom={params.from ?? ""}
        dateTo={params.to ?? ""}
        source={params.source ?? ""}
      />

      {!hasAnyEvents ? (
        <EmptyStatePanel
          illustrationSrc="/illustrations/empty-pipeline.svg"
          title="No stage events yet"
          description="Log stage changes on an application to visualize your funnel here."
          action={
            <NextLinkButton href="/applications" variant="contained">
              Add application
            </NextLinkButton>
          }
        />
      ) : (
        <SankeyPanel graph={graph} applicationsById={applicationsById} />
      )}
    </Box>
  );
}
