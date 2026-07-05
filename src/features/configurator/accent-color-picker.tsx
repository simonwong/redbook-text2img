"use client";

import { colors } from "@/lib/theme";
import { cn } from "@/lib/utils";

/** 推荐强调色：玫红 / 橙 / 绿 / 蓝 / 紫 / 珊瑚红（4 个复用 tokens.colors.accent） */
const ACCENT_PRESETS = [
  "#e64f7a",
  colors.accent.orange,
  colors.accent.green,
  colors.accent.blue,
  colors.accent.purple,
  "#f43f5e",
];

const RAINBOW =
  "conic-gradient(from 0deg, #ff4d4d, #ffd24d, #4dff88, #4dd2ff, #4d6bff, #c44dff, #ff4d4d)";

interface AccentColorPickerProps {
  /** undefined 表示清除（跟随主题） */
  onChange: (color: string | undefined) => void;
  value: string | undefined;
}

export const AccentColorPicker = ({
  value,
  onChange,
}: AccentColorPickerProps) => {
  const active = value?.toLowerCase();
  return (
    <div className="flex flex-wrap items-center gap-2">
      {ACCENT_PRESETS.map((color) => (
        <button
          aria-label={`强调色 ${color}`}
          aria-pressed={active === color}
          className={cn(
            "h-6 w-6 rounded-full ring-offset-1 ring-offset-background transition-all",
            active === color
              ? "ring-2 ring-foreground"
              : "ring-1 ring-black/10 hover:ring-foreground/40"
          )}
          key={color}
          onClick={() => onChange(color)}
          style={{ backgroundColor: color }}
          type="button"
        />
      ))}

      {/* 自定义颜色（原生 color input，rainbow 圆点触发系统取色器） */}
      <label
        className="relative h-6 w-6 cursor-pointer overflow-hidden rounded-full ring-1 ring-black/10 transition-all hover:ring-foreground/40"
        style={{ background: RAINBOW }}
        title="自定义颜色"
      >
        <input
          aria-label="自定义强调色"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          onChange={(e) => onChange(e.target.value)}
          type="color"
          value={value ?? colors.accent.purple}
        />
      </label>

      {/* 跟随主题（清除强调色）：斜杠圆点，无覆盖时高亮 */}
      <button
        aria-label="跟随主题"
        aria-pressed={!value}
        className={cn(
          "relative h-6 w-6 overflow-hidden rounded-full bg-background transition-all",
          value
            ? "ring-1 ring-border hover:ring-foreground/40"
            : "ring-2 ring-primary"
        )}
        onClick={() => onChange(undefined)}
        title="跟随主题"
        type="button"
      >
        <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 -rotate-45 bg-red-400" />
      </button>
    </div>
  );
};
