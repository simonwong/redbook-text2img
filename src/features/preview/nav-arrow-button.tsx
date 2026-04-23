import { ArrowLeft02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

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
    <button
      aria-label={direction === "left" ? "上一张" : "下一张"}
      className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <HugeiconsIcon className="h-4 w-4" icon={icon} />
    </button>
  );
};
