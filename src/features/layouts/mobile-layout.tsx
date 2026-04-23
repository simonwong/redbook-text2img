"use client";

import { ViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ConfiguratorContent } from "@/features/configurator/configurator-content";
import { EditorCard } from "@/features/editor";
import { PreviewCard } from "@/features/preview";
import { useSettingsPanelStore } from "@/store/theme";

export const MobileLayout = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { isOpen: settingsOpen, setIsOpen: setSettingsOpen } =
    useSettingsPanelStore();

  return (
    <div className="flex h-full flex-col">
      <EditorCard className="flex-1" />

      <button
        className="fixed right-4 bottom-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95"
        onClick={() => setPreviewOpen(true)}
        type="button"
      >
        <HugeiconsIcon className="h-5 w-5" icon={ViewIcon} />
      </button>

      <Drawer onOpenChange={setPreviewOpen} open={previewOpen}>
        <DrawerContent className="h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>图片预览</DrawerTitle>
          </DrawerHeader>
          <div className="flex-1 overflow-auto px-4 pb-4">
            <PreviewCard />
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer onOpenChange={setSettingsOpen} open={settingsOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>设置样式</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8">
            <ConfiguratorContent />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
