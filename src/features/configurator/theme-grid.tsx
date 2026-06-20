"use client";

import { Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRef, useState } from "react";
import { Tooltip } from "@/components/tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CUSTOM_THEME_MAX_COUNT } from "@/lib/theme/custom-theme-image";
import { getResolvedThemeById, presetThemes } from "@/lib/theme/themes";
import type { CustomThemeRecord, PresetTheme } from "@/lib/theme/types";
import { cn } from "@/lib/utils";

interface ThemeGridProps {
  currentThemeId: string;
  customThemes: CustomThemeRecord[];
  onClearError: () => void;
  onDeleteCustomTheme: (themeId: string) => void;
  onSelect: (themeId: string) => void;
  onStartUpload: (file: File) => Promise<void>;
  themeError: string | null;
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

export const ThemeGrid = ({
  currentThemeId,
  customThemes,
  themeError,
  onClearError,
  onDeleteCustomTheme,
  onSelect,
  onStartUpload,
}: ThemeGridProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setIsUploading(true);
    try {
      await onStartUpload(file);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={handleFileChange}
        ref={fileInputRef}
        type="file"
      />

      {themeError ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-3 text-destructive text-sm">
          <div className="flex items-start justify-between gap-3">
            <p className="leading-5">{themeError}</p>
            <button
              className="text-xs opacity-70 transition-opacity hover:opacity-100"
              onClick={onClearError}
              type="button"
            >
              关闭
            </button>
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-xs">我的主题</span>
          <Badge variant="outline">
            {customThemes.length}/{CUSTOM_THEME_MAX_COUNT}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            className="flex h-20 flex-col items-center justify-center rounded-2xl border border-border border-dashed bg-muted/35 px-2 text-center transition-colors hover:bg-muted/60"
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <span className="font-medium text-xs">
              {isUploading ? "处理中..." : "上传图片"}
            </span>
            <span className="mt-1 text-[10px] text-muted-foreground">
              生成自定义背景主题
            </span>
          </button>

          {customThemes.map((customTheme) => {
            const resolvedTheme = getResolvedThemeById(
              customTheme.id,
              customThemes
            );
            if (!resolvedTheme) {
              return null;
            }

            return (
              <div className="relative" key={customTheme.id}>
                <button
                  className={cn(
                    "group relative flex h-20 w-full flex-col items-start justify-end overflow-hidden rounded-2xl border-2 p-2 text-left transition-all",
                    customTheme.id === currentThemeId
                      ? "border-primary shadow-sm"
                      : "border-transparent hover:border-muted-foreground/30"
                  )}
                  onClick={() => onSelect(customTheme.id)}
                  style={getThemeBackground(resolvedTheme)}
                  type="button"
                >
                  <span className="w-full rounded-lg bg-black/30 px-2 py-1 font-medium text-[10px] text-white leading-tight backdrop-blur-sm">
                    {customTheme.name}
                  </span>
                </button>
                <Tooltip content="删除主题">
                  <Button
                    aria-label={`删除主题 ${customTheme.name}`}
                    className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-background/85 p-0 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDeleteCustomTheme(customTheme.id);
                    }}
                    size="xs"
                    type="button"
                    variant="outline"
                  >
                    <HugeiconsIcon
                      className="h-3.5 w-3.5"
                      icon={Delete02Icon}
                      strokeWidth={1.8}
                    />
                  </Button>
                </Tooltip>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-xs">系统主题</span>
          <span className="text-[10px] text-muted-foreground">
            上传图片后会继承当前主题文字样式
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {presetThemes.map((theme) => (
            <button
              className={cn(
                "group relative flex h-20 flex-col items-center justify-end overflow-hidden rounded-2xl border-2 p-2 transition-all",
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
                className="rounded-lg px-2 py-1 font-medium text-[10px] leading-tight backdrop-blur-sm"
                style={{
                  color: theme.style.heading.color,
                  backgroundColor: "rgba(255,255,255,0.32)",
                }}
              >
                {theme.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
