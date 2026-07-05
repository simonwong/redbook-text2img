"use client";

import { Configurator } from "@/features/configurator";
import { EditorCard } from "@/features/editor";
import { PreviewCard } from "@/features/preview";
import { cn } from "@/lib/utils";
import { useSettingsPanelStore } from "@/store/theme";

export const DesktopLayout = () => {
  const isPanelOpen = useSettingsPanelStore((s) => s.isOpen);

  return (
    <>
      <div
        className={cn(
          "mx-auto flex h-full max-w-7xl px-6 transition-[padding] duration-200",
          // 面板打开时（≥1280px）为右侧浮层预留空间，避免遮挡预览卡
          // 280 = 浮层 240(w-[240px]) + 24(right-6) + 16 间隙；改 floating-configurator 宽度需同步
          isPanelOpen && "xl:pr-[280px]"
        )}
      >
        <div className="min-w-[400px] max-w-[640px] flex-1">
          <EditorCard className="h-full" />
        </div>
        <div className="h-full w-px bg-border" />
        <div className="flex-1">
          <PreviewCard className="h-full" />
        </div>
      </div>
      <Configurator />
    </>
  );
};
