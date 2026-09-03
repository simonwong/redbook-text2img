"use client";

import { ColorPopover } from "@/components/ui/color-popover";
import type { StyleConfiguration } from "@/lib/style-system/style-system";
import { customGradientValue } from "@/lib/theme";
import { backgroundColorPresets } from "./color-presets";

type CustomGradient = Extract<
  StyleConfiguration["background"],
  { kind: "custom-gradient" }
>;

interface GradientStopRowProps {
  direction: CustomGradient["direction"];
  from: string;
  onChangeFrom: (color: string) => void;
  onChangeTo: (color: string) => void;
  to: string;
}

/** 色标行：[起点色块][渐变预览条][终点色块]，两个色块共用取色弹层。 */
export const GradientStopRow = ({
  direction,
  from,
  onChangeFrom,
  onChangeTo,
  to,
}: GradientStopRowProps) => (
  <div className="ds-input flex h-11 w-full items-center gap-2 px-2 md:h-[34px]">
    <ColorPopover
      label="渐变起点颜色"
      onChange={onChangeFrom}
      presets={backgroundColorPresets}
      swatchClassName="size-6"
      value={from}
    />
    <span
      aria-hidden="true"
      className="ds-hairline h-6 flex-1 rounded-[6px] md:h-[22px]"
      style={{ backgroundImage: customGradientValue(from, to, direction) }}
    />
    <ColorPopover
      label="渐变终点颜色"
      onChange={onChangeTo}
      presets={backgroundColorPresets}
      swatchClassName="size-6"
      value={to}
    />
  </div>
);
