import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface WorkLinkCardProps {
  description: string;
  href: string;
  title: string;
}

/** 关于页里作者其他产品的链接卡片：整张卡是一个站外链接，标题即锚文本主体 */
export const WorkLinkCard = ({
  description,
  href,
  title,
}: WorkLinkCardProps) => (
  <a
    className="ds-well group flex items-start justify-between gap-2 rounded-[14px] px-3.5 py-3 transition-colors hover:bg-[var(--ds-chip-bg)]"
    href={href}
    rel="noopener"
    target="_blank"
  >
    <span className="min-w-0">
      <span className="block font-semibold text-[13.5px] text-ink leading-snug">
        {title}
      </span>
      <span className="mt-0.5 block text-[12px] text-ink-3">{description}</span>
    </span>
    <HugeiconsIcon
      aria-hidden
      className="mt-0.5 size-3.5 shrink-0 text-ink-3 transition-colors group-hover:text-ink"
      icon={ArrowUpRight01Icon}
    />
  </a>
);
