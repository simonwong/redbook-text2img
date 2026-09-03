import {
  Download,
  ImageDownloadIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tooltip } from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { DrawerClose } from "@/components/ui/drawer";

interface PreviewActionBarProps {
  closeDrawerOnSettings?: boolean;
  isExporting: boolean;
  onExportAll: () => void;
  onExportCurrent: () => void;
  onToggleSettings: () => void;
  segmentCount: number;
}

export const PreviewActionBar = ({
  closeDrawerOnSettings = false,
  onExportCurrent,
  onExportAll,
  onToggleSettings,
  segmentCount,
  isExporting,
}: PreviewActionBarProps) => {
  const settingsButton = (
    <Button
      aria-label="设置样式"
      className="h-11 pr-[13px] pl-[11px] md:h-8"
      onClick={onToggleSettings}
      variant="mesh-glass"
    >
      <HugeiconsIcon className="size-[13px]" icon={SparklesIcon} />
      主题
    </Button>
  );

  return (
    <div className="ds-raised flex h-13 items-center gap-0.5 rounded-full pr-1 pl-1.5 md:h-10">
      <Tooltip content="导出当前图片">
        <Button
          className="h-11 px-3 md:h-8"
          disabled={segmentCount === 0 || isExporting}
          onClick={onExportCurrent}
          variant="ghost"
        >
          <HugeiconsIcon className="size-[13px]" icon={Download} />
          导出
        </Button>
      </Tooltip>
      <Tooltip content={`打包下载全部 (${segmentCount} 张)`}>
        <Button
          className="h-11 px-3 md:h-8"
          disabled={segmentCount === 0 || isExporting}
          onClick={onExportAll}
          variant="ghost"
        >
          <HugeiconsIcon className="size-[13px]" icon={ImageDownloadIcon} />
          全部
        </Button>
      </Tooltip>
      <div
        aria-hidden="true"
        className="mx-1 h-4 w-px shrink-0 bg-[var(--ds-line-strong)]"
      />
      <Tooltip content="设置样式">
        {closeDrawerOnSettings ? (
          <DrawerClose asChild>{settingsButton}</DrawerClose>
        ) : (
          settingsButton
        )}
      </Tooltip>
    </div>
  );
};
