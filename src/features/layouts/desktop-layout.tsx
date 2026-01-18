"use client";

import { Configurator } from "@/features/configurator";
import { EditorCard } from "@/features/editor";
import { PreviewCard } from "@/features/preview";

export const DesktopLayout = () => {
  return (
    <div className="flex h-full gap-6 px-4">
      <EditorCard className="min-w-0 flex-1" />
      <PreviewCard className="flex-shrink-0" />
      <Configurator />
    </div>
  );
};
