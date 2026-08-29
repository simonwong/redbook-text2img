"use client";

import { Image02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type ChangeEvent, type CSSProperties, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import type { StyleConfiguration } from "@/lib/style-system/style-system";
import { canvasBackgroundsEqual, customGradientValue } from "@/lib/theme";
import { processBackgroundImageFile } from "./background-image";
import { BackgroundSwatch } from "./background-swatch";

type BackgroundChoice = StyleConfiguration["background"];
type CustomGradient = Extract<BackgroundChoice, { kind: "custom-gradient" }>;
type GradientDirection = CustomGradient["direction"];

interface BackgroundPickerProps {
  labelledBy: string;
  onChange: (background: BackgroundChoice) => void;
  onResetToTheme: () => void;
  themeBackground: BackgroundChoice;
  themePreviewStyle: CSSProperties;
  value: BackgroundChoice;
}

const defaultSolidColor = "#ffffff";
const defaultGradient: CustomGradient = {
  direction: "diagonal",
  from: "#e0e7ff",
  kind: "custom-gradient",
  to: "#fef3c7",
};

const gradientDirectionOptions = (
  [
    ["vertical", "上下"],
    ["horizontal", "左右"],
    ["diagonal", "对角"],
  ] as const
).map(([value, label]) => ({ label, value }));

const gradientDirectionLabelId = "gradient-direction-label";

export const BackgroundPicker = ({
  labelledBy,
  onChange,
  onResetToTheme,
  themeBackground,
  themePreviewStyle,
  value,
}: BackgroundPickerProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>();

  const solidColor = value.kind === "solid" ? value.color : defaultSolidColor;
  const gradient = value.kind === "custom-gradient" ? value : defaultGradient;

  const openFileDialog = () => fileInputRef.current?.click();

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // 允许连续选择同一文件
    event.target.value = "";
    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      setUploadError("请选择图片文件");
      return;
    }
    setUploadError(undefined);
    setIsUploading(true);
    try {
      const processed = await processBackgroundImageFile(file);
      onChange({ kind: "image", ...processed });
    } catch {
      setUploadError("图片过大或无法读取，请换一张试试");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <fieldset
      aria-labelledby={labelledBy}
      className="m-0 min-w-0 space-y-2 border-0 p-0"
    >
      <div className="grid grid-cols-4 gap-1.5">
        <BackgroundSwatch
          active={canvasBackgroundsEqual(value, themeBackground)}
          label="主题背景"
          onSelect={onResetToTheme}
          preview={
            <span className="block size-full" style={themePreviewStyle} />
          }
        />
        <BackgroundSwatch
          active={value.kind === "solid"}
          label="纯色"
          onSelect={() => onChange({ color: solidColor, kind: "solid" })}
          preview={
            <span
              className="block size-full"
              style={{ backgroundColor: solidColor }}
            />
          }
        />
        <BackgroundSwatch
          active={value.kind === "custom-gradient"}
          label="渐变"
          onSelect={() => onChange({ ...gradient })}
          preview={
            <span
              className="block size-full"
              style={{
                backgroundImage: customGradientValue(
                  gradient.from,
                  gradient.to,
                  gradient.direction
                ),
              }}
            />
          }
        />
        <BackgroundSwatch
          active={value.kind === "image"}
          label="图片"
          onSelect={openFileDialog}
          preview={
            value.kind === "image" ? (
              <span
                className="block size-full"
                style={{
                  backgroundImage: `url("${value.dataUrl}")`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              />
            ) : (
              <span className="flex size-full items-center justify-center bg-muted/60">
                <HugeiconsIcon className="size-4" icon={Image02Icon} />
              </span>
            )
          }
        />
      </div>

      {value.kind === "solid" && (
        <div className="flex h-11 items-center justify-between gap-3 rounded-lg border px-3">
          <label
            className="text-muted-foreground text-xs"
            htmlFor="solid-background-color"
          >
            颜色
          </label>
          <input
            className="h-8 w-14 cursor-pointer rounded border-0 bg-transparent p-0"
            id="solid-background-color"
            onChange={(event) =>
              onChange({ color: event.target.value, kind: "solid" })
            }
            type="color"
            value={solidColor}
          />
        </div>
      )}

      {value.kind === "custom-gradient" && (
        <div className="space-y-2">
          <div className="flex h-11 items-center gap-2 rounded-lg border px-3">
            <label
              className="shrink-0 text-muted-foreground text-xs"
              htmlFor="gradient-from-color"
            >
              从
            </label>
            <input
              className="h-8 w-full min-w-0 cursor-pointer rounded border-0 bg-transparent p-0"
              id="gradient-from-color"
              onChange={(event) =>
                onChange({ ...gradient, from: event.target.value })
              }
              type="color"
              value={gradient.from}
            />
            <label
              className="shrink-0 text-muted-foreground text-xs"
              htmlFor="gradient-to-color"
            >
              到
            </label>
            <input
              className="h-8 w-full min-w-0 cursor-pointer rounded border-0 bg-transparent p-0"
              id="gradient-to-color"
              onChange={(event) =>
                onChange({ ...gradient, to: event.target.value })
              }
              type="color"
              value={gradient.to}
            />
          </div>
          <span className="sr-only" id={gradientDirectionLabelId}>
            渐变方向
          </span>
          <SegmentedControl
            className="w-full"
            labelledBy={gradientDirectionLabelId}
            onChange={(direction) =>
              onChange({
                ...gradient,
                direction: direction as GradientDirection,
              })
            }
            options={gradientDirectionOptions}
            value={gradient.direction}
          />
        </div>
      )}

      {value.kind === "image" && (
        <div className="space-y-1.5">
          <Button
            className="min-h-11 w-full"
            disabled={isUploading}
            onClick={openFileDialog}
            type="button"
            variant="outline"
          >
            {isUploading ? "处理中…" : "更换图片"}
          </Button>
          <p className="text-muted-foreground text-xs">
            图片仅保存在本地浏览器
          </p>
        </div>
      )}

      {uploadError && <p className="text-destructive text-xs">{uploadError}</p>}

      <input
        accept="image/*"
        aria-hidden="true"
        className="hidden"
        onChange={handleFile}
        ref={fileInputRef}
        tabIndex={-1}
        type="file"
      />
    </fieldset>
  );
};
