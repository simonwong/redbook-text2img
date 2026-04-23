"use client";

import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useEffect, useState } from "react";

interface ExportSuccessOverlayProps {
  onDone: () => void;
  visible: boolean;
}

export const ExportSuccessOverlay = ({
  visible,
  onDone,
}: ExportSuccessOverlayProps) => {
  const [show, setShow] = useState(false);

  const stableOnDone = useCallback(onDone, [onDone]);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        stableOnDone();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [visible, stableOnDone]);

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
