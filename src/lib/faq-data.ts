export interface FAQItem {
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    question: '小红书图片生成器是免费的吗？',
    answer: '是的，小红书图片生成器完全免费，无需注册即可使用所有功能。',
  },
  {
    question: '支持哪些 Markdown 语法？',
    answer:
      '支持基础的 Markdown 语法，包括标题、粗体、斜体、列表、引用等常用格式。',
  },
  {
    question: '生成的图片可以商用吗？',
    answer: '可以，生成的图片完全属于您，可自由用于个人或商业用途。',
  },
  {
    question: '图片会保存到服务器吗？',
    answer:
      '不会，本工具为纯前端实现，所有图片生成都在浏览器本地完成，不会存储任何用户信息。',
  },
  {
    question: '支持批量导出吗？',
    answer: '支持，当内容较长时会自动分页，可以一键批量导出所有图片。',
  },
  {
    question: '支持哪些图片格式？',
    answer: '目前支持导出 PNG 格式的高清图片，适合在各类社交媒体平台分享。',
  },
  {
    question: '可以自定义图片样式吗？',
    answer:
      '可以，您可以自定义背景颜色、字体大小、内边距等样式，也可以选择预设的样式模板快速开始。',
  },
  {
    question: '手机上可以使用吗？',
    answer:
      '可以，本工具采用响应式设计，支持在手机、平板等移动设备上使用，但建议在电脑上使用以获得最佳体验。',
  },
];

// 生成 Schema.org FAQPage 结构化数据
export function generateFAQStructuredData(faqs: FAQItem[] = faqData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
