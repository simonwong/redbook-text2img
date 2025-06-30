import { GithubIcon, SparkleIcon } from 'lucide-react';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

export const Header = () => {
  return (
    <header className="sticky top-0 z-10 border-gray-200 border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          <div className="flex flex-1 items-center gap-3">
            <Link href="/">
              <div className="flex items-center gap-2">
                <SparkleIcon className="h-6 w-6 text-pink-500" />
                <h1 className="font-bold text-gray-900 text-xl">
                  小红书图片生成器
                </h1>
              </div>
            </Link>
            <Badge className="hidden sm:inline-flex" variant="outline">
              Markdown 转图片
            </Badge>
          </div>
          <div>
            <Button asChild className="text-accent-foreground" variant="link">
              <Link href="/changelog">更新日志</Link>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild size="icon" variant="outline">
              <Link
                href="https://github.com/simonwong/redbook-text2img"
                target="_blank"
              >
                <GithubIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
