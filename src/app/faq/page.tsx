import { faqData } from '@/lib/faq-data';
import { generatePageMetadata } from '@/lib/seo-config';

export const metadata = generatePageMetadata(
  '常见问题',
  '小红书图片生成器常见问题解答 - 了解如何使用、是否免费、隐私保护等',
  '/faq'
);

const FAQPage = () => {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl text-gray-900">常见问题</h1>
        <p className="text-gray-600">
          关于小红书图片生成器的常见问题解答，帮助您快速上手使用。
        </p>
      </div>

      <div className="space-y-6">
        {faqData.map((faq, index) => (
          <div
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            key={index}
          >
            <h2 className="mb-3 font-semibold text-gray-900 text-lg">
              {faq.question}
            </h2>
            <p className="leading-relaxed text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-lg bg-gray-100 p-6 text-center">
        <h2 className="mb-2 font-semibold text-gray-900 text-lg">
          还有其他问题？
        </h2>
        <p className="text-gray-600">
          欢迎在{' '}
          <a
            className="text-pink-500 underline hover:text-pink-600"
            href="https://github.com/simonwong/redbook-text2img/issues"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub Issues
          </a>{' '}
          中提出您的问题或建议。
        </p>
      </div>
    </div>
  );
};

export default FAQPage;
