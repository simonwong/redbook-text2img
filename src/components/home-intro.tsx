import Link from "next/link";

const sectionClassName = "ds-panel px-5 py-4";
const headingClassName = "font-semibold text-[15px] text-ink";
const bodyClassName = "mt-1.5 text-[13.5px] text-ink-2 leading-[1.75]";

/**
 * 首页工具区下方的可见介绍，向下滚动才看到，不占工具的满屏空间。
 * 内容必须与工具的实际能力一致：只写已经支持的功能，不堆关键词。
 */
export const HomeIntro = () => (
  <section
    aria-labelledby="home-intro-title"
    className="mx-auto w-full max-w-3xl px-1 pt-10 pb-12 sm:px-4"
  >
    <header className="mb-6 px-1">
      <h1
        className="font-bold text-[22px] text-ink tracking-[-0.02em]"
        id="home-intro-title"
      >
        小红书图片生成器：文字转图片，在线生成小红书图文
      </h1>
      <p className="mt-1.5 text-[14px] text-ink-2 leading-[1.75]">
        把文字或 Markdown
        粘贴进编辑器，自动分页生成一组小红书图文卡片，也适用于小绿书和公众号配图。免费使用，无需注册，内容和图片只保存在你的浏览器里。
      </p>
    </header>

    <div className="space-y-3">
      <section className={sectionClassName}>
        <h2 className={headingClassName}>
          小红书图文生成：一段文字拆成多张卡片
        </h2>
        <p className={bodyClassName}>
          用分割线 ---
          把内容分成多页，每页导出一张图片。内容超出卡片时，预览会标出截断位置，提醒你再分一页。卡片比例可选
          3:4、1:1 和 9:16。
        </p>
      </section>

      <section className={sectionClassName}>
        <h2 className={headingClassName}>
          小红书封面生成器：一级标题自动成为封面
        </h2>
        <p className={bodyClassName}>
          写有一级标题（#
          标题）的那一页会自动排成封面，标题上方还可以放一张配图。导出时可以加上署名和页码。
        </p>
      </section>

      <section className={sectionClassName}>
        <h2 className={headingClassName}>8 个主题，调好的样式可以保存</h2>
        <p className={bodyClassName}>
          内置 8
          个主题，可以继续调整背景、字体、密度、强调色和配图外观。调好的样式能另存为自定义主题，下次直接套用。
        </p>
      </section>

      <section className={sectionClassName}>
        <h2 className={headingClassName}>三步做好一组小红书图片</h2>
        <ol className={`${bodyClassName} list-decimal space-y-0.5 pl-5`}>
          <li>在编辑器里输入或粘贴文字，也可以从内容模板开始改</li>
          <li>选一个主题，按需要调整样式</li>
          <li>导出当前图片，或把全部图片打包成 ZIP 下载</li>
        </ol>
      </section>
    </div>

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
  </section>
);
