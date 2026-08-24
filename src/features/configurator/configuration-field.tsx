import { ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";

interface ConfigurationFieldProps {
  children: ReactNode;
  description?: string;
  descriptionId?: string;
  isModified: boolean;
  label: string;
  labelId: string;
  onReset: () => void;
}

export const ConfigurationField = ({
  children,
  description,
  descriptionId,
  isModified,
  label,
  labelId,
  onReset,
}: ConfigurationFieldProps) => (
  <div className="space-y-2">
    <div className="flex min-h-11 items-center justify-between gap-2">
      <span className="font-medium text-xs" id={labelId}>
        {label}
      </span>
      {isModified && (
        <button
          aria-label={`${label}已调整，恢复主题值`}
          className="flex min-h-11 items-center gap-1 rounded-md px-2 text-primary text-xs hover:bg-primary/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={onReset}
          type="button"
        >
          <span>已调整 · 恢复主题值</span>
          <HugeiconsIcon
            className="size-3.5"
            icon={ArrowReloadHorizontalIcon}
          />
        </button>
      )}
    </div>
    {children}
    {description && (
      <p className="text-muted-foreground text-xs" id={descriptionId}>
        {description}
      </p>
    )}
  </div>
);
