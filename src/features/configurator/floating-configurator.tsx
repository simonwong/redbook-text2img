"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect } from "react";
import { useSettingsPanelStore } from "@/store/theme";
import { ConfiguratorContent } from "./configurator-content";

export const FloatingConfigurator = () => {
  const { isOpen, setIsOpen } = useSettingsPanelStore();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fade-in slide-in-from-bottom-2 fixed top-14 right-6 z-30 w-[240px] animate-in duration-200">
      <div className="max-h-[calc(100vh-5rem)] overflow-y-auto rounded-xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-medium text-sm">样式设置</span>
          <button
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            onClick={() => setIsOpen(false)}
            type="button"
          >
            <HugeiconsIcon className="h-4 w-4" icon={Cancel01Icon} />
          </button>
        </div>
        <ConfiguratorContent />
      </div>
    </div>
  );
};
