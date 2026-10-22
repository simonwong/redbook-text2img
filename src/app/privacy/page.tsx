import { ExternalTextLink } from "@/components/external-text-link";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { REPOSITORY_LINK, TWITTER_LINK } from "@/lib/contact";
import {
  generateBreadcrumbStructuredData,
  generatePageMetadata,
} from "@/lib/seo-config";

export const metadata = generatePageMetadata(
  "隐私说明",
  "小红书图片生成器不需要注册，文字和图片保存在浏览器本地。本页说明哪些数据存在本地、哪些请求会经过服务器，以及使用了哪些统计服务。",
  "/privacy"
);

const updatedAt = "2026-10-23";

const sectionClassName = "ds-panel px-5 py-4";
const headingClassName = "font-semibold text-[15px] text-ink";
const bodyClassName = "mt-1.5 text-[13.5px] text-ink-2 leading-[1.75]";
const listClassName =
  "mt-1.5 list-disc space-y-1 pl-5 text-[13.5px] text-ink-2 leading-[1.75]";

const PrivacyPage = () => (
  <PageShell
    description={`这个工具不需要注册，你写的文字和插入的图片保存在自己的浏览器里，不会上传到服务器。最后更新：${updatedAt}`}
    title="隐私说明"
  >
    <JsonLd data={generateBreadcrumbStructuredData("隐私说明", "/privacy")} />

    <div className="space-y-3">
      <section className={sectionClassName}>
        <h2 className={headingClassName}>保存在浏览器本地的数据</h2>
        <ul className={listClassName}>
          <li>编辑器里的正文内容</li>
          <li>主题选择、样式设置、自定义主题，以及上传的背景图</li>
          <li>署名和页码设置</li>
          <li>插入正文的图片，存放在浏览器的本地图片库（IndexedDB）中</li>
        </ul>
        <p className={bodyClassName}>
          这些数据只在当前浏览器里，不会同步到其他设备。排版预览和 PNG
          导出也都在浏览器中完成。
        </p>
      </section>

      <section className={sectionClassName}>
        <h2 className={headingClassName}>会经过服务器的情况</h2>
        <p className={bodyClassName}>
          只有通过远程链接导入图片时可能经过服务器：浏览器先直接下载图片，下载不了时由本站服务器代为获取并传回浏览器。服务器不保存图片。为防止代理被滥用，服务器会在内存中按
          IP 统计一分钟内的请求次数，这个计数不写入任何存储。
        </p>
      </section>

      <section className={sectionClassName}>
        <h2 className={headingClassName}>托管与统计服务</h2>
        <ul className={listClassName}>
          <li>网站托管在 Vercel，访问请求会按 Vercel 的规则记录访问日志。</li>
          <li>Vercel Analytics 统计页面访问量，不使用 Cookie。</li>
          <li>
            Google Analytics 统计访问来源和页面浏览，会在浏览器中设置 Cookie。
          </li>
        </ul>
        <p className={bodyClassName}>
          统计数据只用于了解有多少人在用、从哪里来，不包含你写的内容和图片。两家服务的数据处理方式见{" "}
          <ExternalTextLink href="https://vercel.com/legal/privacy-policy">
            Vercel 隐私政策
          </ExternalTextLink>{" "}
          和{" "}
          <ExternalTextLink href="https://policies.google.com/privacy">
            Google 隐私政策
          </ExternalTextLink>
          。不想被统计，可以开启浏览器的跟踪防护或使用屏蔽统计脚本的扩展，工具功能不受影响。
        </p>
      </section>

      <section className={sectionClassName}>
        <h2 className={headingClassName}>如何删除数据</h2>
        <p className={bodyClassName}>
          在浏览器设置里清除本站的站点数据，会删除上面列出的全部本地数据，包括图片。只想释放图片占用的空间，可以在设置面板的「图片」分组中选择「清理未使用图片」。
        </p>
      </section>

      <section className={sectionClassName}>
        <h2 className={headingClassName}>说明变更与联系</h2>
        <p className={bodyClassName}>
          数据处理方式变化时会更新本页和顶部的更新日期。有疑问可以在{" "}
          <ExternalTextLink href={`${REPOSITORY_LINK}/issues`}>
            GitHub Issues
          </ExternalTextLink>{" "}
          提出，或在 <ExternalTextLink href={TWITTER_LINK}>X</ExternalTextLink>{" "}
          上联系我。
        </p>
      </section>
    </div>
  </PageShell>
);

export default PrivacyPage;
