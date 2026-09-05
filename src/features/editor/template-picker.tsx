"use client";

import { NoteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Tooltip } from "@/components/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type Template, templates } from "@/lib/templates";
import { useMarkdownContentStore } from "@/store/markdownContent";

export const TemplatePicker = () => {
  const { setContent } = useMarkdownContentStore();
  const [open, setOpen] = useState(false);

  const handleSelect = (template: Template) => {
    setContent(template.content);
    setOpen(false);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <Tooltip content="模板">
        <PopoverTrigger
          aria-label="模板"
          className="flex size-8 shrink-0 items-center justify-center rounded-[10px] text-ink-2 transition-colors duration-150 ease-out hover:bg-[var(--ds-well)] hover:text-ink aria-expanded:bg-[var(--ds-chip-bg)] aria-expanded:text-ink aria-expanded:shadow-[var(--ds-sh-chip)]"
        >
          <HugeiconsIcon className="size-4" icon={NoteIcon} />
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent align="start" className="w-64 gap-1 p-1.5" side="bottom">
        <div className="px-2 pt-1 pb-0.5 font-semibold text-[11px] text-ink-3">
          选择模板
        </div>
        <div className="flex flex-col">
          {templates.map((t) => (
            <button
              className="flex items-center gap-2.5 rounded-[10px] px-[9px] py-[7px] text-left transition-colors duration-150 ease-out hover:bg-[var(--ds-well)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
              key={t.id}
              onClick={() => handleSelect(t)}
              type="button"
            >
              <span className="text-[15px] leading-none">{t.emoji}</span>
              <span className="flex min-w-0 flex-col gap-px">
                <span className="font-semibold text-[12.5px] text-ink">
                  {t.name}
                </span>
                <span className="text-[11px] text-ink-3">{t.description}</span>
              </span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
