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
    className="space-y-2.5 border-t pt-3 first:border-t-0 first:pt-0"
  >
    <div className="flex items-center justify-between gap-2">
      <h2
        className="flex items-center gap-1.5 font-semibold text-sm"
        id={headingId}
      >
        {title}
        {isModified && (
          <>
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-primary"
            />
            <span className="sr-only">（已调整）</span>
          </>
        )}
      </h2>
      {isModified && onReset && (
        <button
          aria-label={`${title}已调整，恢复主题值`}
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
  </section>
);
