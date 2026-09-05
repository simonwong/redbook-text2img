import type { ReactNode } from "react";

interface SettingsGroupProps {
  children: ReactNode;
  headingId: string;
  title: string;
}

/** 扁平面板里没有可见标题的分组，只为读屏保留 region 语义 */
export const SettingsGroup = ({
  children,
  headingId,
  title,
}: SettingsGroupProps) => (
  <section
    aria-labelledby={headingId}
    className="flex min-w-0 flex-col gap-2.5"
  >
    <h2 className="sr-only" id={headingId}>
      {title}
    </h2>
    {children}
  </section>
);
