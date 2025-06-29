import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header';
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '小红书图片生成器 - Markdown 转图片工具',
  description: '将 Markdown 文本快速转换为精美的小红书风格图片，支持多种样式，一键导出下载。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-screen max-h-screen flex flex-col bg-gray-50`}
      >
        <Header />
        <main className="flex-1 overflow-hidden">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
