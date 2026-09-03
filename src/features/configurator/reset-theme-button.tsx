import { ArrowReloadHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ResetThemeButtonProps {
  disabled: boolean;
  onReset: () => void;
  themeName: string;
}

export const ResetThemeButton = ({
  disabled,
  onReset,
  themeName,
}: ResetThemeButtonProps) => (
  <button
    className="-my-2 -mr-2 flex min-h-11 shrink-0 items-center gap-1 rounded-[9px] px-2 text-[11px] text-ink-2 transition-colors duration-150 ease-out hover:bg-[var(--ds-well)] hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-40 md:min-h-7"
    disabled={disabled}
    onClick={onReset}
    title={`恢复“${themeName}”主题配置`}
    type="button"
  >
    <HugeiconsIcon className="size-[13px]" icon={ArrowReloadHorizontalIcon} />
    恢复主题配置
  </button>
);
