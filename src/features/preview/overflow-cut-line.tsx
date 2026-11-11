"use client";

import { Alert02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface OverflowCutLineProps {
  /** 给出时在提示旁显示「开启自动拆分」按钮；已开启自动拆分仍放不下时不给 */
  onAutoSplit?: () => void;
  /** 裁切边到卡片顶边的距离，卡片逻辑像素 */
  top: number;
}

/**
 * 内容溢出时画在预览卡片上的裁切线：一条琥珀色虚线贴着内容区底边（导出到此为止），
 * 线上挂一枚小标签说明去向。它位于缩放层内、导出节点之外，随预览一起缩放但绝不进入导出图。
 * 之前是一块盖在卡片底部内容上的警告条，既遮内容也说不清从哪里开始截断。
 */
export const OverflowCutLine = ({ onAutoSplit, top }: OverflowCutLineProps) => (
  <div
    aria-live="polite"
    className="pointer-events-none absolute inset-x-0 z-10 flex justify-center"
    role="status"
    style={{ top }}
  >
    <div
      aria-hidden="true"
      className="absolute inset-x-3 top-0 border-amber-500/80 border-t-[1.5px] border-dashed"
    />
    <div className="flex -translate-y-1/2 items-center gap-1.5">
      <div className="ds-raised flex h-[22px] items-center gap-1 rounded-full pr-2.5 pl-2 font-semibold text-[10.5px] text-amber-700 dark:text-amber-400">
        <HugeiconsIcon className="size-3 shrink-0" icon={Alert02Icon} />
        <span>以下内容导出时被截断，用 --- 分页</span>
      </div>
      {onAutoSplit ? (
        <button
          className="pointer-events-auto flex h-[22px] items-center rounded-full bg-ink px-2.5 font-semibold text-[10.5px] text-[var(--ds-on-ink)] shadow-[0_2px_6px_-2px_rgba(17,17,20,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
          onClick={onAutoSplit}
          type="button"
        >
          开启自动拆分
        </button>
      ) : null}
    </div>
  </div>
);
