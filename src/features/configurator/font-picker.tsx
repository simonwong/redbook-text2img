import { cn } from "@/lib/utils";

interface FontOption {
  label: string;
  value: string;
}

interface FontPickerProps {
  labelledBy: string;
  onChange: (fontId: string) => void;
  options: readonly FontOption[];
  value: string;
}

export const FontPicker = ({
  labelledBy,
  onChange,
  options,
  value,
}: FontPickerProps) => (
  <fieldset
    aria-labelledby={labelledBy}
    className="m-0 grid min-w-0 grid-cols-2 gap-2 border-0 p-0"
  >
    {options.map((option) => (
      <button
        aria-pressed={option.value === value}
        className={cn(
          "min-h-11 rounded-lg border px-3 font-medium text-muted-foreground text-xs transition-colors hover:border-muted-foreground/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          option.value === value &&
            "border-primary bg-primary/5 text-foreground ring-1 ring-primary"
        )}
        key={option.value}
        onClick={() => onChange(option.value)}
        type="button"
      >
        {option.label}
      </button>
    ))}
  </fieldset>
);
