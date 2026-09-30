import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { TWITTER_LINK } from "@/lib/contact";
import { faqData, generateFAQStructuredData } from "@/lib/faq-data";
import {
  generateBreadcrumbStructuredData,
  generatePageMetadata,
} from "@/lib/seo-config";

export const metadata = generatePageMetadata(
  "常见问题",
  "小红书图片生成器常见问题：是否免费、图片能否商用、图片存在哪里、远程图片导入失败怎么办、支持哪些导出格式。",
  "/faq"
);

const linkClassName = "font-semibold text-ink underline underline-offset-4";

const FAQPage = () => (
  <PageShell
    description="关于小红书图片生成器的常见问题解答，帮助您快速上手使用。"
    title="常见问题"
  >
    <JsonLd data={generateFAQStructuredData()} />
    <JsonLd data={generateBreadcrumbStructuredData("常见问题", "/faq")} />

    <div className="space-y-3">
      {faqData.map((faq) => (
        <section className="ds-panel px-5 py-4" key={faq.question}>
          <h2 className="font-semibold text-[15px] text-ink">{faq.question}</h2>
          <p className="mt-1.5 text-[13.5px] text-ink-2 leading-[1.75]">
            {faq.answer}
          </p>
        </section>
      ))}
    </div>

    <div className="ds-well mt-6 rounded-[20px] px-5 py-4 text-center">
      <h2 className="font-semibold text-[15px] text-ink">还有其他问题？</h2>
      <p className="mt-1.5 text-[13.5px] text-ink-2">
        欢迎在{" "}
        <a
          className={linkClassName}
          href="https://github.com/simonwong/redbook-text2img/issues"
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub Issues
        </a>{" "}
        中提出，或联系作者{" "}
        <a
          className={linkClassName}
          href={TWITTER_LINK}
          rel="noopener noreferrer"
          target="_blank"
        >
          @simonwongio
        </a>
        。
      </p>
    </div>
  </PageShell>
);

export default FAQPage;
