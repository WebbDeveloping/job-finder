import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type FeatureBulletListProps = {
  items: string[];
  iconColor?: "primary" | "success";
  textColor?: "text.primary" | "common.white" | "grey.300";
};

export function FeatureBulletList({
  items,
  iconColor = "primary",
  textColor = "text.primary",
}: FeatureBulletListProps) {
  return (
    <Stack component="ul" spacing={1.5} sx={{ m: 0, p: 0, listStyle: "none" }}>
      {items.map((item) => (
        <Stack
          key={item}
          component="li"
          direction="row"
          spacing={1.5}
          sx={{ alignItems: "flex-start" }}
        >
          <CheckCircleIcon
            sx={{
              fontSize: 20,
              mt: 0.25,
              color: iconColor === "primary" ? "primary.main" : "success.main",
              flexShrink: 0,
            }}
            aria-hidden
          />
          <Typography variant="body2" sx={{ color: textColor, lineHeight: 1.6 }}>
            {item}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
