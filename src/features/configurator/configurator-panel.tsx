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
    <div className="ds-panel fade-in slide-in-from-right-2 relative flex h-full w-[312px] shrink-0 animate-in flex-col overflow-hidden duration-200">
      <div className="flex shrink-0 items-center justify-between pt-2.5 pr-2 pb-1.5 pl-4">
        <span className="font-bold text-[13px] text-ink">样式设置</span>
        <Button
          aria-label="关闭样式设置"
          className="size-11 md:size-8"
          onClick={() => setIsOpen(false)}
          size="icon"
          variant="ghost"
        >
          <HugeiconsIcon className="size-[13px]" icon={Cancel01Icon} />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-0.5 pb-16">
        <ConfiguratorContent />
      </div>
      <div
        aria-hidden="true"
        className="ds-fade-bottom absolute inset-x-0 bottom-0 h-16"
      />
    </div>
  );
};
