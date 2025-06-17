import { GithubIcon, SparkleIcon } from 'lucide-react';
import React from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import Link from 'next/link';

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Link href="/">
              <div className="flex items-center gap-2">
                <SparkleIcon className="w-6 h-6 text-pink-500" />
                <h1 className="text-xl font-bold text-gray-900">小红书图片生成器</h1>
              </div>
            </Link>
            <Badge variant="outline" className="hidden sm:inline-flex">
              Markdown 转图片
            </Badge>
          </div>
          <div>
            <Button variant="link" asChild className="text-accent-foreground">
              <Link href="/changelog">更新日志</Link>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" asChild>
              <Link href="https://github.com/simonwong/redbook-text2img" target="_blank">
                <GithubIcon className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
