import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { signup } from "@/app/(auth)/actions";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthPageHeader } from "@/components/auth/AuthPageHeader";
import { NextMuiLink } from "@/components/NextMuiLink";

type SignupPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const callbackUrl =
    params.callbackUrl?.startsWith("/") ? params.callbackUrl : "/dashboard";

  return (
    <Paper variant="outlined" sx={{ p: 4 }}>
      <Stack spacing={3}>
        <AuthPageHeader mode="signup" />
        <AuthForm mode="signup" action={signup} callbackUrl={callbackUrl} />
        <Typography variant="body2" color="text.secondary">
          Already have an account?{" "}
          <NextMuiLink
            href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            underline="hover"
          >
            Sign in
          </NextMuiLink>
        </Typography>
      </Stack>
    </Paper>
  );
}
