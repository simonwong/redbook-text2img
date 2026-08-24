import type { CSSProperties } from "react";
import {
  type StyleConfiguration,
  styleSystem,
} from "@/lib/style-system/style-system";
import { ThumbnailChoice } from "./thumbnail-choice";

type ContentSurface = StyleConfiguration["contentSurface"];

interface ContentSurfacePickerProps {
  labelledBy: string;
  onChange: (surface: ContentSurface) => void;
  previews: Readonly<
    Record<
      ContentSurface,
      {
        container: CSSProperties;
        innerContainer: CSSProperties;
      }
    >
  >;
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

export const ContentSurfacePicker = ({
  labelledBy,
  onChange,
  previews,
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
        preview={
          <span
            className="block size-full"
            style={{
              ...previews[option.value].container,
              borderRadius: 0,
              height: "100%",
              minHeight: 0,
              minWidth: 0,
              width: "100%",
            }}
          >
            <span
              className="block size-full"
              style={previews[option.value].innerContainer}
            />
          </span>
        }
      />
    ))}
  </fieldset>
);
