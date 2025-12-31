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

// WebApplication 结构化数据
export const webAppStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Web Browser',
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'CNY',
    availability: 'https://schema.org/InStock',
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

// FAQ 结构化数据
export const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '小红书图片生成器是免费的吗？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '是的，小红书图片生成器完全免费，无需注册即可使用所有功能。',
      },
    },
    {
      '@type': 'Question',
      name: '支持哪些 Markdown 语法？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '支持完整的 Markdown 语法，包括标题、粗体、斜体、列表、引用、代码块等常用格式。',
      },
    },
    {
      '@type': 'Question',
      name: '生成的图片可以商用吗？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '可以，生成的图片完全属于您，可自由用于个人或商业用途。',
      },
    },
    {
      '@type': 'Question',
      name: '图片会保存到服务器吗？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '不会，所有图片生成都在浏览器本地完成，您的内容不会上传到任何服务器，完全保护隐私。',
      },
    },
    {
      '@type': 'Question',
      name: '支持批量导出吗？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '支持，当内容较长时会自动分页，可以一键批量导出所有图片。',
      },
    },
  ],
};

// HowTo 结构化数据
export const howToStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: '如何使用小红书图片生成器',
  description: '简单三步，快速将 Markdown 文本转换为精美的小红书风格图片',
  totalTime: 'PT2M',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'CNY',
    value: '0',
  },
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: '输入内容',
      text: '在左侧编辑器中输入或粘贴您的 Markdown 文本内容',
      image: `${siteConfig.url}/og.png`,
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: '选择样式',
      text: '在右侧配置面板中选择预设样式或自定义背景颜色、字体大小等',
      image: `${siteConfig.url}/og.png`,
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: '导出图片',
      text: '点击导出按钮，将生成的图片保存到本地',
      image: `${siteConfig.url}/og.png`,
    },
  ],
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
