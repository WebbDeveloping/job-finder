import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { IconBadge } from "@/components/ui/IconBadge";

type AuthPageHeaderProps = {
  mode: "login" | "signup";
};

export function AuthPageHeader({ mode }: AuthPageHeaderProps) {
  const isLogin = mode === "login";

  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
      <IconBadge
        icon={isLogin ? <LoginOutlinedIcon /> : <PersonAddOutlinedIcon />}
        size={44}
      />
      <Box>
        <Typography variant="appAuthTitle" component="h1" gutterBottom sx={{ mb: 0.5 }}>
          {isLogin ? "Sign in" : "Create account"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isLogin
            ? "Access your job pipeline and resume."
            : "Start tracking applications and building your resume."}
        </Typography>
      </Box>
    </Stack>
  );
}
