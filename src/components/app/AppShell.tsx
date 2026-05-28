import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { signOutAction } from "@/app/(auth)/actions";
import { AppShellMobileNav } from "@/components/app/AppShellMobileNav";
import { AppShellNav } from "@/components/app/AppShellNav";
import { requireUser } from "@/lib/auth";
import { appTokens } from "@/theme/tokens";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await requireUser();
  const displayName = session.user.name ?? session.user.email ?? "Account";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.50" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: appTokens.drawerWidth,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: appTokens.drawerWidth,
            boxSizing: "border-box",
            borderRight: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          },
        }}
      >
        <AppShellNav />
      </Drawer>

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Box
          component="header"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: appTokens.mainPadding,
            py: 1.5,
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography
            variant="appFormGroupTitle"
            color="text.secondary"
            sx={{ display: { xs: "block", md: "none" } }}
          >
            Job Finder
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "block" } }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" color="text.secondary" noWrap>
              {displayName}
            </Typography>
            <form action={signOutAction}>
              <Button type="submit" size="small" variant="outlined">
                Sign out
              </Button>
            </form>
          </Box>
        </Box>
        <AppShellMobileNav />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: appTokens.mainPadding,
            maxWidth: "100%",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
