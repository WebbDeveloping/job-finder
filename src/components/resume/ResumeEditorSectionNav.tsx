"use client";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

export type ResumeEditorSection = {
  id: string;
  label: string;
  content: ReactNode;
};

type ResumeEditorSectionNavProps = {
  sections: ResumeEditorSection[];
  expanded: string | false;
  onExpandedChange: (sectionId: string | false) => void;
  disabled?: boolean;
  footer?: ReactNode;
  alerts?: ReactNode;
};

export function ResumeEditorSectionNav({
  sections,
  expanded,
  onExpandedChange,
  disabled = false,
  footer,
  alerts,
}: ResumeEditorSectionNavProps) {
  return (
    <Stack spacing={0}>
      {sections.map((section) => {
        const isExpanded = expanded === section.id;

        return (
          <Accordion
            key={section.id}
            expanded={isExpanded}
            disabled={disabled}
            onChange={(_, nextExpanded) => {
              onExpandedChange(nextExpanded ? section.id : false);
            }}
            disableGutters
            elevation={0}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "&:before": { display: "none" },
              bgcolor: "background.paper",
            }}
            slotProps={{
              transition: { unmountOnExit: false },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${section.id}-content`}
              id={`${section.id}-header`}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {section.label}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, pb: 2 }}>
              {section.content}
            </AccordionDetails>
          </Accordion>
        );
      })}

      {alerts}

      {footer}
    </Stack>
  );
}
