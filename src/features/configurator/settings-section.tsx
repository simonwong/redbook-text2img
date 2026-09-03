import type { ReactNode } from "react";

interface SettingsSectionProps {
  /** 标题行右侧的操作 */
  action?: ReactNode;
  children: ReactNode;
  headingId: string;
  title: string;
}

/** 扁平面板里唯一带可见标题的分组 */
export const SettingsSection = ({
  action,
  children,
  headingId,
  title,
}: SettingsSectionProps) => (
  <section
    aria-labelledby={headingId}
    className="flex min-w-0 flex-col gap-2.5"
  >
    <div className="flex min-h-7 items-center justify-between gap-2">
      <h2
        className="font-bold text-[12px] text-ink tracking-[0.02em]"
        id={headingId}
      >
        {title}
      </h2>
      {action}
    </div>
    {children}
  </section>
);
