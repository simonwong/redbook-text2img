import { ArrowLeft02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

interface NavArrowButtonProps {
  direction: "left" | "right";
  disabled?: boolean;
  onClick: () => void;
}

export const NavArrowButton = ({
  direction,
  onClick,
  disabled,
}: NavArrowButtonProps) => {
  const icon = direction === "left" ? ArrowLeft02Icon : ArrowRight02Icon;

  return (
    <Button
      aria-label={direction === "left" ? "上一张" : "下一张"}
      className="rounded-full"
      disabled={disabled}
      onClick={onClick}
      size="icon-sm"
      variant="ghost"
    >
      <HugeiconsIcon className="h-4 w-4" icon={icon} />
    </Button>
  );
};
