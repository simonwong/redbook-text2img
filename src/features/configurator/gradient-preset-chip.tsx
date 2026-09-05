"use client";

import type { StyleConfiguration } from "@/lib/style-system/style-system";
import { customGradientValue } from "@/lib/theme";
import { cn } from "@/lib/utils";

type CustomGradient = Extract<
  StyleConfiguration["background"],
  { kind: "custom-gradient" }
>;
type GradientStops = Pick<CustomGradient, "from" | "to">;

interface GradientPresetChipProps {
  direction: CustomGradient["direction"];
  onSelect: (stops: GradientStops) => void;
  selected: boolean;
  stops: GradientStops;
}

/** 预设渐变 chip（36×22），按当前方向渲染，选中时套 ds-ring 淡彩渐变环。 */
export const GradientPresetChip = ({
  direction,
  onSelect,
  selected,
  stops,
}: GradientPresetChipProps) => {
  const select = () => onSelect(stops);

  return (
    <button
      aria-label={`预设渐变 ${stops.from} 到 ${stops.to}`}
      aria-pressed={selected}
      className={cn(
        "ds-hairline relative h-[22px] w-9 rounded-[8px] transition-transform duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 active:scale-95",
        selected && "ds-ring ds-ring-out"
      )}
      onClick={select}
      style={{
        backgroundImage: customGradientValue(stops.from, stops.to, direction),
      }}
      type="button"
    />
  );
};
