import type { Metadata } from "next";
import { generateFAQStructuredData } from "./faq-data";

// 网站基础信息
export const siteConfig = {
  creator: "@simonwong",
  description:
    "免费将 Markdown 文字转成小红书、小绿书、公众号图文风格图片，多种精美主题模板，支持批量导出高清图。无需注册，打开即用，数据本地处理更安全。",
  keywords: [
    "小红书",
    "图片生成器",
    "Markdown转图片",
    "社交媒体工具",
    "文字转图片",
    "小红书笔记",
    "图片制作",
    "在线工具",
    "免费工具",
    "Markdown编辑器",
    "小红书图片",
    "社交媒体图片",
    "内容创作",
    "图片设计",
    "文案配图",
    "小绿书图片生成",
    "公众号图文图片生成",
    "社交媒体图片制作",
    "文字转图片工具",
  ],
  name: "小红书图片生成器",
  ogImage: "/og.png",
  title: "小红书图片生成器 - Markdown转图片，免费在线工具",
  url: "https://redbook-text2img.com",
};

// 基础SEO metadata
export const baseMetadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  authors: [
    {
      name: "Simon Wong",
      url: "https://github.com/simonwong",
    },
  ],
  category: "technology",
  creator: siteConfig.creator,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    description: siteConfig.description,
    images: [
      {
        alt: `${siteConfig.name} - ${siteConfig.description}`,
        height: 630,
        type: "image/png",
        url: siteConfig.ogImage,
        width: 1200,
      },
    ],
    locale: "zh_CN",
    siteName: siteConfig.name,
    title: siteConfig.title,
    type: "website",
    url: siteConfig.url,
  },
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    index: true,
  },
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  twitter: {
    card: "summary_large_image",
    creator: siteConfig.creator,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    title: siteConfig.title,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "baidu-site-verification":
        process.env.NEXT_PUBLIC_BAIDU_VERIFICATION || "",
    },
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
};

// WebApplication 结构化数据
export const webAppStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  applicationCategory: "UtilitiesApplication",
  author: {
    "@type": "Person",
    name: "Simon Wong",
    url: "https://github.com/simonwong",
  },
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  description: siteConfig.description,
  featureList: [
    "Markdown 转图片",
    "多种样式模板",
    "一键导出",
    "实时预览",
    "自定义样式",
    "批量导出",
  ],
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  name: siteConfig.name,
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    price: "0",
    priceCurrency: "CNY",
  },
  operatingSystem: "Web Browser",
  publisher: {
    "@type": "Organization",
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/logo.svg`,
    },
    name: siteConfig.name,
  },
  screenshot: `${siteConfig.url}${siteConfig.ogImage}`,
  softwareVersion: "1.0.0",
  url: siteConfig.url,
};

// FAQ 结构化数据（从 faq-data.ts 生成）
export const faqStructuredData = generateFAQStructuredData();

// HowTo 结构化数据
export const howToStructuredData = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  description: "简单三步，快速将 Markdown 文本转换为精美的小红书风格图片",
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "CNY",
    value: "0",
  },
  name: "如何使用小红书图片生成器",
  step: [
    {
      "@type": "HowToStep",
      image: `${siteConfig.url}/og.png`,
      name: "输入内容",
      position: 1,
      text: "在左侧编辑器中输入或粘贴您的 Markdown 文本内容",
    },
    {
      "@type": "HowToStep",
      image: `${siteConfig.url}/og.png`,
      name: "选择样式",
      position: 2,
      text: "在右侧配置面板中选择预设样式或自定义背景颜色、字体大小等",
    },
    {
      "@type": "HowToStep",
      image: `${siteConfig.url}/og.png`,
      name: "导出图片",
      position: 3,
      text: "点击导出按钮，将生成的图片保存到本地",
    },
  ],
  totalTime: "PT2M",
};

// 组合所有结构化数据
export const structuredData = [
  webAppStructuredData,
  faqStructuredData,
  howToStructuredData,
];

// 页面特定的metadata生成器
export function generatePageMetadata(
  title: string,
  description?: string,
  path?: string
): Metadata {
  return {
    alternates: {
      canonical: path || "/",
    },
    description: description || siteConfig.description,
    openGraph: {
      description: description || siteConfig.description,
      images: [
        {
          alt: `${title} - ${siteConfig.name}`,
          height: 630,
          url: siteConfig.ogImage,
          width: 1200,
        },
      ],
      title,
      url: `${siteConfig.url}${path || ""}`,
    },
    title,
    twitter: {
      description: description || siteConfig.description,
      title,
    },
  };
}
