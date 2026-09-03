"use client";

import { Tick01Icon } from "@hugeicons/core-free-icons";
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
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[16px] bg-white/45 backdrop-blur-[2px] transition-opacity duration-300">
      <div className="ds-sheet zoom-in-75 fade-in animate-in rounded-full duration-300">
        <div className="ds-sheet-in flex size-16 items-center justify-center rounded-full">
          <HugeiconsIcon className="size-8 text-ink" icon={Tick01Icon} />
        </div>
      </div>
    </div>
  );
};
