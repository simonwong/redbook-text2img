import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Tooltip } from "@/components/tooltip";

interface ToolbarButtonProps {
  icon: IconSvgElement;
  label: string;
  onClick: () => void;
}

export const ToolbarButton = ({ icon, label, onClick }: ToolbarButtonProps) => (
  <Tooltip content={label}>
    <button
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-95"
      onClick={onClick}
      type="button"
    >
      <HugeiconsIcon className="h-3.5 w-3.5" icon={icon} />
    </button>
  </Tooltip>
);
