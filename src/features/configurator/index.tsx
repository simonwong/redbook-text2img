"use client";

import { memo } from "react";
import { useSettingsPanelStore } from "@/store/theme";
import { ConfiguratorContent } from "./configurator-content";

export const Configurator = memo(() => {
  const { isOpen } = useSettingsPanelStore();

  if (!isOpen) return null;

  return (
    <aside
      aria-label="样式配置"
      className="w-[200px] min-w-[200px] overflow-auto"
    >
      <ConfiguratorContent />
    </aside>
  );
});

Configurator.displayName = "Configurator";
