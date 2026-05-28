"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import AppBar from "@mui/material/AppBar";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { NextLinkButton } from "@/components/NextLinkButton";
import { NextMuiLink } from "@/components/NextMuiLink";
import { MarketingNavMegaMenu } from "@/components/marketing/MarketingNavMegaMenu";
import {
  marketingNavMenus,
  type NavMenu,
} from "@/lib/marketing/navigation";

const MENU_CLOSE_DELAY_MS = 120;

function LogoLink() {
  return (
    <NextMuiLink
      href="/"
      underline="none"
      aria-label="Job Finder home"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        color: "text.primary",
      }}
    >
      <WorkOutlineOutlinedIcon color="primary" aria-hidden />
      <Typography variant="subtitle1">Job Finder</Typography>
    </NextMuiLink>
  );
}

function DesktopNavTrigger({
  menu,
  active,
  onOpen,
  onClose,
}: {
  menu: NavMenu;
  active: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  return (
    <Box
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      sx={{ position: "relative", py: 1.5, px: 0.5 }}
    >
      <Box
        component="button"
        type="button"
        aria-expanded={active}
        aria-haspopup="true"
        onClick={active ? onClose : onOpen}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          border: 0,
          bgcolor: "transparent",
          cursor: "pointer",
          color: active ? "primary.main" : "text.primary",
          font: "inherit",
          p: 0,
        }}
      >
        <Typography variant="subtitle2">{menu.label}</Typography>
        <ExpandMoreIcon
          sx={{
            fontSize: 18,
            transition: "transform 0.2s ease",
            transform: active ? "rotate(180deg)" : "none",
          }}
          aria-hidden
        />
      </Box>
    </Box>
  );
}

function MobileNavDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: { sx: { width: { xs: "100%", sm: 360 }, px: 2, py: 1 } },
      }}
    >
      <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", py: 1 }}>
        <LogoLink />
        <IconButton aria-label="Close menu" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Stack>

      <Stack spacing={1} sx={{ mt: 2 }}>
        {marketingNavMenus.map((menu) => (
          <Accordion
            key={menu.id}
            disableGutters
            elevation={0}
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2">{menu.label}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <Stack spacing={1.5}>
                {menu.columns.flatMap((column) =>
                  column.sections.flatMap((section) => [
                    <NextMuiLink
                      key={`${section.header.label}-header`}
                      href={section.header.href}
                      underline="hover"
                      variant="subtitle2"
                      onClick={onClose}
                      sx={{ color: "primary.main" }}
                    >
                      {section.header.label}
                    </NextMuiLink>,
                    ...(section.items?.map((item) => (
                      <NextMuiLink
                        key={item.label}
                        href={item.href}
                        underline="hover"
                        variant="body2"
                        onClick={onClose}
                        sx={{ display: "block", pl: 2, color: "text.primary" }}
                      >
                        {item.label}
                      </NextMuiLink>
                    )) ?? []),
                  ]),
                )}
                <NextLinkButton
                  href={menu.banner.ctaHref}
                  variant="contained"
                  size="small"
                  onClick={onClose}
                  sx={{ alignSelf: "flex-start", mt: 1 }}
                >
                  {menu.banner.ctaLabel}
                </NextLinkButton>
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}

        <Stack direction="row" spacing={1} sx={{ pt: 2 }}>
          <NextLinkButton href="/login" variant="outlined" fullWidth onClick={onClose}>
            Sign in
          </NextLinkButton>
          <NextLinkButton href="/signup" variant="contained" fullWidth onClick={onClose}>
            Get started
          </NextLinkButton>
        </Stack>
      </Stack>
    </Drawer>
  );
}

export function MarketingHeader() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const [scrolled, setScrolled] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const activeMenu = marketingNavMenus.find((menu) => menu.id === activeMenuId) ?? null;

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openMenu = useCallback(
    (menuId: string) => {
      clearCloseTimer();
      setActiveMenuId(menuId);
    },
    [clearCloseTimer],
  );

  const scheduleCloseMenu = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setActiveMenuId(null);
    }, MENU_CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    setActiveMenuId(null);
  }, [clearCloseTimer]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      closeMenu();
    }
  }, [isDesktop, closeMenu]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMenu]);

  useEffect(() => {
    return () => clearCloseTimer();
  }, [clearCloseTimer]);

  return (
    <ClickAwayListener onClickAway={closeMenu}>
      <Box ref={headerRef} sx={{ position: "sticky", top: 0, zIndex: (t) => t.zIndex.appBar }}>
        <AppBar
          position="static"
          color="inherit"
          elevation={0}
          sx={{
            bgcolor: "background.paper",
            borderBottom: 1,
            borderColor: scrolled ? "divider" : "transparent",
            boxShadow: scrolled ? 1 : "none",
            transition: "box-shadow 0.2s ease, border-color 0.2s ease",
          }}
        >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 64 }, gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              <LogoLink />
              {!isDesktop ? (
                <IconButton
                  aria-label="Open menu"
                  onClick={() => setMobileOpen(true)}
                  sx={{ ml: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              ) : null}
            </Box>

            {isDesktop ? (
              <Stack
                direction="row"
                spacing={3}
                sx={{ alignItems: "center", flex: 1, ml: 2 }}
              >
                {marketingNavMenus.map((menu) => (
                  <DesktopNavTrigger
                    key={menu.id}
                    menu={menu}
                    active={activeMenuId === menu.id}
                    onOpen={() => openMenu(menu.id)}
                    onClose={scheduleCloseMenu}
                  />
                ))}
              </Stack>
            ) : (
              <Box sx={{ flex: 1 }} />
            )}

            <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexShrink: 0 }}>
              <NextLinkButton
                href="/login"
                size="small"
                variant="text"
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
              >
                Sign in
              </NextLinkButton>
              <NextLinkButton href="/signup" size="small" variant="contained">
                Get started
              </NextLinkButton>
            </Stack>
          </Toolbar>
        </Container>
        </AppBar>

      {isDesktop && activeMenu ? (
        <Box
          onMouseEnter={clearCloseTimer}
          onMouseLeave={scheduleCloseMenu}
          sx={{ position: "absolute", left: 0, right: 0, top: "100%" }}
        >
          <MarketingNavMegaMenu menu={activeMenu} onNavigate={closeMenu} />
        </Box>
      ) : null}

      <MobileNavDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </Box>
    </ClickAwayListener>
  );
}
