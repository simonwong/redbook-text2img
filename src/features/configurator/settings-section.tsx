import { ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";

interface SettingsSectionProps {
  children: ReactNode;
  headingId: string;
  isModified?: boolean;
  onReset?: () => void;
  title: string;
}

export const SettingsSection = ({
  children,
  headingId,
  isModified = false,
  onReset,
  title,
}: SettingsSectionProps) => (
  <section
    aria-labelledby={headingId}
    className="flex flex-col gap-2 border-[var(--ds-line)] border-t py-3 first:border-t-0 first:pt-0"
  >
    <div className="flex items-center justify-between gap-2">
      <h2
        className="flex items-center gap-1.5 font-bold text-[12px] text-ink tracking-[0.02em]"
        id={headingId}
      >
        {title}
        {isModified && (
          <>
            <span
              aria-hidden="true"
              className="size-[5px] rounded-full bg-ink-2"
            />
            <span className="sr-only">（已调整）</span>
          </>
        )}
      </h2>
      {isModified && onReset && (
        <button
          aria-label={`${title}已调整，恢复主题值`}
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
  </section>
);
