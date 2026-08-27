"use client";

import { cn } from "@/lib/utils";

interface SegmentedControlOption {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  className?: string;
  labelledBy?: string;
  onChange: (value: string) => void;
  options: SegmentedControlOption[];
  value: string;
}

export const SegmentedControl = ({
  options,
  value,
  onChange,
  className,
  labelledBy,
}: SegmentedControlProps) => (
  <fieldset
    aria-labelledby={labelledBy}
    className={cn(
      "m-0 inline-flex min-w-0 rounded-lg border-0 bg-muted p-0.5",
      className
    )}
  >
    {options.map((option) => (
      <label
        className={cn(
          "relative flex min-h-11 flex-1 cursor-pointer items-center justify-center rounded-md px-2 font-medium text-xs transition-all has-[:focus-visible]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-inset",
          option.value === value
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        key={option.value}
      >
        <input
          checked={option.value === value}
          className="sr-only"
          name={labelledBy}
          onChange={() => onChange(option.value)}
          type="radio"
          value={option.value}
        />
        <span>{option.label}</span>
      </label>
    ))}
  </fieldset>
);
