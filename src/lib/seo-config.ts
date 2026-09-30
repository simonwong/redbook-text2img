import type { Metadata } from "next";
import packageJson from "../../package.json";

// 网站基础信息
export const siteConfig = {
  creator: "@simonwong",
  description:
    "免费将 Markdown 文字转成小红书、小绿书、公众号图文风格图片，多种精美主题模板，支持批量导出高清图。无需注册，打开即用，数据本地处理更安全。",
  // 搜索引擎基本不读 keywords，只留与产品直接对应的检索词
  keywords: [
    "小红书图片生成器",
    "Markdown转图片",
    "文字转图片",
    "小红书笔记配图",
    "小绿书图片生成",
    "公众号图文配图",
    "在线图片生成工具",
  ],
  name: "小红书图片生成器",
  ogImage: "/og.png",
  screenshot: "/screenshot-1.png",
  title: "小红书图片生成器 - Markdown转图片，免费在线工具",
  url: "https://redbook-text2img.com",
};

const author = {
  "@type": "Person",
  name: "Simon Wong",
  url: "https://github.com/simonwong",
};

// 嵌套字段在路由段之间是整体替换而不是合并，子页面要带上这些公共字段
const sharedOpenGraph = {
  locale: "zh_CN",
  siteName: siteConfig.name,
  type: "website",
} as const;

const sharedTwitter = {
  card: "summary_large_image" as const,
  creator: siteConfig.creator,
  images: [siteConfig.ogImage],
};

const openGraphImage = (alt: string) => ({
  alt,
  height: 630,
  type: "image/png",
  url: siteConfig.ogImage,
  width: 1200,
});

// 未配置的验证码不输出空 meta
const baiduVerification = process.env.NEXT_PUBLIC_BAIDU_VERIFICATION;

// 基础SEO metadata
export const baseMetadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  applicationName: siteConfig.name,
  authors: [{ name: author.name, url: author.url }],
  category: "technology",
  creator: siteConfig.creator,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    ...sharedOpenGraph,
    description: siteConfig.description,
    images: [openGraphImage(siteConfig.title)],
    title: siteConfig.title,
    url: "/",
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
    ...sharedTwitter,
    description: siteConfig.description,
    title: siteConfig.title,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: baiduVerification
      ? { "baidu-site-verification": baiduVerification }
      : undefined,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
  },
};

// 页面特定的metadata生成器
export function generatePageMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  const socialTitle = `${title} | ${siteConfig.name}`;
  return {
    alternates: {
      canonical: path,
    },
    description,
    openGraph: {
      ...sharedOpenGraph,
      description,
      images: [openGraphImage(socialTitle)],
      title: socialTitle,
      url: path,
    },
    title,
    twitter: {
      ...sharedTwitter,
      description,
      title: socialTitle,
    },
  };
}

// WebSite 结构化数据：告诉搜索引擎站点名称
export const webSiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  description: siteConfig.description,
  inLanguage: "zh-CN",
  name: siteConfig.name,
  url: siteConfig.url,
};

// WebApplication 结构化数据，只放在首页
export const webAppStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  applicationCategory: "DesignApplication",
  author,
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  description: siteConfig.description,
  featureList: [
    "Markdown 转图片",
    "8 个内置主题与自定义主题",
    "实时分页预览",
    "正文插入图片",
    "单张与批量导出高清 PNG",
    "内容与图片仅保存在浏览器本地",
  ],
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  inLanguage: "zh-CN",
  isAccessibleForFree: true,
  name: siteConfig.name,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CNY",
  },
  operatingSystem: "Any",
  screenshot: `${siteConfig.url}${siteConfig.screenshot}`,
  softwareVersion: packageJson.version,
  url: siteConfig.url,
};

// 子页面的面包屑结构化数据
export function generateBreadcrumbStructuredData(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        item: siteConfig.url,
        name: siteConfig.name,
        position: 1,
      },
      {
        "@type": "ListItem",
        item: `${siteConfig.url}${path}`,
        name,
        position: 2,
      },
    ],
  };
}
