"use client";

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
        <svg
          aria-hidden="true"
          className="h-8 w-8 text-emerald-500"
          fill="none"
          role="img"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <title>导出成功</title>
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  );
};
