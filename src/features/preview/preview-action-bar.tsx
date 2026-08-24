import {
  Download,
  ImageDownloadIcon,
  PaintBoardIcon,
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
      className="h-11"
      onClick={onToggleSettings}
      size="sm"
      variant="outline"
    >
      <HugeiconsIcon className="h-3.5 w-3.5" icon={PaintBoardIcon} />
      主题
    </Button>
  );

  return (
    <div className="flex items-center gap-2">
      <Tooltip content="导出当前图片">
        <Button
          className="h-11"
          disabled={segmentCount === 0 || isExporting}
          onClick={onExportCurrent}
          size="sm"
          variant="outline"
        >
          <HugeiconsIcon className="h-3.5 w-3.5" icon={Download} />
          导出
        </Button>
      </Tooltip>
      <Tooltip content={`打包下载全部 (${segmentCount} 张)`}>
        <Button
          className="h-11"
          disabled={segmentCount === 0 || isExporting}
          onClick={onExportAll}
          size="sm"
          variant="outline"
        >
          <HugeiconsIcon className="h-3.5 w-3.5" icon={ImageDownloadIcon} />
          全部
        </Button>
      </Tooltip>
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
