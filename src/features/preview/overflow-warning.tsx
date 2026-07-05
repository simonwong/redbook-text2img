"use client";

import { Alert02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export const OverflowWarning = () => (
  <div className="flex w-full max-w-[375px] items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-amber-700 text-xs dark:border-amber-400/30 dark:text-amber-400">
    <HugeiconsIcon className="h-4 w-4 shrink-0" icon={Alert02Icon} />
    <span>内容超出卡片，导出将被截断，请在编辑器中用 --- 分页</span>
  </div>
);
