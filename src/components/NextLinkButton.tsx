"use client";

import NextLink from "next/link";
import Button, { type ButtonProps } from "@mui/material/Button";

type NextLinkButtonProps = ButtonProps & {
  href: string;
};

export function NextLinkButton({ href, ...props }: NextLinkButtonProps) {
  return <Button component={NextLink} href={href} {...props} />;
}
