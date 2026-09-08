import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Tooltip } from "@/components/tooltip";

interface ToolbarButtonProps {
  disabled?: boolean;
  icon: IconSvgElement;
  label: string;
  onClick: () => void;
}

export const ToolbarButton = ({
  disabled,
  icon,
  label,
  onClick,
}: ToolbarButtonProps) => (
  <Tooltip content={label}>
    <button
      aria-label={label}
      className="flex size-8 shrink-0 items-center justify-center rounded-[10px] text-ink-2 transition-colors duration-150 ease-out hover:bg-[var(--ds-well)] hover:text-ink disabled:cursor-wait disabled:opacity-50"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <HugeiconsIcon className="size-4" icon={icon} />
    </button>
  </Tooltip>
);
