import {
  Download,
  ImageDownloadIcon,
  PaintBoardIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tooltip } from "@/components/tooltip";
import { Button } from "@/components/ui/button";

interface PreviewActionBarProps {
  isExporting: boolean;
  onExportAll: () => void;
  onExportCurrent: () => void;
  onToggleSettings: () => void;
  segmentCount: number;
}

export const PreviewActionBar = ({
  onExportCurrent,
  onExportAll,
  onToggleSettings,
  segmentCount,
  isExporting,
}: PreviewActionBarProps) => (
  <div className="flex items-center gap-2">
    <Tooltip content="导出当前图片">
      <Button
        disabled={segmentCount === 0 || isExporting}
        onClick={onExportCurrent}
        size="sm"
        variant="outline"
      >
        <HugeiconsIcon className="h-3.5 w-3.5" icon={Download} />
        导出
      </Button>
    </Tooltip>
    <Tooltip content={`导出全部 (${segmentCount} 张)`}>
      <Button
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
      <Button onClick={onToggleSettings} size="sm" variant="outline">
        <HugeiconsIcon className="h-3.5 w-3.5" icon={PaintBoardIcon} />
      </Button>
    </Tooltip>
  </div>
);
