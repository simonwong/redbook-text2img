import type { ReactNode } from "react";

interface ExternalTextLinkProps {
  children: ReactNode;
  href: string;
}

/** 文档类页面正文里指向站外的文字链接，新标签页打开 */
export const ExternalTextLink = ({ children, href }: ExternalTextLinkProps) => (
  <a
    className="font-semibold text-ink underline underline-offset-4"
    href={href}
    rel="noopener noreferrer"
    target="_blank"
  >
    {children}
  </a>
);
