"use client";

import { Album02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRef, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { SettingsDrawer } from "@/features/configurator/settings-drawer";
import { EditorCard } from "@/features/editor";
import { PreviewCard } from "@/features/preview";
import { useSettingsPanelStore } from "@/store/theme";

export const MobileLayout = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [settingsPending, setSettingsPending] = useState(false);
  const previewButtonRef = useRef<HTMLButtonElement>(null);
  const settingsPendingRef = useRef(false);
  const { isOpen: settingsOpen, setIsOpen: setSettingsOpen } =
    useSettingsPanelStore();

  const handlePreviewAnimationEnd = (open: boolean) => {
    if (open || !settingsPendingRef.current) {
      return;
    }
    settingsPendingRef.current = false;
    setSettingsPending(false);
  };

  const handleOpenSettings = () => {
    settingsPendingRef.current = true;
    setSettingsPending(true);
    setSettingsOpen(true);
  };

  return (
    <div className="flex h-full flex-col">
      <EditorCard className="min-h-0 flex-1 [&_.cm-content]:pb-24" />

      <button
        aria-label="预览图片"
        className="fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-20 flex size-12 items-center justify-center rounded-full bg-ink text-[var(--ds-on-ink)] shadow-[0_8px_24px_-8px_rgba(17,17,20,0.5)] transition-colors duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2"
        onClick={() => setPreviewOpen(true)}
        ref={previewButtonRef}
        type="button"
      >
        <HugeiconsIcon className="h-5 w-5" icon={Album02Icon} />
      </button>

      <Drawer
        onAnimationEnd={handlePreviewAnimationEnd}
        onOpenChange={setPreviewOpen}
        open={previewOpen}
      >
        <DrawerContent className="min-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle className="sr-only">图片预览</DrawerTitle>
            <DrawerDescription className="sr-only">
              预览并导出分页图片
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto overflow-x-hidden pb-[max(1rem,env(safe-area-inset-bottom))]">
            <PreviewCard
              closeDrawerOnOpenSettings
              onOpenSettings={handleOpenSettings}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <SettingsDrawer
        onOpenChange={setSettingsOpen}
        open={settingsOpen && !settingsPending}
        returnFocusRef={previewButtonRef}
      />
    </div>
  );
};
