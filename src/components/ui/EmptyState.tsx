import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import type { ReactNode } from "react";

type EmptyStateProps = {
  illustrationSrc: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({
  illustrationSrc,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Stack spacing={2} sx={{ alignItems: "center", textAlign: "center" }}>
      <Box sx={{ position: "relative", width: 200, height: 160 }}>
        <Image
          src={illustrationSrc}
          alt=""
          fill
          sizes="200px"
          style={{ objectFit: "contain" }}
        />
      </Box>
      <Typography variant="subtitle1" component="h2">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
        {description}
      </Typography>
      {action ? <Box sx={{ pt: 1 }}>{action}</Box> : null}
    </Stack>
  );
}
