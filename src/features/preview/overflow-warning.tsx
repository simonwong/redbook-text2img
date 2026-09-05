"use client";

import { Alert02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export const OverflowWarning = () => (
  <div className="ds-raised flex items-center gap-2 rounded-[11px] px-3 py-2 text-[11.5px] text-amber-700 dark:text-amber-400">
    <HugeiconsIcon className="size-4 shrink-0" icon={Alert02Icon} />
    <span>内容超出卡片，导出将被截断，用 --- 分页</span>
  </div>
);
