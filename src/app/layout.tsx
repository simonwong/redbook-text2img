import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
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

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: use for seo
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
          type="application/ld+json"
        />
        <link as="image" href="/og.png" rel="preload" type="image/png" />
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
