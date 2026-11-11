import { type RefObject, useLayoutEffect, useState } from "react";

/** 工具栏按自身宽度分的三档：宽度不够时，次要按钮收进「更多」 */
export type ToolbarTier = "full" | "medium" | "narrow";

const tierRank: Record<ToolbarTier, number> = { full: 2, medium: 1, narrow: 0 };

/** 完整一排（11 个格式按钮 + 分隔线 + 右侧文档操作）需要的宽度 */
const FULL_MIN_WIDTH = 600;
/** 7 个常用按钮 +「更多」+ 右侧文档操作需要的宽度 */
const MEDIUM_MIN_WIDTH = 450;

const tierOf = (width: number): ToolbarTier => {
  // 还没量到宽度（服务端渲染、首帧）时按完整一排处理
  if (width <= 0 || width >= FULL_MIN_WIDTH) {
    return "full";
  }
  return width >= MEDIUM_MIN_WIDTH ? "medium" : "narrow";
};

/** 某个按钮在当前档位下是否直接显示在工具栏上 */
export const isVisibleAt = (visibleFrom: ToolbarTier, tier: ToolbarTier) =>
  tierRank[tier] >= tierRank[visibleFrom];

/** 跟随工具栏自身宽度（而不是视口宽度）给出档位：编辑器面板在桌面端也会被挤窄 */
export function useToolbarTier(
  ref: RefObject<HTMLElement | null>
): ToolbarTier {
  const [tier, setTier] = useState<ToolbarTier>("full");

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    setTier(tierOf(element.clientWidth));
    const observer = new ResizeObserver(() =>
      setTier(tierOf(element.clientWidth))
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return tier;
}
