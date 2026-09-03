"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type RefObject, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { ConfiguratorContent } from "./configurator-content";

interface SettingsDrawerProps {
  direction?: "bottom" | "right";
  onOpenChange: (open: boolean) => void;
  open: boolean;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

export const SettingsDrawer = ({
  direction = "bottom",
  onOpenChange,
  open,
  returnFocusRef,
}: SettingsDrawerProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement>(null);

  return (
    <Drawer direction={direction} onOpenChange={onOpenChange} open={open}>
      <DrawerContent
        className={cn(
          direction === "right" && "w-[min(380px,calc(100vw-1rem))]"
        )}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          (returnFocusRef?.current ?? previousFocusRef.current)?.focus();
        }}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          previousFocusRef.current =
            document.activeElement instanceof HTMLElement
              ? document.activeElement
              : null;
          closeButtonRef.current?.focus();
        }}
      >
        <DrawerHeader className="flex-row items-center justify-between px-4 pt-2.5 pb-1.5 text-left">
          <div>
            <DrawerTitle className="font-bold text-[13px] text-ink">
              样式设置
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              选择主题并调整图片样式
            </DrawerDescription>
          </div>
          <Button
            aria-label="关闭样式设置"
            className="size-11"
            onClick={() => onOpenChange(false)}
            ref={closeButtonRef}
            size="icon"
            variant="ghost"
          >
            <HugeiconsIcon className="size-[13px]" icon={Cancel01Icon} />
          </Button>
        </DrawerHeader>
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto px-4",
            direction === "bottom"
              ? "pb-[max(2rem,env(safe-area-inset-bottom))]"
              : "pb-4"
          )}
        >
          <ConfiguratorContent />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
