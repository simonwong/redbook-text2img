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
    <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center">
      <div className="ds-sheet rounded-full">
        <div className="ds-sheet-in flex items-center gap-2.5 rounded-full px-3.5 py-2">
          <span className="font-semibold text-[12px] text-ink">
            正在导出 {current}/{total}
          </span>
          <span className="block h-1 w-24 overflow-hidden rounded-full bg-[var(--ds-well)]">
            <span
              className="block h-full rounded-full bg-ink transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </span>
        </div>
      </div>
    </div>
  );
};
