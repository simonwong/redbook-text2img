"use client";

import {
  type RenderStyle,
  styleSystem,
  type ThemeCatalogItem,
} from "@/lib/style-system/style-system";
import { cn } from "@/lib/utils";
import { ThemeThumbnail } from "./theme-thumbnail";

interface ThemeGridProps {
  currentThemeId: string;
  onSelect: (themeId: string) => void;
}

interface ThemePreview {
  styles: RenderStyle;
  theme: ThemeCatalogItem;
}

const themePreviews: readonly ThemePreview[] = styleSystem
  .catalog()
  .map((theme) => ({
    styles: styleSystem.resolve(
      styleSystem.hydrate({ currentThemeId: theme.id }),
      { page: "body" }
    ).styles,
    theme,
  }));

function getThemeBackground(styles: RenderStyle): React.CSSProperties {
  return {
    backgroundColor: styles.container.backgroundColor,
    backgroundImage: styles.container.backgroundImage,
    backgroundSize: styles.container.backgroundSize,
  };
}

export const ThemeGrid = ({ currentThemeId, onSelect }: ThemeGridProps) => (
  <div className="grid grid-cols-2 gap-2">
    {themePreviews.map(({ styles, theme }) => (
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
        style={getThemeBackground(styles)}
        type="button"
      >
        <ThemeThumbnail styles={styles} theme={theme} />
      </button>
    ))}
  </div>
);
