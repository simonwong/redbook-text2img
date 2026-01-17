import { GithubIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';

export const Header = () => {
  return (
    <header className="sticky top-0 z-10 border border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          <div className="flex flex-1 items-center gap-3">
            <Link aria-label="Home" href="/">
              <div className="flex items-center gap-2">
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={24}
                  height={24}
                  className="h-6 w-6"
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
                <GithubIcon aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};
