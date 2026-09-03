"use client";

import { cn } from "@/lib/utils";
import { swatchSkin } from "./swatch-skin";

interface ColorPresetSwatchProps {
  /** 6 位十六进制颜色 */
  color: string;
  onSelect: (color: string) => void;
  selected: boolean;
}

/** 取色弹层色板里的 22px 圆形预设色，选中时套 ds-ring 淡彩渐变环。 */
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
      className={cn(
        swatchSkin,
        "size-[22px] justify-self-center active:scale-90",
        selected && "ds-ring ds-ring-out"
      )}
      onClick={select}
      style={{ backgroundColor: color }}
      title={color}
      type="button"
    />
  );
};
