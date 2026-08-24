import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ThumbnailChoiceProps {
  active: boolean;
  label: string;
  onSelect: () => void;
  preview: ReactNode;
}

export const ThumbnailChoice = ({
  active,
  label,
  onSelect,
  preview,
}: ThumbnailChoiceProps) => (
  <button
    aria-pressed={active}
    className={cn(
      "flex min-h-20 flex-col gap-2 rounded-lg border p-2 text-left text-muted-foreground text-xs transition-colors hover:border-muted-foreground/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      active &&
        "border-primary bg-primary/5 text-foreground ring-1 ring-primary"
    )}
    onClick={onSelect}
    type="button"
  >
    <span className="block h-10 w-full overflow-hidden rounded-md border">
      {preview}
    </span>
    <span>{label}</span>
  </button>
);
