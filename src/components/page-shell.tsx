import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  description: string;
  title: string;
}

/** 文档类页面（常见问题、更新日志）的统一版心与标题区，字号和色值与工具界面同一套 */
export const PageShell = ({ children, description, title }: PageShellProps) => (
  <div className="mx-auto w-full max-w-3xl px-1 pt-6 pb-12 sm:px-4 sm:pt-10">
    <header className="mb-6 px-1">
      <h1 className="font-bold text-[24px] text-ink tracking-[-0.02em]">
        {title}
      </h1>
      <p className="mt-1.5 text-[14px] text-ink-2">{description}</p>
    </header>
    {children}
  </div>
);
