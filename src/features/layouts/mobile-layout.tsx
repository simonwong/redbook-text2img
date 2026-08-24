"use client";

import { Album02Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type AnimationEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ConfiguratorContent } from "@/features/configurator/configurator-content";
import { EditorCard } from "@/features/editor";
import { PreviewCard } from "@/features/preview";
import { useSettingsPanelStore } from "@/store/theme";

export const MobileLayout = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [settingsPending, setSettingsPending] = useState(false);
  const { isOpen: settingsOpen, setIsOpen: setSettingsOpen } =
    useSettingsPanelStore();

  const handlePreviewAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (
      event.target !== event.currentTarget ||
      previewOpen ||
      !settingsPending
    ) {
      return;
    }
    setSettingsPending(false);
    setSettingsOpen(true);
  };

  const handleOpenSettings = () => {
    setSettingsPending(true);
    setPreviewOpen(false);
  };

  return (
    <div className="flex h-full flex-col">
      <EditorCard className="flex-1 [&_.cm-scroller]:pb-16" />

      <button
        aria-label="预览图片"
        className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-20 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95"
        onClick={() => setPreviewOpen(true)}
        type="button"
      >
        <HugeiconsIcon className="h-5 w-5" icon={Album02Icon} />
      </button>

      <Drawer onOpenChange={setPreviewOpen} open={previewOpen}>
        <DrawerContent
          className="min-h-[85vh]"
          onAnimationEnd={handlePreviewAnimationEnd}
        >
          <DrawerHeader>
            <DrawerTitle className="sr-only">图片预览</DrawerTitle>
            <DrawerDescription className="sr-only">
              预览并导出分页图片
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto overflow-x-hidden pb-[max(1rem,env(safe-area-inset-bottom))]">
            <PreviewCard onOpenSettings={handleOpenSettings} />
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer onOpenChange={setSettingsOpen} open={settingsOpen}>
        <DrawerContent>
          <DrawerHeader className="flex-row items-center justify-between text-left">
            <div>
              <DrawerTitle>样式设置</DrawerTitle>
              <DrawerDescription className="sr-only">
                选择主题并调整图片样式
              </DrawerDescription>
            </div>
            <Button
              aria-label="关闭样式设置"
              autoFocus
              className="size-11"
              onClick={() => setSettingsOpen(false)}
              size="icon"
              variant="ghost"
            >
              <HugeiconsIcon icon={Cancel01Icon} />
            </Button>
          </DrawerHeader>
          <div className="overflow-auto px-4 pb-[max(2rem,env(safe-area-inset-bottom))]">
            <ConfiguratorContent />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
