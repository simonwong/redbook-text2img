import { HomeIntroFigureArrow } from "./home-intro-figure-arrow";

/** 示意图：一级标题排成带配图的封面 */
export const HomeIntroCoverFigure = () => (
  <div aria-hidden="true" className="flex items-center gap-3">
    <span className="ds-raised rounded-full px-3 py-1.5 font-mono font-semibold text-[12px] text-ink">
      <span className="text-brand"># </span>
      标题
    </span>

    <HomeIntroFigureArrow />

    <div className="ds-raised flex aspect-[3/4] w-[84px] flex-col rounded-[8px] p-2">
      <div className="h-10 rounded-[5px] bg-gradient-to-br from-[#ffd9a8] via-[#ffd5dc] to-[#dcd2ff]" />
      <div className="mt-2.5 space-y-1">
        <div className="h-[6px] w-full rounded-full bg-ink" />
        <div className="h-[6px] w-3/5 rounded-full bg-ink" />
      </div>
      <div className="mt-2 h-[3px] w-2/5 rounded-full bg-ink/25" />
    </div>
  </div>
);
