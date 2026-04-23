"use client";

import { useEffect, useRef } from "react";
import { useSettingsPanelStore } from "@/store/theme";
import { ConfiguratorContent } from "./configurator-content";

export const FloatingConfigurator = () => {
  const { isOpen, setIsOpen } = useSettingsPanelStore();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (panelRef.current && !panelRef.current.contains(target)) {
        if (target.closest?.('[data-slot="select-content"]')) {
          return;
        }
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const timerId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timerId);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fade-in slide-in-from-bottom-2 absolute right-4 bottom-16 z-30 w-[240px] animate-in duration-200"
      ref={panelRef}
    >
      <div className="rounded-xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur-md">
        <ConfiguratorContent />
      </div>
    </div>
  );
};
