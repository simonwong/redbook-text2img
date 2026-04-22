"use client";

import { Configurator } from "@/features/configurator";
import { EditorCard } from "@/features/editor";
import { PreviewCard } from "@/features/preview";

export const DesktopLayout = () => (
  <div className="flex h-full">
    <div className="min-w-[400px] max-w-[640px] flex-1">
      <EditorCard className="h-full" />
    </div>
    <div className="h-full w-px bg-border" />
    <div className="relative flex-1">
      <PreviewCard className="h-full" />
      <Configurator />
    </div>
  </div>
);
