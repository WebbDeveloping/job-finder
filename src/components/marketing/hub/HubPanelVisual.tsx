"use client";

import type { ReactElement } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  HubBackResume,
  HubFloatingCard,
  HubPanelFrame,
} from "@/components/marketing/hub/HubPanelFrame";

type HubPanelVisualProps = {
  panelId: string;
  imageAlt: string;
};

function EditorFieldsCard() {
  const sections = ["Summary", "Experience", "Skills"];

  return (
    <HubFloatingCard sx={{ left: { xs: "2%", sm: "4%" }, top: { xs: "14%", sm: "18%" }, width: { xs: "38%", sm: "34%" }, maxWidth: 170, p: 1.25 }}>
      <Typography variant="caption" sx={{ display: "block", mb: 1, fontWeight: 600 }}>
        Editor
      </Typography>
      {sections.map((section, index) => (
        <Box
          key={section}
          sx={{
            mb: index < sections.length - 1 ? 0.75 : 0,
            p: 0.75,
            borderRadius: 1,
            bgcolor: "grey.50",
            border: 1,
            borderColor: index === 1 ? "primary.light" : "divider",
          }}
        >
          <Typography variant="caption" sx={{ fontSize: "0.65rem", fontWeight: 600 }}>
            {section}
          </Typography>
          <Box sx={{ mt: 0.5, height: 4, borderRadius: 1, bgcolor: "grey.200", width: "80%" }} />
          <Box sx={{ mt: 0.25, height: 4, borderRadius: 1, bgcolor: "grey.100", width: "60%" }} />
        </Box>
      ))}
    </HubFloatingCard>
  );
}

function HubResumeBuilderVisual({ imageAlt }: { imageAlt: string }) {
  return (
    <HubPanelFrame
      imageAlt={imageAlt}
      primaryIndex={0}
      overlaySrc="/illustrations/hub-resume-builder-overlay.svg"
      primaryWidth={{ xs: "40%", sm: "38%" }}
    >
      <EditorFieldsCard />
    </HubPanelFrame>
  );
}

function HubTemplatesVisual({ imageAlt }: { imageAlt: string }) {
  return (
    <HubPanelFrame
      imageAlt={imageAlt}
      primaryIndex={3}
      overlaySrc="/illustrations/hub-templates-overlay.svg"
      primaryWidth={{ xs: "38%", sm: "36%" }}
    >
      <HubBackResume
        exampleIndex={0}
        sx={{
          width: "28%",
          aspectRatio: "549 / 778",
          left: "5%",
          top: "12%",
          transform: "rotate(-7deg)",
        }}
      />
      <HubBackResume
        exampleIndex={1}
        sx={{
          width: "26%",
          aspectRatio: "549 / 778",
          right: "4%",
          top: "10%",
          transform: "rotate(6deg)",
        }}
      />
      <HubBackResume
        exampleIndex={5}
        sx={{
          width: "24%",
          aspectRatio: "549 / 778",
          left: "12%",
          bottom: "10%",
          transform: "rotate(-3deg)",
          display: { xs: "none", sm: "block" },
        }}
      />
    </HubPanelFrame>
  );
}

function HubPdfExportVisual({ imageAlt }: { imageAlt: string }) {
  return (
    <HubPanelFrame
      imageAlt={imageAlt}
      primaryIndex={2}
      overlaySrc="/illustrations/hub-pdf-overlay.svg"
      borderColor="error.light"
    >
      <HubFloatingCard
        sx={{
          right: { xs: "4%", sm: "8%" },
          bottom: { xs: "18%", sm: "22%" },
          px: 1.5,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 44,
            borderRadius: 1,
            bgcolor: "error.main",
            color: "common.white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.65rem",
            fontWeight: 700,
          }}
        >
          PDF
        </Box>
        <Typography variant="caption" sx={{ fontWeight: 600, maxWidth: 72 }}>
          Ready to send
        </Typography>
      </HubFloatingCard>
    </HubPanelFrame>
  );
}

function ApplicationNotesCard() {
  return (
    <HubFloatingCard sx={{ right: { xs: "2%", sm: "6%" }, top: { xs: "14%", sm: "18%" }, width: { xs: "42%", sm: "38%" }, maxWidth: 188, p: 1.25 }}>
      <Typography variant="caption" sx={{ display: "block", mb: 0.75, fontWeight: 600 }}>
        Senior Product Designer
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1, fontSize: "0.65rem" }}>
        Acme Corp · Interview
      </Typography>
      {["Recruiter: Jordan M.", "Follow-up: Tuesday", "Talking points: team scale"].map((line) => (
        <Box
          key={line}
          sx={{
            mb: 0.5,
            py: 0.5,
            px: 0.75,
            borderRadius: 0.75,
            bgcolor: "grey.50",
            border: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="caption" sx={{ fontSize: "0.6rem", lineHeight: 1.4 }}>
            {line}
          </Typography>
        </Box>
      ))}
    </HubFloatingCard>
  );
}

function HubNotesVisual({ imageAlt }: { imageAlt: string }) {
  return (
    <HubPanelFrame
      imageAlt={imageAlt}
      primaryIndex={3}
      overlaySrc="/illustrations/hub-notes-overlay.svg"
      primaryWidth={{ xs: "36%", sm: "34%" }}
    >
      <ApplicationNotesCard />
      <HubFloatingCard
        sx={{
          left: { xs: "4%", sm: "8%" },
          bottom: { xs: "14%", sm: "18%" },
          px: 1.25,
          py: 0.75,
          borderRadius: 999,
          borderColor: "warning.light",
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 600, color: "warning.dark" }}>
          Stage history
        </Typography>
      </HubFloatingCard>
    </HubPanelFrame>
  );
}

function PipelineBoardCard() {
  const stages = [
    { name: "Wishlist", cards: 1 },
    { name: "Applied", cards: 2 },
    { name: "Interview", cards: 1 },
    { name: "Offer", cards: 1 },
  ];

  return (
    <HubFloatingCard
      sx={{
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: "92%", sm: "88%" },
        maxWidth: 460,
        p: { xs: 1, sm: 1.5 },
        zIndex: 2,
      }}
    >
      <Typography variant="caption" sx={{ display: "block", mb: 1, fontWeight: 600 }}>
        Your pipeline
      </Typography>
      <Box sx={{ display: "flex", gap: 0.75 }}>
        {stages.map((stage) => (
          <Box key={stage.name} sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" sx={{ fontSize: "0.55rem", display: "block", mb: 0.5, fontWeight: 600 }}>
              {stage.name}
            </Typography>
            <Box
              sx={{
                p: 0.5,
                borderRadius: 1,
                bgcolor: "grey.50",
                border: 1,
                borderColor: "divider",
                minHeight: 72,
              }}
            >
              {Array.from({ length: stage.cards }).map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    height: 18,
                    mb: 0.5,
                    borderRadius: 0.5,
                    bgcolor: "primary.main",
                    opacity: stage.name === "Interview" ? 0.25 : 0.14,
                  }}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </HubFloatingCard>
  );
}

function HubJobTrackerVisual({ imageAlt }: { imageAlt: string }) {
  return (
    <HubPanelFrame
      imageAlt={imageAlt}
      primaryIndex={4}
      overlaySrc="/illustrations/hub-tracker-overlay.svg"
      showPrimary={false}
    >
      <PipelineBoardCard />
    </HubPanelFrame>
  );
}

function SankeyFlowCard() {
  const flows = [
    { from: "Applied", width: "100%", opacity: 0.35 },
    { from: "Interview", width: "62%", opacity: 0.55 },
    { from: "Offer", width: "28%", opacity: 0.85 },
  ];

  return (
    <HubFloatingCard
      sx={{
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: "90%", sm: "86%" },
        maxWidth: 440,
        p: { xs: 1.25, sm: 1.75 },
        zIndex: 2,
      }}
    >
      <Typography variant="caption" sx={{ display: "block", mb: 1.25, fontWeight: 600 }}>
        Application flow
      </Typography>
      {flows.map((flow) => (
        <Box key={flow.from} sx={{ mb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.35 }}>
            <Typography variant="caption" sx={{ fontSize: "0.65rem", fontWeight: 600 }}>
              {flow.from}
            </Typography>
          </Box>
          <Box
            sx={{
              height: 12,
              width: flow.width,
              borderRadius: 1,
              bgcolor: "primary.main",
              opacity: flow.opacity,
            }}
          />
        </Box>
      ))}
      <Box sx={{ display: "flex", gap: 2, mt: 1.5, pt: 1, borderTop: 1, borderColor: "divider" }}>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.6rem" }}>
            Applied → Interview
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "warning.main" }}>
            42%
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.6rem" }}>
            Interview → Offer
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "success.main" }}>
            18%
          </Typography>
        </Box>
      </Box>
    </HubFloatingCard>
  );
}

function HubAnalyticsVisual({ imageAlt }: { imageAlt: string }) {
  return (
    <HubPanelFrame
      imageAlt={imageAlt}
      primaryIndex={5}
      overlaySrc="/illustrations/hub-analytics-overlay.svg"
      showPrimary={false}
    >
      <SankeyFlowCard />
    </HubPanelFrame>
  );
}

function MiniPipelineCard() {
  const stages = ["Wishlist", "Applied", "Interview"];

  return (
    <HubFloatingCard sx={{ left: { xs: "2%", sm: "4%" }, top: { xs: "18%", sm: "22%" }, width: { xs: "36%", sm: "32%" }, maxWidth: 160, p: 1 }}>
      <Typography variant="caption" sx={{ display: "block", mb: 0.75, fontWeight: 600 }}>
        Pipeline
      </Typography>
      <Box sx={{ display: "flex", gap: 0.5 }}>
        {stages.map((stage) => (
          <Box key={stage} sx={{ flex: 1, minWidth: 0, p: 0.5, borderRadius: 0.75, bgcolor: "grey.50", border: 1, borderColor: "divider" }}>
            <Typography variant="caption" sx={{ fontSize: "0.6rem", display: "block", mb: 0.5 }}>
              {stage}
            </Typography>
            <Box sx={{ height: 14, borderRadius: 0.5, bgcolor: "primary.main", opacity: stage === "Applied" ? 0.2 : 0.12 }} />
          </Box>
        ))}
      </Box>
    </HubFloatingCard>
  );
}

function MiniDashboardCard() {
  return (
    <HubFloatingCard sx={{ right: { xs: "2%", sm: "5%" }, top: { xs: "12%", sm: "16%" }, width: { xs: "34%", sm: "30%" }, maxWidth: 148, p: 1.25 }}>
      <Typography variant="caption" sx={{ display: "block", mb: 1, fontWeight: 600 }}>
        Dashboard
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0.75 }}>
        {[
          { label: "Active", value: "12" },
          { label: "Interviews", value: "3" },
        ].map((stat) => (
          <Box key={stat.label} sx={{ p: 0.75, borderRadius: 1, bgcolor: "grey.50", border: 1, borderColor: "divider" }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.6rem" }}>
              {stat.label}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "primary.main", lineHeight: 1.2 }}>
              {stat.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </HubFloatingCard>
  );
}

function MiniAnalyticsCard() {
  const bars = [48, 72, 40, 88, 56];

  return (
    <HubFloatingCard sx={{ right: { xs: "4%", sm: "8%" }, bottom: { xs: "10%", sm: "14%" }, width: { xs: "38%", sm: "34%" }, maxWidth: 168, p: 1.25 }}>
      <Typography variant="caption" sx={{ display: "block", mb: 1, fontWeight: 600 }}>
        Analytics
      </Typography>
      <Box aria-hidden sx={{ display: "flex", alignItems: "flex-end", gap: 0.5, height: 48 }}>
        {bars.map((height, index) => (
          <Box
            key={index}
            sx={{
              flex: 1,
              height: `${height}%`,
              borderRadius: 0.5,
              bgcolor: index === 3 ? "primary.main" : "primary.light",
              opacity: index === 3 ? 0.85 : 0.35,
            }}
          />
        ))}
      </Box>
    </HubFloatingCard>
  );
}

function HubWorkspaceVisual({ imageAlt }: { imageAlt: string }) {
  return (
    <HubPanelFrame imageAlt={imageAlt} primaryIndex={6} overlaySrc="/illustrations/hub-workspace-overlay.svg">
      <MiniPipelineCard />
      <MiniDashboardCard />
      <MiniAnalyticsCard />
      <HubFloatingCard
        sx={{
          left: { xs: "6%", sm: "10%" },
          bottom: { xs: "12%", sm: "16%" },
          px: 1.25,
          py: 0.75,
          borderRadius: 999,
          borderColor: "success.light",
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          gap: 0.75,
        }}
      >
        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "success.main" }} />
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          Notes per role
        </Typography>
      </HubFloatingCard>
    </HubPanelFrame>
  );
}

const panelVisuals: Record<string, (props: { imageAlt: string }) => ReactElement> = {
  "resume-builder": HubResumeBuilderVisual,
  templates: HubTemplatesVisual,
  "pdf-export": HubPdfExportVisual,
  notes: HubNotesVisual,
  "job-tracker": HubJobTrackerVisual,
  analytics: HubAnalyticsVisual,
  workspace: HubWorkspaceVisual,
};

export function HubPanelVisual({ panelId, imageAlt }: HubPanelVisualProps) {
  const Visual = panelVisuals[panelId];

  if (!Visual) {
    return null;
  }

  return <Visual imageAlt={imageAlt} />;
}
