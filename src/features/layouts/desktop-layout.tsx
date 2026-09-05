import { ConfiguratorPanel } from "@/features/configurator";
import { EditorCard } from "@/features/editor";
import { PreviewCard } from "@/features/preview";

interface DesktopLayoutProps {
  settingsPresentation: "inline" | "overlay";
}

export const DesktopLayout = ({ settingsPresentation }: DesktopLayoutProps) => (
  <div className="flex h-full min-h-0 gap-3">
    <EditorCard className="min-w-[400px] max-w-[640px] flex-1 basis-[400px]" />
    {/* 427 = 卡片 375 + card-rim 6 + 中间区左右 padding 40 + frame 6，保证有空间时不缩放 */}
    <PreviewCard className="min-w-0 flex-1 basis-[427px]" />
    <ConfiguratorPanel presentation={settingsPresentation} />
  </div>
);
