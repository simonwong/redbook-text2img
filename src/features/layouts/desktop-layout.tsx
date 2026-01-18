"use client";

import { Configurator } from "@/features/configurator";
import { EditorCard } from "@/features/editor";
import { PreviewCard } from "@/features/preview";

export const DesktopLayout = () => {
  return (
    <div className="flex h-full gap-6 px-4">
      {/* 编辑器：可收缩 */}
      <EditorCard className="min-w-0 flex-1" />

      {/* 预览：不收缩 */}
      <PreviewCard className="flex-shrink-0" />

      {/* 配置面板：200px 固定宽度 */}
      <Configurator />
    </div>
  );
};
