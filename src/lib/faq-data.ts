export interface FAQItem {
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    question: "为什么做这个工具？",
    answer:
      "我平时习惯用 Markdown 记录笔记和想法，但想分享到小红书时，把文字转成好看的图片是件麻烦事。市面上的工具要么功能复杂，要么主题丑陋。所以我自己做了这个工具，每个主题都是精心设计的，希望能帮到有同样需求的朋友。",
  },
  {
    question: "小红书图片生成器是免费的吗？",
    answer: "是的，完全免费，无需注册即可使用所有功能。",
  },
  {
    question: "生成的图片可以商用吗？",
    answer: "可以，生成的图片完全属于您，可自由用于个人或商业用途。",
  },
  {
    question: "图片会保存到服务器吗？",
    answer:
      "不会，本工具为纯前端实现，所有处理都在浏览器本地完成，不会上传或存储任何用户数据。",
  },
  {
    question: "支持哪些图片格式？",
    answer: "目前支持导出 PNG 格式的高清图片，适合在各类社交媒体平台分享。",
  },
  {
    question: "可以自定义图片样式吗？",
    answer:
      "可以，您可以自定义背景颜色、字体大小、内边距等样式，也可以选择预设的主题模板快速开始。",
  },
  {
    question: "是否支持更高级的自定义配置？",
    answer:
      "高级自定义配置正在开发中。如果现有主题不满足需求，或希望尽快支持某些功能，欢迎联系开发者催更！",
  },
];

// 生成 Schema.org FAQPage 结构化数据
export function generateFAQStructuredData(faqs: FAQItem[] = faqData) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
