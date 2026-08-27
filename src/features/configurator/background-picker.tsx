import type { CSSProperties } from "react";
import type { StyleConfiguration } from "@/lib/style-system/style-system";
import { canvasBackgroundsEqual } from "@/lib/theme";
import { ThumbnailChoice } from "./thumbnail-choice";

type BackgroundChoice = StyleConfiguration["background"];

export interface BackgroundOption {
  label: string;
  previewStyle: CSSProperties;
  value: BackgroundChoice;
}

export interface BackgroundOptionGroup {
  label: string;
  options: readonly BackgroundOption[];
}

interface BackgroundPickerProps {
  groups: readonly BackgroundOptionGroup[];
  labelledBy: string;
  onChange: (background: BackgroundChoice) => void;
  value: BackgroundChoice;
}

const defaultSolidColor = "#ffffff";
const solidColorDescriptionId = "solid-background-color-description";

export const BackgroundPicker = ({
  groups,
  labelledBy,
  onChange,
  value,
}: BackgroundPickerProps) => {
  const solidColor = value.kind === "solid" ? value.color : defaultSolidColor;
  const isSolid = value.kind === "solid";

  return (
    <fieldset
      aria-labelledby={labelledBy}
      className="m-0 min-w-0 space-y-3 border-0 p-0"
    >
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-1.5 text-muted-foreground text-xs">{group.label}</p>
          <div className="grid grid-cols-3 gap-2">
            {group.options.map((option) => (
              <ThumbnailChoice
                active={canvasBackgroundsEqual(value, option.value)}
                key={option.label}
                label={option.label}
                onSelect={() => onChange(option.value)}
                preview={
                  <span
                    className="block size-full"
                    style={option.previewStyle}
                  />
                }
              />
            ))}
          </div>
        </div>
      ))}

      <div className="grid grid-cols-3 gap-2">
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
      </div>

      <div className="flex min-h-14 items-center justify-between gap-3 rounded-lg border px-3">
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
