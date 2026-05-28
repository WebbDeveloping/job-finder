"use client";

import Button, { type ButtonProps } from "@mui/material/Button";
import { NextLinkButton } from "@/components/NextLinkButton";

type InvertedButtonProps = ButtonProps & {
  href?: string;
};

export function InvertedButton({ href, sx, ...props }: InvertedButtonProps) {
  const invertedSx = {
    bgcolor: "common.white",
    color: "grey.900",
    "&:hover": { bgcolor: "grey.100" },
    ...sx,
  };

  if (href) {
    return (
      <NextLinkButton href={href} {...props} sx={invertedSx} />
    );
  }

  return <Button {...props} sx={invertedSx} />;
}
