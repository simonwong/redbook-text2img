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
      "ds-well-inset m-0 inline-flex max-w-full flex-wrap gap-0.5 self-start rounded-[11px] border-0 p-0.5",
      className
    )}
  >
    {options.map((option) => (
      <label
        className={cn(
          "relative flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center rounded-[9px] px-2.5 font-semibold text-[12px] transition-colors duration-150 ease-out has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ink has-[:focus-visible]:outline-offset-2 md:h-7 md:min-h-7",
          option.value === value
            ? "ds-chip-on text-ink"
            : "text-ink-2 hover:text-ink"
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
