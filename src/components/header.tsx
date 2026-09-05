import {
  ContactIcon,
  GithubIcon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import {
  GITHUB_LINK,
  PERSONAL_SITE_LINK,
  TWITTER_LINK,
  XIAO_HONG_SHU_LINK,
} from "@/lib/contact";
import { XiaohongshuIcon } from "./icons/xiaohongshu-icon";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export const Header = () => {
  return (
    <header className="flex h-10 shrink-0 items-center gap-3 px-1">
      <Link aria-label="Home" className="flex items-center gap-2.5" href="/">
        <span className="ds-raised flex size-[30px] items-center justify-center rounded-full shadow-[var(--ds-sh-raised),0_6px_14px_-6px_rgba(255,59,74,0.5)]">
          <Image alt="Logo" height={15} src="/logo.svg" width={15} />
        </span>
        <span className="hidden font-bold text-[14px] text-ink tracking-[-0.01em] sm:inline-flex">
          小红书图片生成器
        </span>
      </Link>

      <div className="flex-1" />

      <nav
        aria-label="Main Navigation"
        className="flex items-center gap-0.5 sm:gap-1"
      >
        <Button
          nativeButton={false}
          render={<Link href="/faq" />}
          size="sm"
          variant="ghost"
        >
          常见问题
        </Button>
        <Button
          nativeButton={false}
          render={<Link href="/changelog" />}
          size="sm"
          variant="ghost"
        >
          更新日志
        </Button>
      </nav>

      <div className="ml-1 flex items-center gap-1.5">
        {/* 联系作者 Popover */}
        <Popover>
          <PopoverTrigger
            render={
              <Button
                aria-label="联系作者"
                size="icon-sm"
                title="联系作者"
                variant="raised"
              />
            }
          >
            <HugeiconsIcon className="size-[13px]" icon={ContactIcon} />
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-3">
              <p className="text-[13px] text-ink">
                <span>嗨，我是 Simon，一名独立开发者。这是我的</span>
                <Link
                  className="mx-0.5 font-semibold underline underline-offset-4"
                  href={PERSONAL_SITE_LINK}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  个人网站
                </Link>
                <span>，你还可以在下面的地方找到我：</span>
              </p>
              <div className="flex items-center gap-2">
                <Link
                  className="flex size-9 items-center justify-center rounded-[11px] text-ink-2 transition-colors hover:bg-[var(--ds-well)] hover:text-ink"
                  href={TWITTER_LINK}
                  rel="noopener noreferrer"
                  target="_blank"
                  title="X (Twitter)"
                >
                  <HugeiconsIcon className="size-4" icon={NewTwitterIcon} />
                </Link>
                <Link
                  className="flex size-9 items-center justify-center rounded-[11px] text-ink-2 transition-colors hover:bg-[var(--ds-well)] hover:text-ink"
                  href={GITHUB_LINK}
                  rel="noopener noreferrer"
                  target="_blank"
                  title="GitHub"
                >
                  <HugeiconsIcon className="size-4" icon={GithubIcon} />
                </Link>
                <Link
                  className="flex size-9 items-center justify-center rounded-[11px] transition-colors hover:bg-[var(--ds-well)]"
                  href={XIAO_HONG_SHU_LINK}
                  rel="noopener noreferrer"
                  target="_blank"
                  title="小红书"
                >
                  <XiaohongshuIcon className="size-6 text-[#ff3b4a]" />
                </Link>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <ThemeToggle />

        <Button
          nativeButton={false}
          render={
            <Link
              aria-label="GitHub"
              href="https://github.com/simonwong/redbook-text2img"
              rel="noopener noreferrer"
              target="_blank"
            />
          }
          size="icon-sm"
          title="GitHub Repository"
          variant="raised"
        >
          <HugeiconsIcon
            aria-hidden="true"
            className="size-[13px]"
            icon={GithubIcon}
          />
        </Button>
      </div>
    </header>
  );
};
