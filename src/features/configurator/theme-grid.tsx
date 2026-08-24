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
  labelledBy: string;
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

export const ThemeGrid = ({
  currentThemeId,
  labelledBy,
  onSelect,
}: ThemeGridProps) => (
  <fieldset
    aria-labelledby={labelledBy}
    className="m-0 grid grid-cols-2 gap-2 border-0 p-0"
  >
    {themePreviews.map(({ styles, theme }) => (
      <label
        className={cn(
          "group relative h-24 cursor-pointer overflow-hidden rounded-lg border-2 text-left transition-all has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
          theme.id === currentThemeId
            ? "border-primary shadow-sm"
            : "border-transparent hover:border-muted-foreground/30"
        )}
        key={theme.id}
        style={getThemeBackground(styles)}
      >
        <input
          checked={theme.id === currentThemeId}
          className="sr-only"
          name="theme"
          onChange={() => onSelect(theme.id)}
          type="radio"
          value={theme.id}
        />
        <ThemeThumbnail styles={styles} theme={theme} />
      </label>
    ))}
  </fieldset>
);
