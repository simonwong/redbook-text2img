import type { StyleConfiguration } from "@/lib/style-system/style-system";
import { cn } from "@/lib/utils";

type CoverLayout = StyleConfiguration["coverLayout"];

interface CoverLayoutPickerProps {
  onChange: (layout: CoverLayout) => void;
  value: CoverLayout;
}

const layouts: { label: string; value: CoverLayout }[] = [
  { label: "居中海报", value: "center-poster" },
  { label: "左上", value: "top-left" },
  { label: "左下", value: "bottom-left" },
];

const previewAlignment: Record<CoverLayout, string> = {
  "bottom-left": "items-start justify-end text-left",
  "center-poster": "items-center justify-center text-center",
  "top-left": "items-start justify-start text-left",
};

export const CoverLayoutPicker = ({
  onChange,
  value,
}: CoverLayoutPickerProps) => (
  <div className="grid grid-cols-3 gap-2">
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
  </div>
);
