/** biome-ignore-all lint/performance/noJsxPropsBind: Each close action identifies its notice. */
"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createPortal } from "react-dom";
import { dismissImageNotice, useImageNotices } from "./image-notices";

export function ImageNoticeBanner() {
  const notices = useImageNotices((state) => state.notices);
  return createPortal(
    <div className="pointer-events-none fixed top-20 right-4 left-4 z-[100] flex flex-col gap-2 md:left-auto md:max-w-sm">
      {notices.map((notice) => (
        <div
          className="pointer-events-auto flex items-start gap-2 rounded-lg border bg-background p-3 text-sm shadow-md"
          key={notice.id}
          role={notice.role}
        >
          <span className="min-w-0 flex-1 break-words">{notice.message}</span>
          <button
            aria-label="关闭提示"
            className="shrink-0 p-1"
            onClick={() => dismissImageNotice(notice.id)}
            type="button"
          >
            <HugeiconsIcon className="size-4" icon={Cancel01Icon} />
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}
