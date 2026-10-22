import Link from "next/link";
import { ExternalTextLink } from "@/components/external-text-link";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import {
  GITHUB_LINK,
  MOONUNDER_LINK,
  PERSONAL_SITE_LINK,
  REPOSITORY_LINK,
  TWITTER_LINK,
  XIAO_HONG_SHU_LINK,
} from "@/lib/contact";
import {
  aboutPageStructuredData,
  generateBreadcrumbStructuredData,
  generatePageMetadata,
} from "@/lib/seo-config";
import packageJson from "../../../package.json";

export const metadata = generatePageMetadata(
  "关于",
  "小红书图片生成器由独立开发者 Simon Wong 开发和维护，免费、开源，无需注册，内容只保存在浏览器本地。",
  "/about"
);

const linkClassName = "font-semibold text-ink underline underline-offset-4";
const sectionClassName = "ds-panel px-5 py-4";
const headingClassName = "font-semibold text-[15px] text-ink";
const bodyClassName = "mt-1.5 text-[13.5px] text-ink-2 leading-[1.75]";

const AboutPage = () => (
  <PageShell
    description="这个工具是什么、由谁维护，以及怎么联系作者。"
    title="关于"
  >
    <JsonLd data={aboutPageStructuredData} />
    <JsonLd data={generateBreadcrumbStructuredData("关于", "/about")} />

    <div className="space-y-3">
      <section className={sectionClassName}>
        <h2 className={headingClassName}>这个工具做什么</h2>
        <p className={bodyClassName}>
          小红书图片生成器把文字或 Markdown
          转成小红书、小绿书、公众号风格的图片。用分割线把内容拆成多张卡片，选一个主题，就能导出高清
          PNG。工具免费，不需要注册，写的内容和插入的图片都保存在你自己的浏览器里。
        </p>
      </section>

      <section className={sectionClassName}>
        <h2 className={headingClassName}>为什么做</h2>
        <p className={bodyClassName}>
          我平时用 Markdown
          记笔记，想发到小红书时，把文字排成好看的图片很费时间。现有的工具要么功能太多，要么主题不好看，所以自己做了一个，主题都是一张张调出来的。
        </p>
      </section>

      <section className={sectionClassName}>
        <h2 className={headingClassName}>谁在维护</h2>
        <p className={bodyClassName}>
          我是 Simon
          Wong，一名独立开发者，这个网站由我一个人开发和维护。我也在运营独立工作室{" "}
          <ExternalTextLink href={MOONUNDER_LINK}>MoonUnder</ExternalTextLink>
          ，做小而安静的应用，比如白噪音应用 Rainside 听雨。更多介绍见我的
          <ExternalTextLink href={PERSONAL_SITE_LINK}>
            个人网站
          </ExternalTextLink>
          。
        </p>
      </section>

      <section className={sectionClassName}>
        <h2 className={headingClassName}>开源与数据</h2>
        <p className={bodyClassName}>
          项目代码在{" "}
          <ExternalTextLink href={REPOSITORY_LINK}>GitHub</ExternalTextLink>{" "}
          公开，当前版本 v{packageJson.version}，改动记录见
          <Link className={linkClassName} href="/changelog">
            更新日志
          </Link>
          。哪些数据保存在本地、哪些请求会经过服务器、用了哪些统计服务，写在
          <Link className={linkClassName} href="/privacy">
            隐私说明
          </Link>
          里。
        </p>
      </section>
    </div>

    <div className="ds-well mt-6 rounded-[20px] px-5 py-4 text-center">
      <h2 className={headingClassName}>联系我</h2>
      <p className="mt-1.5 text-[13.5px] text-ink-2 leading-[1.75]">
        问题和建议可以提到{" "}
        <ExternalTextLink href={`${REPOSITORY_LINK}/issues`}>
          GitHub Issues
        </ExternalTextLink>
        ，也可以在 <ExternalTextLink href={TWITTER_LINK}>X</ExternalTextLink>、
        <ExternalTextLink href={XIAO_HONG_SHU_LINK}>小红书</ExternalTextLink> 或{" "}
        <ExternalTextLink href={GITHUB_LINK}>GitHub</ExternalTextLink> 找到我。
      </p>
    </div>
  </PageShell>
);

export default AboutPage;
