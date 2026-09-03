"use client";

import type { StyleConfiguration } from "@/lib/style-system/style-system";
import { gradientPresets } from "./color-presets";
import { GradientPresetChip } from "./gradient-preset-chip";

type CustomGradient = Extract<
  StyleConfiguration["background"],
  { kind: "custom-gradient" }
>;
type GradientStops = Pick<CustomGradient, "from" | "to">;

interface GradientPresetRowProps {
  direction: CustomGradient["direction"];
  onSelect: (stops: GradientStops) => void;
  value: GradientStops;
}

/** 6 个预设渐变 chip，点选直接写入色标。 */
export const GradientPresetRow = ({
  direction,
  onSelect,
  value,
}: GradientPresetRowProps) => (
  <div className="flex flex-wrap gap-1.5">
    {gradientPresets.map((preset) => (
      <GradientPresetChip
        direction={direction}
        key={`${preset.from}-${preset.to}`}
        onSelect={onSelect}
        selected={preset.from === value.from && preset.to === value.to}
        stops={preset}
      />
    ))}
  </div>
);
