import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header } from '@/components/header';
import { baseMetadata, structuredData } from '@/lib/seo-config';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  ...baseMetadata,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '小红书图片生成器',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'application-name': '小红书图片生成器',
    'apple-mobile-web-app-title': '小红书图片生成器',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        {structuredData.map((data, index) => (
          <script
            // biome-ignore lint/security/noDangerouslySetInnerHtml: use for seo
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(data),
            }}
            // biome-ignore lint/suspicious/noArrayIndexKey: static array
            key={index}
            type="application/ld+json"
          />
        ))}
        <link as="image" href="/og.png" rel="preload" type="image/png" />
        <link href="/icon-512.png" rel="apple-touch-icon" sizes="512x512" />
        <link href="/icon-192.png" rel="apple-touch-icon" sizes="192x192" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex h-screen max-h-screen flex-col bg-gray-50`}
      >
        <Header />
        <main className="flex-1 overflow-hidden" id="main-content">
          {children}
        </main>
        <Analytics />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      </body>
    </html>
  );
}
