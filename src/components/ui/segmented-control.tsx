"use client";

import { cn } from "@/lib/utils";

interface SegmentedControlOption {
  label: string;
  value: string;
}

interface SegmentedControlProps {
  className?: string;
  onChange: (value: string) => void;
  options: SegmentedControlOption[];
  value: string;
}

export const SegmentedControl = ({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps) => (
  <div className={cn("inline-flex rounded-lg bg-muted p-0.5", className)}>
    {options.map((option) => (
      <button
        className={cn(
          "rounded-md px-3 py-1 font-medium text-xs transition-all",
          option.value === value
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        key={option.value}
        onClick={() => onChange(option.value)}
        type="button"
      >
        {option.label}
      </button>
    ))}
  </div>
);
