"use client";

import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

type StarRatingProps = {
  rating: number;
  size?: "small" | "medium";
  color?: "inherit" | "primary" | "white";
  sx?: SxProps<Theme>;
};

const iconSizes = { small: 18, medium: 22 };

export function StarRating({
  rating,
  size = "small",
  color = "primary",
  sx,
}: StarRatingProps) {
  const iconSize = iconSizes[size];
  const starColor =
    color === "white"
      ? "common.white"
      : color === "primary"
        ? "primary.main"
        : "inherit";

  return (
    <Box sx={{ display: "flex", gap: 0.25, ...sx }} aria-hidden>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        let Icon = StarOutlineOutlinedIcon;

        if (rating >= starValue) {
          Icon = StarIcon;
        } else if (rating >= starValue - 0.5) {
          Icon = StarHalfIcon;
        }

        return (
          <Icon
            key={starValue}
            sx={{ fontSize: iconSize, color: starColor }}
          />
        );
      })}
    </Box>
  );
}
