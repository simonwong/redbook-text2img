import { HomeIntroFigureArrow } from "./home-intro-figure-arrow";

const lineClassName = "h-[3px] rounded-full bg-ink/15";
const dividerClassName = "border-brand/70 border-t border-dashed";
const pages = ["1", "2", "3"];

/** 示意图：一篇带分割线的文字拆成三张卡片 */
export const HomeIntroSplitFigure = () => (
  <div aria-hidden="true" className="flex items-center gap-3">
    <div className="ds-raised flex h-28 w-14 flex-col justify-between rounded-[8px] px-2 py-2.5">
      <div className="space-y-1">
        <div className={`${lineClassName} w-full`} />
        <div className={`${lineClassName} w-2/3`} />
      </div>
      <div className={dividerClassName} />
      <div className="space-y-1">
        <div className={`${lineClassName} w-full`} />
        <div className={`${lineClassName} w-4/5`} />
      </div>
      <div className={dividerClassName} />
      <div className="space-y-1">
        <div className={`${lineClassName} w-full`} />
        <div className={`${lineClassName} w-1/2`} />
      </div>
    </div>

    <HomeIntroFigureArrow />

    <div className="flex gap-1.5">
      {pages.map((page) => (
        <div
          className="ds-raised flex aspect-[3/4] w-11 flex-col rounded-[6px] p-1.5"
          key={page}
        >
          <div className="h-[4px] w-3/4 rounded-full bg-ink/60" />
          <div className="mt-1.5 space-y-1">
            <div className={`${lineClassName} w-full`} />
            <div className={`${lineClassName} w-full`} />
            <div className={`${lineClassName} w-2/3`} />
          </div>
          <span className="mt-auto text-center font-semibold text-[8px] text-ink-3 leading-none">
            {page}
          </span>
        </div>
      ))}
    </div>
  </div>
);
