import {
  ContactIcon,
  GithubIcon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { GITHUB_LINK, TWITTER_LINK, XIAO_HONG_SHU_LINK } from "@/lib/contact";
import { XiaohongshuIcon } from "./icons/xiaohongshu-icon";
import { ThemeToggle } from "./theme-toggle";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export const Header = () => {
  return (
    <header className="sticky top-0 z-10 border border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          <div className="flex flex-1 items-center gap-3">
            <Link aria-label="Home" href="/">
              <div className="flex items-center gap-2">
                <Image
                  alt="Logo"
                  className="h-6 w-6"
                  height={24}
                  src="/logo.svg"
                  width={24}
                />
                <span className="font-bold text-foreground text-xl">
                  小红书图片生成器
                </span>
              </div>
            </Link>
            <Badge className="hidden sm:inline-flex" variant="outline">
              Markdown 转图片
            </Badge>
          </div>
          <nav aria-label="Main Navigation" className="flex items-center gap-3">
            <Button asChild className="text-accent-foreground" variant="link">
              <Link href="/faq">常见问题</Link>
            </Button>
            <Button asChild className="text-accent-foreground" variant="link">
              <Link href="/changelog">更新日志</Link>
            </Button>

            {/* 联系作者 Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon" title="联系作者" variant="outline">
                  <HugeiconsIcon className="h-4 w-4" icon={ContactIcon} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">联系作者</h3>
                  <div className="flex items-center gap-3">
                    <Link
                      className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-accent"
                      href={TWITTER_LINK}
                      rel="noopener noreferrer"
                      target="_blank"
                      title="X (Twitter)"
                    >
                      <HugeiconsIcon
                        className="h-5 w-5"
                        icon={NewTwitterIcon}
                      />
                    </Link>
                    <Link
                      className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-accent"
                      href={GITHUB_LINK}
                      rel="noopener noreferrer"
                      target="_blank"
                      title="GitHub"
                    >
                      <HugeiconsIcon className="h-5 w-5" icon={GithubIcon} />
                    </Link>
                    <Link
                      className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-accent"
                      href={XIAO_HONG_SHU_LINK}
                      rel="noopener noreferrer"
                      target="_blank"
                      title="小红书"
                    >
                      <XiaohongshuIcon className="h-8 w-8 text-red-500" />
                    </Link>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <ThemeToggle />
            <Button
              asChild
              size="icon"
              title="GitHub Repository"
              variant="outline"
            >
              <Link
                aria-label="GitHub"
                href="https://github.com/simonwong/redbook-text2img"
                rel="noopener noreferrer"
                target="_blank"
              >
                <HugeiconsIcon
                  aria-hidden="true"
                  className="h-4 w-4"
                  icon={GithubIcon}
                />
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};
