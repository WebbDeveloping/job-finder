"use client";

import type { ReactElement } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import ViewColumnOutlinedIcon from "@mui/icons-material/ViewColumnOutlined";
import ViewQuiltOutlinedIcon from "@mui/icons-material/ViewQuiltOutlined";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { SvgIconProps } from "@mui/material/SvgIcon";
import Image from "next/image";
import { NextLinkButton } from "@/components/NextLinkButton";
import { NextMuiLink } from "@/components/NextMuiLink";
import type {
  NavColumn,
  NavIconName,
  NavItemLink,
  NavMenu,
  NavSectionHeader,
} from "@/lib/marketing/navigation";
import { surfaceTints } from "@/theme/tokens";

const navIcons: Record<NavIconName, ReactElement<SvgIconProps>> = {
  builder: <AutoAwesomeOutlinedIcon />,
  chart: <FactCheckOutlinedIcon />,
  folder: <FolderOpenOutlinedIcon />,
  layout: <ViewQuiltOutlinedIcon />,
  zap: <AutoAwesomeOutlinedIcon />,
  book: <MenuBookOutlinedIcon />,
  bookmark: <BookmarkBorderOutlinedIcon />,
  help: <HelpOutlineOutlinedIcon />,
  trending: <TrendingUpOutlinedIcon />,
  timeline: <TimelineOutlinedIcon />,
  analytics: <DescriptionOutlinedIcon />,
  dashboard: <DashboardOutlinedIcon />,
  camera: <CameraAltOutlinedIcon />,
  pen: <DescriptionOutlinedIcon />,
  box: <ViewQuiltOutlinedIcon />,
  columns: <ViewColumnOutlinedIcon />,
  pdf: <PictureAsPdfOutlinedIcon />,
  notes: <NotesOutlinedIcon />,
};

function NavIconBadge({ icon }: { icon: NavIconName }) {
  return (
    <Box
      sx={{
        width: 32,
        height: 32,
        borderRadius: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        bgcolor: "primary.main",
        color: "primary.contrastText",
        "& .MuiSvgIcon-root": { fontSize: 18 },
      }}
    >
      {navIcons[icon]}
    </Box>
  );
}

function MegaMenuHeaderLink({ header }: { header: NavSectionHeader }) {
  return (
    <NextMuiLink
      href={header.href}
      underline="none"
      sx={{
        display: "block",
        color: "text.primary",
        py: 1.5,
        "&:hover .mega-menu-header-label": {
          color: "primary.main",
        },
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <NavIconBadge icon={header.icon} />
        <Typography
          className="mega-menu-header-label"
          variant="subtitle2"
          sx={{ color: "primary.main", flex: 1 }}
        >
          {header.label}
        </Typography>
        <ChevronRightIcon sx={{ fontSize: 18, color: "primary.main" }} aria-hidden />
      </Stack>
      {header.description ? (
        <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mt: 0.75, pl: 5 }}>
          {header.description}
        </Typography>
      ) : null}
    </NextMuiLink>
  );
}

function MegaMenuItemLink({ item }: { item: NavItemLink }) {
  return (
    <NextMuiLink
      href={item.href}
      underline="none"
      sx={{
        display: "block",
        py: 0.75,
        color: "text.primary",
        "&:hover .mega-menu-item-label": {
          color: "primary.main",
        },
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
        <Box
          sx={{
            width: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            pt: 0.25,
          }}
        >
          <FiberManualRecordIcon sx={{ fontSize: 8, color: "text.secondary" }} aria-hidden />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography className="mega-menu-item-label" variant="body2">
            {item.label}
          </Typography>
          {item.description ? (
            <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mt: 0.25, lineHeight: 1.45 }}>
              {item.description}
            </Typography>
          ) : null}
        </Box>
      </Stack>
    </NextMuiLink>
  );
}

function MegaMenuColumn({ column }: { column: NavColumn }) {
  return (
    <Stack spacing={0.5}>
      {column.sections.map((section) => (
        <Box key={section.header.label}>
          <MegaMenuHeaderLink header={section.header} />
          {section.items?.map((item) => (
            <MegaMenuItemLink key={item.label} item={item} />
          ))}
        </Box>
      ))}
    </Stack>
  );
}

function MegaMenuBanner({ menu }: { menu: NavMenu }) {
  const { banner } = menu;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        minHeight: 280,
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: surfaceTints.primarySubtle,
        backgroundImage: surfaceTints.featureRadialPrimary(20),
        p: 3,
      }}
    >
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {banner.title}
        </Typography>
        <NextLinkButton
          href={banner.ctaHref}
          variant="contained"
          size="small"
          endIcon={<ArrowForwardIcon />}
        >
          {banner.ctaLabel}
        </NextLinkButton>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Image
          src={banner.imageSrc}
          alt={banner.imageAlt}
          width={banner.imageWidth}
          height={banner.imageHeight}
          style={{ width: "auto", height: "auto", maxWidth: "100%" }}
        />
      </Box>
    </Box>
  );
}

type MarketingNavMegaMenuProps = {
  menu: NavMenu;
  onNavigate: () => void;
};

export function MarketingNavMegaMenu({ menu, onNavigate }: MarketingNavMegaMenuProps) {
  return (
    <Box
      onClick={onNavigate}
      sx={{
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: (theme) => theme.shadows[4],
      }}
    >
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Grid container spacing={3}>
              {menu.columns.map((column, index) => (
                <Grid key={`${menu.id}-col-${index}`} size={{ xs: 12, sm: 4 }}>
                  <MegaMenuColumn column={column} />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <MegaMenuBanner menu={menu} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
