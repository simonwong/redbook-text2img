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
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "application-name": "小红书图片生成器",
    "apple-mobile-web-app-title": "小红书图片生成器",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "light dark",
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
      <body className="flex h-dvh max-h-dvh flex-col bg-background">
        <ThemeProvider>
          <TooltipProvider>
            <Header />
            <main className="flex-1 overflow-y-auto" id="main-content">
              {children}
            </main>
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </body>
    </html>
  );
}
