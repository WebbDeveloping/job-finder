import { SectionHeader } from "@/components/ui/SectionHeader";
import type { ComponentProps } from "react";

type MarketingSectionHeaderProps = Omit<
  ComponentProps<typeof SectionHeader>,
  "mode"
>;

export function MarketingSectionHeader(props: MarketingSectionHeaderProps) {
  return <SectionHeader mode="marketing" {...props} />;
}
