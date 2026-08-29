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
      "group flex min-w-0 flex-col items-center gap-1.5 rounded-md text-muted-foreground text-xs transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      active && "text-foreground"
    )}
    onClick={onSelect}
    type="button"
  >
    <span
      className={cn(
        "block h-11 w-full overflow-hidden rounded-md border transition-colors group-hover:border-muted-foreground/40",
        active ? "border-primary ring-2 ring-primary/30" : "border-border/70"
      )}
    >
      {preview}
    </span>
    <span className="max-w-full truncate">{label}</span>
  </button>
);
