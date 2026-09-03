"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useContentThemeStore } from "@/store/theme";

interface DeleteThemePopoverProps {
  themeId: string;
  themeName: string;
}

/** 删除当前自定义主题，二次确认在弹层内完成 */
export const DeleteThemePopover = ({
  themeId,
  themeName,
}: DeleteThemePopoverProps) => {
  const { deleteCustomTheme } = useContentThemeStore();
  const [open, setOpen] = useState(false);

  const cancel = () => setOpen(false);
  const confirm = () => {
    deleteCustomTheme(themeId);
    setOpen(false);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        className={cn(
          buttonVariants({ size: "sm", variant: "ghost" }),
          "text-destructive hover:bg-destructive/10 hover:text-destructive"
        )}
      >
        删除
      </PopoverTrigger>
      <PopoverContent
        align="end"
        aria-label="删除主题"
        className="w-[248px] gap-3"
        side="top"
        sideOffset={8}
      >
        <p className="text-[13px] text-ink">删除主题「{themeName}」？</p>
        <div className="flex justify-end gap-2">
          <Button onClick={cancel} size="sm" variant="ghost">
            取消
          </Button>
          <Button
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={confirm}
            size="sm"
            variant="ghost"
          >
            删除
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
