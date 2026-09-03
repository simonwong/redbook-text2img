import {
  type StyleConfiguration,
  styleSystem,
} from "@/lib/style-system/style-system";
import { cn } from "@/lib/utils";

type CoverLayout = StyleConfiguration["coverLayout"];

interface CoverLayoutPickerProps {
  labelledBy: string;
  onChange: (layout: CoverLayout) => void;
  value: CoverLayout;
}

const labels: Record<CoverLayout, string> = {
  "bottom-left": "左下",
  "center-poster": "居中海报",
  "top-left": "左上",
};

const layouts = styleSystem.configurationOptions().coverLayout.map((value) => ({
  label: labels[value],
  value,
}));

const previewAlignment: Record<CoverLayout, string> = {
  "bottom-left": "items-end justify-start",
  "center-poster": "items-center justify-center",
  "top-left": "items-start justify-start",
};

export const CoverLayoutPicker = ({
  labelledBy,
  onChange,
  value,
}: CoverLayoutPickerProps) => (
  <fieldset
    aria-labelledby={labelledBy}
    className="m-0 grid min-w-0 grid-cols-3 gap-2 border-0 p-0"
  >
    {layouts.map((layout) => (
      <button
        aria-pressed={layout.value === value}
        className={cn(
          "ds-layout-card relative flex flex-col items-center gap-1.5 rounded-[11px] px-1.5 py-2 text-[11px] transition-colors duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2",
          layout.value === value
            ? "ds-ring font-semibold text-ink"
            : "text-ink-2 hover:text-ink"
        )}
        key={layout.value}
        onClick={() => onChange(layout.value)}
        type="button"
      >
        <span
          aria-hidden="true"
          className={cn(
            "ds-well flex h-[42px] w-8 rounded-[5px] p-1",
            previewAlignment[layout.value]
          )}
        >
          <span className="block h-[2.5px] w-3.5 rounded-full bg-current" />
        </span>
        <span>{layout.label}</span>
      </button>
    ))}
  </fieldset>
);
