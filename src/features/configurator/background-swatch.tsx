import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BackgroundSwatchProps {
  active: boolean;
  label: string;
  onSelect: () => void;
  preview: ReactNode;
}

export const BackgroundSwatch = ({
  active,
  label,
  onSelect,
  preview,
}: BackgroundSwatchProps) => (
  <button
    aria-pressed={active}
    className={cn(
      "group flex min-w-0 flex-col items-center gap-[5px] rounded-[9px] text-[11px] transition-colors duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2",
      active ? "font-semibold text-ink" : "text-ink-2 hover:text-ink"
    )}
    onClick={onSelect}
    type="button"
  >
    <span
      className={cn(
        "ds-hairline relative block h-[38px] w-full overflow-hidden rounded-[11px]",
        active && "ds-ring"
      )}
    >
      {preview}
    </span>
    <span className="max-w-full truncate">{label}</span>
  </button>
);
