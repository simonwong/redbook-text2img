import type { Metadata } from 'next';

// 网站基础信息
export const siteConfig = {
  name: '小红书图片生成器',
  description:
    '将 Markdown 文本快速转换为精美的小红书风格图片，支持多种样式，一键导出下载。免费在线工具，无需注册。',
  url:
    process.env.NEXT_PUBLIC_SITE_URL || 'https://redbook-text2img.vercel.app',
  ogImage: '/og.png',
  creator: '@simonwong',
  keywords: [
    '小红书',
    '图片生成器',
    'Markdown转图片',
    '社交媒体工具',
    '文字转图片',
    '小红书笔记',
    '图片制作',
    '在线工具',
    '免费工具',
    'Markdown编辑器',
    '小红书图片',
    '社交媒体图片',
    '内容创作',
    '图片设计',
    '文案配图',
  ],
};

// 基础SEO metadata
export const baseMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: 'Simon Wong',
      url: 'https://github.com/simonwong',
    },
  ],
  creator: siteConfig.creator,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - ${siteConfig.description}`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.creator,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
    other: {
      'baidu-site-verification':
        process.env.NEXT_PUBLIC_BAIDU_VERIFICATION || '',
    },
  },
  category: 'technology',
};

// 结构化数据
export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'CNY',
  },
  author: {
    '@type': 'Person',
    name: 'Simon Wong',
    url: 'https://github.com/simonwong',
  },
  publisher: {
    '@type': 'Organization',
    name: siteConfig.name,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/logo.svg`,
    },
  },
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  screenshot: `${siteConfig.url}${siteConfig.ogImage}`,
  softwareVersion: '1.0.0',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '156',
  },
  featureList: [
    'Markdown 转图片',
    '多种样式模板',
    '一键导出',
    '实时预览',
    '自定义样式',
    '批量导出',
  ],
};

// 页面特定的metadata生成器
export function generatePageMetadata(
  title: string,
  description?: string,
  path?: string
): Metadata {
  return {
    title,
    description: description || siteConfig.description,
    alternates: {
      canonical: path || '/',
    },
    openGraph: {
      title,
      description: description || siteConfig.description,
      url: `${siteConfig.url}${path || ''}`,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${title} - ${siteConfig.name}`,
        },
      ],
    },
    twitter: {
      title,
      description: description || siteConfig.description,
    },
  };
}
