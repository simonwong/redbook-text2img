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
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export const Header = () => {
  return (
    <header className="sticky top-0 z-10 border border-b bg-background">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-12 items-center gap-4">
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
                <span className="hidden font-bold text-foreground text-xl sm:inline-flex">
                  小红书图片生成器
                </span>
              </div>
            </Link>
          </div>
          <nav aria-label="Main Navigation" className="flex items-center gap-3">
            <Button
              className="text-accent-foreground"
              nativeButton={false}
              render={<Link href="/faq" />}
              variant="link"
            >
              常见问题
            </Button>
            <Button
              className="text-accent-foreground"
              nativeButton={false}
              render={<Link href="/changelog" />}
              variant="link"
            >
              更新日志
            </Button>

            {/* 联系作者 Popover */}
            <Popover>
              <PopoverTrigger
                render={
                  <Button size="icon" title="联系作者" variant="outline" />
                }
              >
                <HugeiconsIcon className="h-4 w-4" icon={ContactIcon} />
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
              nativeButton={false}
              render={
                <Link
                  aria-label="GitHub"
                  href="https://github.com/simonwong/redbook-text2img"
                  rel="noopener noreferrer"
                  target="_blank"
                />
              }
              size="icon"
              title="GitHub Repository"
              variant="outline"
            >
              <HugeiconsIcon
                aria-hidden="true"
                className="h-4 w-4"
                icon={GithubIcon}
              />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};
