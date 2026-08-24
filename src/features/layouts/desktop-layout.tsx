import { ConfiguratorPanel } from "@/features/configurator";
import { EditorCard } from "@/features/editor";
import { PreviewCard } from "@/features/preview";

interface DesktopLayoutProps {
  settingsPresentation: "inline" | "overlay";
}

export const DesktopLayout = ({ settingsPresentation }: DesktopLayoutProps) => (
  <div className="mx-auto flex h-full max-w-7xl px-6">
    <div className="min-w-[400px] max-w-[640px] flex-1">
      <EditorCard className="h-full" />
    </div>
    <div className="h-full w-px bg-border" />
    <div className="min-w-0 flex-1">
      <PreviewCard className="h-full" />
    </div>
    <ConfiguratorPanel presentation={settingsPresentation} />
  </div>
);
