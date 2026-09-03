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
  <div className="flex flex-col items-start gap-2">
    <div className="flex w-full items-center justify-between gap-2">
      <span
        className="relative flex items-center gap-1.5 font-semibold text-[12px] text-ink-2"
        id={labelId}
      >
        {label}
        {isModified && (
          <>
            <span
              aria-hidden="true"
              className="size-[5px] rounded-full bg-ink-2"
            />
            <span className="sr-only">（已调整）</span>
          </>
        )}
      </span>
      {isModified && (
        <button
          aria-label={`${label}已调整，恢复主题值`}
          className="-my-2 -mr-2 flex size-11 items-center justify-center rounded-[9px] text-ink-2 transition-colors duration-150 ease-out hover:bg-[var(--ds-well)] hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 md:size-8"
          onClick={onReset}
          title="恢复主题值"
          type="button"
        >
          <HugeiconsIcon
            className="size-[13px]"
            icon={ArrowReloadHorizontalIcon}
          />
        </button>
      )}
    </div>
    {children}
    {description && (
      <p className="text-[11.5px] text-ink-3" id={descriptionId}>
        {description}
      </p>
    )}
  </div>
);
