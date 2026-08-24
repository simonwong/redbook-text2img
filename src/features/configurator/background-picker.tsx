import type { CSSProperties } from "react";
import type { StyleConfiguration } from "@/lib/style-system/style-system";
import { ThumbnailChoice } from "./thumbnail-choice";

type BackgroundChoice = StyleConfiguration["background"];
type BackgroundPreset = Extract<BackgroundChoice, { kind: "preset" }>["preset"];

export interface BackgroundOption {
  label: string;
  previewStyle: CSSProperties;
  value: BackgroundPreset;
}

interface BackgroundPickerProps {
  labelledBy: string;
  onChange: (background: BackgroundChoice) => void;
  options: readonly BackgroundOption[];
  value: BackgroundChoice;
}

const defaultSolidColor = "#ffffff";
const solidColorDescriptionId = "solid-background-color-description";

export const BackgroundPicker = ({
  labelledBy,
  onChange,
  options,
  value,
}: BackgroundPickerProps) => {
  const solidColor = value.kind === "solid" ? value.color : defaultSolidColor;
  const isSolid = value.kind === "solid";

  return (
    <fieldset
      aria-labelledby={labelledBy}
      className="m-0 grid min-w-0 grid-cols-3 gap-2 border-0 p-0"
    >
      {options.map((option) => (
        <ThumbnailChoice
          active={value.kind === "preset" && value.preset === option.value}
          key={option.value}
          label={option.label}
          onSelect={() => onChange({ kind: "preset", preset: option.value })}
          preview={
            <span className="block size-full" style={option.previewStyle} />
          }
        />
      ))}

      <ThumbnailChoice
        active={isSolid}
        label="纯色"
        onSelect={() => onChange({ color: solidColor, kind: "solid" })}
        preview={
          <span
            className="block size-full"
            style={{ backgroundColor: solidColor }}
          />
        }
      />

      <div className="col-span-3 flex min-h-14 items-center justify-between gap-3 rounded-lg border px-3">
        <div>
          <label
            className="font-medium text-xs"
            htmlFor="solid-background-color"
          >
            纯色颜色
          </label>
          {!isSolid && (
            <p
              className="text-muted-foreground text-xs"
              id={solidColorDescriptionId}
            >
              选择纯色后可设置颜色
            </p>
          )}
        </div>
        <input
          aria-describedby={isSolid ? undefined : solidColorDescriptionId}
          className="h-11 w-14 cursor-pointer rounded border-0 bg-transparent p-0 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!isSolid}
          id="solid-background-color"
          onChange={(event) =>
            onChange({ color: event.target.value, kind: "solid" })
          }
          type="color"
          value={solidColor}
        />
      </div>
    </fieldset>
  );
};
