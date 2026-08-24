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
  "bottom-left": "items-start justify-end text-left",
  "center-poster": "items-center justify-center text-center",
  "top-left": "items-start justify-start text-left",
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
          "flex min-h-24 flex-col items-center gap-2 rounded-lg border p-2 text-muted-foreground text-xs transition-colors hover:border-muted-foreground/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          layout.value === value &&
            "border-primary bg-primary/5 text-foreground ring-1 ring-primary"
        )}
        key={layout.value}
        onClick={() => onChange(layout.value)}
        type="button"
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex aspect-[3/4] h-12 rounded border bg-background p-1.5",
            previewAlignment[layout.value]
          )}
        >
          <span className="block h-1 w-5 rounded-full bg-current" />
        </span>
        <span>{layout.label}</span>
      </button>
    ))}
  </fieldset>
);
