import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { login } from "@/app/(auth)/actions";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthPageHeader } from "@/components/auth/AuthPageHeader";
import { NextMuiLink } from "@/components/NextMuiLink";

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl =
    params.callbackUrl?.startsWith("/") ? params.callbackUrl : "/dashboard";

  return (
    <Paper variant="outlined" sx={{ p: 4 }}>
      <Stack spacing={3}>
        <AuthPageHeader mode="login" />
        <AuthForm mode="login" action={login} callbackUrl={callbackUrl} />
        <Typography variant="body2" color="text.secondary">
          No account?{" "}
          <NextMuiLink
            href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            underline="hover"
          >
            Sign up
          </NextMuiLink>
        </Typography>
      </Stack>
    </Paper>
  );
}
