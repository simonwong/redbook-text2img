"use client";

import { presetThemes } from "@/lib/theme";
import type { PresetTheme } from "@/lib/theme/types";
import { cn } from "@/lib/utils";
import { ThemeThumbnail } from "./theme-thumbnail";

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
        aria-pressed={theme.id === currentThemeId}
        className={cn(
          "group relative h-24 overflow-hidden rounded-lg border-2 text-left transition-all",
          theme.id === currentThemeId
            ? "border-primary shadow-sm"
            : "border-transparent hover:border-muted-foreground/30"
        )}
        key={theme.id}
        onClick={() => onSelect(theme.id)}
        style={getThemeBackground(theme)}
        type="button"
      >
        <ThemeThumbnail theme={theme} />
      </button>
    ))}
  </div>
);
