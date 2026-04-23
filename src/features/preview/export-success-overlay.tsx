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
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/30 backdrop-blur-sm transition-opacity duration-300">
      <div className="zoom-in-75 fade-in flex h-16 w-16 animate-in items-center justify-center rounded-full bg-white shadow-xl duration-300">
        <HugeiconsIcon className="h-8 w-8 text-emerald-500" icon={Tick01Icon} />
      </div>
    </div>
  );
};
