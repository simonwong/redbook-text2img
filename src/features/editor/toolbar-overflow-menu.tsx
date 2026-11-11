/** biome-ignore-all lint/performance/noJsxPropsBind: React Compiler caches event handlers. */
"use client";

import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { useState } from "react";
import { Tooltip } from "@/components/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ToolbarOverflowItem {
  icon: IconSvgElement;
  label: string;
  onClick: () => void;
}

interface ToolbarOverflowMenuProps {
  items: ToolbarOverflowItem[];
}

/** 工具栏放不下的格式按钮收在这里，每项带文字，点完自动收起 */
export const ToolbarOverflowMenu = ({ items }: ToolbarOverflowMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <Tooltip content="更多格式">
        <PopoverTrigger
          aria-label="更多格式"
          className="flex size-8 shrink-0 items-center justify-center rounded-[10px] text-ink-2 transition-colors duration-150 ease-out hover:bg-[var(--ds-well)] hover:text-ink aria-expanded:bg-[var(--ds-chip-bg)] aria-expanded:text-ink aria-expanded:shadow-[var(--ds-sh-chip)]"
        >
          <HugeiconsIcon className="size-4" icon={MoreHorizontalIcon} />
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent align="end" className="w-40 gap-0 p-1.5" side="bottom">
        {items.map((item) => (
          <button
            className="flex items-center gap-2.5 rounded-[10px] px-[9px] py-[7px] text-left font-medium text-[12.5px] text-ink transition-colors duration-150 ease-out hover:bg-[var(--ds-well)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
            key={item.label}
            onClick={() => {
              item.onClick();
              setOpen(false);
            }}
            type="button"
          >
            <HugeiconsIcon
              className="size-4 shrink-0 text-ink-2"
              icon={item.icon}
            />
            {item.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};
