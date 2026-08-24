"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { useSettingsPanelStore } from "@/store/theme";
import { ConfiguratorContent } from "./configurator-content";
import { SettingsDrawer } from "./settings-drawer";

interface ConfiguratorPanelProps {
  presentation: "inline" | "overlay";
}

export const ConfiguratorPanel = ({ presentation }: ConfiguratorPanelProps) => {
  const { isOpen, setIsOpen } = useSettingsPanelStore();

  if (presentation === "overlay") {
    return (
      <SettingsDrawer
        direction="right"
        onOpenChange={setIsOpen}
        open={isOpen}
      />
    );
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fade-in slide-in-from-right-2 flex h-full w-[300px] shrink-0 animate-in flex-col border-border border-l duration-200">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <span className="font-medium text-sm">样式设置</span>
        <Button
          aria-label="关闭样式设置"
          className="size-11"
          onClick={() => setIsOpen(false)}
          size="icon"
          variant="ghost"
        >
          <HugeiconsIcon icon={Cancel01Icon} />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <ConfiguratorContent />
      </div>
    </div>
  );
};
