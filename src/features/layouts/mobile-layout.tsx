"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ConfiguratorContent } from "@/features/configurator/configurator-content";
import { EditorCard } from "@/features/editor";
import { PreviewCard } from "@/features/preview";
import { useMobileViewStore } from "@/store/mobile-view";
import { useSettingsPanelStore } from "@/store/theme";

export const MobileLayout = () => {
  const { currentView, setCurrentView } = useMobileViewStore();
  const { isOpen, setIsOpen } = useSettingsPanelStore();

  return (
    <div className="flex h-full flex-col p-4">
      {currentView === "preview" ? (
        <PreviewCard
          className="flex-1"
          isMobile
          onEditClick={() => setCurrentView("editor")}
        />
      ) : (
        <EditorCard
          className="flex-1"
          isMobile
          onPreviewClick={() => setCurrentView("preview")}
        />
      )}

      <Drawer onOpenChange={setIsOpen} open={isOpen}>
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
