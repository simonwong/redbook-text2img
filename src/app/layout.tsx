import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { baseMetadata, structuredData } from "@/lib/seo-config";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  ...baseMetadata,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "小红书图片生成器",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "小红书图片生成器",
    "application-name": "小红书图片生成器",
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { color: "#ebebee", media: "(prefers-color-scheme: light)" },
    { color: "#121215", media: "(prefers-color-scheme: dark)" },
  ],
  viewportFit: "cover",
  width: "device-width",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn("font-sans", inter.variable)}
      lang="zh-CN"
      suppressHydrationWarning
    >
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
        <link href="/icon-512.png" rel="apple-touch-icon" sizes="512x512" />
      </head>
      <body>
        {/* 布局壳单独一层：弹层 Portal 会往 body 末尾追加容器，
            若 body 本身是 flex-col + gap，容器出现/消失会让整页多出一格 gap 而闪动 */}
        <div className="flex h-dvh max-h-dvh flex-col gap-2 px-3 pt-2 pb-3">
          <ThemeProvider>
            <TooltipProvider>
              <Header />
              <main className="flex-1 overflow-y-auto" id="main-content">
                {children}
              </main>
            </TooltipProvider>
          </ThemeProvider>
        </div>
        <Analytics />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </body>
    </html>
  );
}
