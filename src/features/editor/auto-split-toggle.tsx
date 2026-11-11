/** biome-ignore-all lint/performance/noJsxPropsBind: React Compiler caches event handlers. */
"use client";

import { Scissor01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tooltip } from "@/components/tooltip";
import { cn } from "@/lib/utils";
import { usePaginationStore } from "@/store/pagination";

/**
 * 自动拆分开关，紧挨着「分割线 ---」：一个手动分页，一个自动分页。
 * 开启时按钮呈凸起的选中态，放不下的内容自动续到下一张。
 */
export const AutoSplitToggle = () => {
  const { autoSplit, setAutoSplit } = usePaginationStore();

  return (
    <Tooltip
      content={
        autoSplit ? "自动拆分：已开启" : "自动拆分：放不下的内容续到下一张"
      }
    >
      <button
        aria-label="自动拆分"
        aria-pressed={autoSplit}
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-[10px] transition-colors duration-150 ease-out",
          autoSplit
            ? "ds-chip-on text-ink"
            : "text-ink-2 hover:bg-[var(--ds-well)] hover:text-ink"
        )}
        onClick={() => setAutoSplit(!autoSplit)}
        type="button"
      >
        <HugeiconsIcon className="size-4" icon={Scissor01Icon} />
      </button>
    </Tooltip>
  );
};
