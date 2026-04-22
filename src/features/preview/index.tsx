"use client";

import { PreviewPanel } from "./preview-panel";

interface PreviewCardProps {
  className?: string;
  isMobile?: boolean;
  onEditClick?: () => void;
}

export const PreviewCard = ({ className }: PreviewCardProps) => (
  <PreviewPanel className={className} />
);
