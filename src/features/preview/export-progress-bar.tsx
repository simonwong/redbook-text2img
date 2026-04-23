"use client";

interface ExportProgressBarProps {
  current: number;
  isExporting: boolean;
  total: number;
}

export const ExportProgressBar = ({
  current,
  total,
  isExporting,
}: ExportProgressBarProps) => {
  if (!isExporting || total === 0) {
    return null;
  }

  const progress = (current / total) * 100;

  return (
    <div className="absolute top-0 right-0 left-0 z-10">
      <div className="h-1 w-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="px-3 py-1 text-center text-muted-foreground text-xs">
        正在导出 {current}/{total}...
      </div>
    </div>
  );
};
