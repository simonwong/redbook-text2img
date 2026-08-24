import type { ReactNode } from "react";
import {
  type StyleConfiguration,
  styleSystem,
} from "@/lib/style-system/style-system";
import { ThumbnailChoice } from "./thumbnail-choice";

type ContentSurface = StyleConfiguration["contentSurface"];

interface ContentSurfacePickerProps {
  labelledBy: string;
  onChange: (surface: ContentSurface) => void;
  value: ContentSurface;
}

const labels: Record<ContentSurface, string> = {
  "floating-card": "浮层卡",
  none: "无底板",
  notebook: "备忘录",
};

const options = styleSystem
  .configurationOptions()
  .contentSurface.map((value) => ({ label: labels[value], value }));

const previews: Record<ContentSurface, ReactNode> = {
  "floating-card": (
    <span className="flex size-full items-center justify-center bg-muted p-2">
      <span className="size-full rounded bg-background shadow-sm" />
    </span>
  ),
  none: (
    <span className="flex size-full items-center justify-center bg-muted">
      <span className="h-px w-10 bg-muted-foreground/50" />
    </span>
  ),
  notebook: (
    <span
      className="block size-full bg-[#fffdf5]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(148, 163, 184, 0.28) 1px, transparent 1px)",
        backgroundSize: "100% 10px",
      }}
    />
  ),
};

export const ContentSurfacePicker = ({
  labelledBy,
  onChange,
  value,
}: ContentSurfacePickerProps) => (
  <fieldset
    aria-labelledby={labelledBy}
    className="m-0 grid min-w-0 grid-cols-3 gap-2 border-0 p-0"
  >
    {options.map((option) => (
      <ThumbnailChoice
        active={option.value === value}
        key={option.value}
        label={option.label}
        onSelect={() => onChange(option.value)}
        preview={previews[option.value]}
      />
    ))}
  </fieldset>
);
