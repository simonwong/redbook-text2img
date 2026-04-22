"use client";

import { presetThemes } from "@/lib/theme";
import type { PresetTheme } from "@/lib/theme/types";
import { cn } from "@/lib/utils";

interface ThemeGridProps {
  currentThemeId: string;
  onSelect: (themeId: string) => void;
}

function getThemeBackground(theme: PresetTheme): React.CSSProperties {
  const bg = theme.style.background;
  if (bg.type === "gradient") {
    return { background: bg.value };
  }
  if (bg.type === "image") {
    return { backgroundImage: `url(${bg.value})`, backgroundSize: "cover" };
  }
  return { backgroundColor: bg.value };
}

export const ThemeGrid = ({ currentThemeId, onSelect }: ThemeGridProps) => (
  <div className="grid grid-cols-2 gap-2">
    {presetThemes.map((theme) => (
      <button
        className={cn(
          "group relative flex h-20 flex-col items-center justify-end overflow-hidden rounded-lg border-2 p-2 transition-all",
          theme.id === currentThemeId
            ? "border-primary shadow-sm"
            : "border-transparent hover:border-muted-foreground/30"
        )}
        key={theme.id}
        onClick={() => onSelect(theme.id)}
        style={getThemeBackground(theme)}
        type="button"
      >
        <span
          className="rounded-sm px-1.5 py-0.5 font-medium text-[10px] leading-tight backdrop-blur-sm"
          style={{
            color: theme.style.heading.color,
            backgroundColor: "rgba(255,255,255,0.3)",
          }}
        >
          {theme.name}
        </span>
      </button>
    ))}
  </div>
);
