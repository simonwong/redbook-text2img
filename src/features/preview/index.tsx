"use client";

import { PreviewPanel } from "./preview-panel";

interface PreviewCardProps {
  className?: string;
}

export const PreviewCard = ({ className }: PreviewCardProps) => (
  <PreviewPanel className={className} />
);
