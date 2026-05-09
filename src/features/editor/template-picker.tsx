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
        <PopoverTrigger className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-95">
          <HugeiconsIcon className="h-3.5 w-3.5" icon={NoteIcon} />
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent align="start" className="w-64 p-2" side="bottom">
        <div className="mb-1 px-2 pt-1 font-medium text-muted-foreground text-xs">
          选择模板
        </div>
        <div className="flex flex-col">
          {templates.map((t) => (
            <button
              className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-accent"
              key={t.id}
              onClick={() => handleSelect(t)}
              type="button"
            >
              <span className="text-base">{t.emoji}</span>
              <div className="min-w-0">
                <div className="font-medium text-sm">{t.name}</div>
                <div className="text-muted-foreground text-xs">
                  {t.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
