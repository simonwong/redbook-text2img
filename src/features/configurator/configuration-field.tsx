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
    <div className="flex items-center justify-between gap-2">
      <span
        className="relative flex items-center gap-1.5 font-medium text-xs"
        id={labelId}
      >
        {label}
        {isModified && (
          <>
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-primary"
            />
            <span className="sr-only">（已调整）</span>
          </>
        )}
      </span>
      {isModified && (
        <button
          aria-label={`${label}已调整，恢复主题值`}
          className="-my-2 -mr-2.5 flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onClick={onReset}
          title="恢复主题值"
          type="button"
        >
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
