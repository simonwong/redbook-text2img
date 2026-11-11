"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type ReactNode, useEffect, useRef } from "react";

/** 打开使用说明的地址片段：顶栏入口是普通链接 `/#guide`，任何页面都能直达 */
const GUIDE_HASH = "#guide";

interface HomeGuideDialogProps {
  children: ReactNode;
  labelledBy: string;
}

/**
 * 首页使用说明的弹窗外壳。内容由服务端渲染在原生 dialog 里，默认收起、不占页面高度，
 * 但始终在 HTML 中：用户从顶栏点开就能看到，搜索引擎也读得到，不是隐藏文字。
 * 开关跟随地址片段，所以入口不需要和这里共享状态。
 */
export const HomeGuideDialog = ({
  children,
  labelledBy,
}: HomeGuideDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    // biome-ignore lint/suspicious/noUnnecessaryConditions: React 可能在卸载时先清空 ref
    if (!dialog) {
      return;
    }
    const sync = () => {
      const shouldOpen = window.location.hash === GUIDE_HASH;
      if (shouldOpen && !dialog.open) {
        dialog.showModal();
      } else if (!shouldOpen && dialog.open) {
        dialog.close();
      }
    };
    // 关闭后把地址片段去掉，再点入口才能重新触发
    const clearHash = () => {
      if (window.location.hash === GUIDE_HASH) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search
        );
      }
    };
    // 点在遮罩上（事件目标是 dialog 本身）时关闭；键盘用户用 Esc 或关闭按钮
    const closeOnBackdrop = (event: MouseEvent) => {
      if (event.target === dialog) {
        dialog.close();
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    dialog.addEventListener("close", clearHash);
    dialog.addEventListener("click", closeOnBackdrop);
    return () => {
      window.removeEventListener("hashchange", sync);
      dialog.removeEventListener("close", clearHash);
      dialog.removeEventListener("click", closeOnBackdrop);
    };
  }, []);

  return (
    <dialog
      aria-labelledby={labelledBy}
      className="m-auto max-h-[min(88dvh,780px)] w-[min(960px,calc(100vw-24px))] overflow-y-auto rounded-[24px] bg-ground p-0 text-ink shadow-[var(--ds-sh-pop)] backdrop:bg-black/30 backdrop:backdrop-blur-[2px]"
      ref={dialogRef}
    >
      <form className="sticky top-0 z-10 flex h-0 justify-end" method="dialog">
        <button
          aria-label="关闭使用说明"
          className="ds-raised mt-3 mr-3 flex size-8 shrink-0 items-center justify-center rounded-full text-ink-2 transition-colors duration-150 ease-out hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
          type="submit"
        >
          <HugeiconsIcon className="size-[14px]" icon={Cancel01Icon} />
        </button>
      </form>
      {children}
    </dialog>
  );
};
