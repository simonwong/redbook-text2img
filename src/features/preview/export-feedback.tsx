"use client";

import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

interface ExportSuccessOverlayProps {
  onDone: () => void;
  visible: boolean;
}

export const ExportSuccessOverlay = ({
  visible,
  onDone,
}: ExportSuccessOverlayProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onDone();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [visible, onDone]);

  if (!show) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/20 backdrop-blur-[2px] transition-opacity duration-300">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
        <HugeiconsIcon className="h-7 w-7 text-green-600" icon={Tick02Icon} />
      </div>
    </div>
  );
};

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
