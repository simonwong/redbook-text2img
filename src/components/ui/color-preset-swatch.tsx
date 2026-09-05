"use client";

import { cn } from "@/lib/utils";
import { swatchSkin } from "./swatch-skin";

interface ColorPresetSwatchProps {
  /** 6 位十六进制颜色 */
  color: string;
  onSelect: (color: string) => void;
  selected: boolean;
}

/**
 * 取色弹层色板里的 22px 圆形预设色，选中时套 ds-ring 淡彩渐变环。
 * 触控端按钮外框放大到 44px 并用负外边距保持排布不变，圆点只是内层视觉。
 */
export const ColorPresetSwatch = ({
  color,
  onSelect,
  selected,
}: ColorPresetSwatchProps) => {
  const select = () => onSelect(color);

  return (
    <button
      aria-label={color}
      aria-pressed={selected}
      className="-m-[11px] flex size-11 items-center justify-center justify-self-center rounded-full transition-transform duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 active:scale-90 md:m-0 md:size-[22px]"
      onClick={select}
      title={color}
      type="button"
    >
      <span
        aria-hidden="true"
        className={cn(
          swatchSkin,
          "block size-[22px]",
          selected && "ds-ring ds-ring-out"
        )}
        style={{ backgroundColor: color }}
      />
    </button>
  );
};
