"use client";

import NextLink from "next/link";
import MuiLink, { type LinkProps as MuiLinkProps } from "@mui/material/Link";

type NextMuiLinkProps = MuiLinkProps & {
  href: string;
};

export function NextMuiLink({ href, ...props }: NextMuiLinkProps) {
  return <MuiLink component={NextLink} href={href} {...props} />;
}
