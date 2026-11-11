import Link from "next/link";
import { HomeIntroCoverFigure } from "./home-intro-cover-figure";
import { HomeIntroSplitFigure } from "./home-intro-split-figure";
import { HomeIntroThemeFigure } from "./home-intro-theme-figure";

const cardClassName = "ds-panel flex flex-col p-3";
const figureClassName =
  "ds-well-inset flex h-40 items-center justify-center overflow-hidden rounded-[14px]";
const headingClassName = "text-pretty font-semibold text-[15px] text-ink";
const bodyClassName =
  "mt-1.5 text-pretty text-[13.5px] text-ink-2 leading-[1.75]";

const steps = [
  "在编辑器里输入或粘贴文字，也可以从内容模板开始改",
  "选一个主题，按需要调整样式",
  "导出当前图片，或把全部图片打包成 ZIP 下载",
];

export const HOME_INTRO_TITLE_ID = "home-intro-title";

/**
 * 首页的使用说明，放在顶栏「使用说明」打开的弹窗里（见 HomeGuideDialog），不占工具的满屏空间。
 * 它是工具的附注而不是开场：标题与常见问题、关于页同级，不做大标题。
 * 内容必须与工具的实际能力一致：只写已经支持的功能，不堆关键词。
 */
export const HomeIntro = () => (
  <div className="px-4 pt-6 pb-7 sm:px-7 sm:pt-7">
    <header className="mb-5 px-1 pr-10">
      {/* 服务端 HTML 里唯一的一级标题：工具本身是客户端渲染的，没有它页面就没有 h1 */}
      <h1
        className="font-bold text-[20px] text-ink tracking-[-0.02em]"
        id={HOME_INTRO_TITLE_ID}
      >
        小红书图片生成器：文字转图片，在线生成小红书图文
      </h1>
      <p className="mt-1.5 max-w-2xl text-pretty text-[14px] text-ink-2 leading-[1.75]">
        把文字或 Markdown
        粘贴进编辑器，自动分页生成一组小红书图文卡片，也适用于小绿书和公众号配图。免费使用，无需注册，内容和图片只保存在你的浏览器里。
      </p>
    </header>

    <div className="grid gap-3 lg:grid-cols-3">
      <section className={cardClassName}>
        <div className={figureClassName}>
          <HomeIntroSplitFigure />
        </div>
        <div className="px-2 pt-4 pb-2">
          <h2 className={headingClassName}>
            小红书图文生成：一段文字拆成多张卡片
          </h2>
          <p className={bodyClassName}>
            用分割线 ---
            把内容分成多页，每页导出一张图片。内容超出卡片时，预览会标出截断位置；开启自动拆分，放不下的内容会自动续到下一张。卡片比例可选
            3:4、1:1 和 9:16。
          </p>
        </div>
      </section>

      <section className={cardClassName}>
        <div className={figureClassName}>
          <HomeIntroCoverFigure />
        </div>
        <div className="px-2 pt-4 pb-2">
          <h2 className={headingClassName}>
            小红书封面生成器：一级标题自动成为封面
          </h2>
          <p className={bodyClassName}>
            写有一级标题（#
            标题）的那一页会自动排成封面，标题上方还可以放一张配图。导出时可以加上署名和页码。
          </p>
        </div>
      </section>

      <section className={cardClassName}>
        <div className={figureClassName}>
          <HomeIntroThemeFigure />
        </div>
        <div className="px-2 pt-4 pb-2">
          <h2 className={headingClassName}>8 个主题，调好的样式可以保存</h2>
          <p className={bodyClassName}>
            内置 8
            个主题，可以继续调整背景、字体、密度、强调色和配图外观。调好的样式能另存为自定义主题，下次直接套用。
          </p>
        </div>
      </section>
    </div>

    <section className="ds-panel mt-3 px-5 py-5">
      <h2 className={headingClassName}>三步做好一组小红书图片</h2>
      <ol className="mt-4 grid gap-3 sm:grid-cols-3 sm:gap-5">
        {steps.map((step, index) => (
          <li className="flex items-start gap-3" key={step}>
            <span
              aria-hidden="true"
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-ink font-semibold text-[12px] text-[var(--ds-on-ink)]"
            >
              {index + 1}
            </span>
            <span className="text-pretty text-[13.5px] text-ink-2 leading-[1.75]">
              {step}
            </span>
          </li>
        ))}
      </ol>
    </section>

    <p className="mt-6 px-1 text-[13.5px] text-ink-2">
      还有疑问？看看
      <Link
        className="font-semibold text-ink underline underline-offset-4"
        href="/faq"
      >
        常见问题
      </Link>
      。
    </p>
  </div>
);
