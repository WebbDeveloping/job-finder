import type { Metadata } from "next";
import Box from "@mui/material/Box";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";

export const metadata: Metadata = {
  title: "Job Finder — Track applications & build your resume",
  description:
    "A free job search workspace: pipeline tracking, Sankey analytics, and resume PDF export.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <MarketingHeader />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <MarketingFooter />
    </Box>
  );
}
