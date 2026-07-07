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

      {/* 已选强调色时提供清除入口：文字按钮，语义自明，回到主题默认色 */}
      {value && (
        <button
          className="h-6 rounded-md px-1.5 text-muted-foreground text-xs transition-colors hover:text-foreground"
          onClick={() => onChange(undefined)}
          type="button"
        >
          跟随主题
        </button>
      )}
    </div>
  );
};
