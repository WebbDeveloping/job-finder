import Typography from "@mui/material/Typography";
import { NextMuiLink } from "@/components/NextMuiLink";

type BackLinkProps = {
  href: string;
  label: string;
};

export function BackLink({ href, label }: BackLinkProps) {
  return (
    <Typography variant="body2" color="text.secondary">
      <NextMuiLink href={href} underline="hover" color="inherit">
        ← {label}
      </NextMuiLink>
    </Typography>
  );
}
