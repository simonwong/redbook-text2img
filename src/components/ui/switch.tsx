"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  className?: string;
  /** 开关自带的文字，同时作为无障碍名称 */
  label: string;
  onCheckedChange: (checked: boolean) => void;
}

export const Switch = ({
  checked,
  className,
  label,
  onCheckedChange,
}: SwitchProps) => (
  <SwitchPrimitive.Root
    checked={checked}
    className={cn(
      "ds-input flex min-h-11 w-full cursor-pointer select-none items-center justify-between gap-3 px-3 text-[13px] text-ink outline-none transition-[box-shadow] duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 md:min-h-[34px]",
      className
    )}
    onCheckedChange={onCheckedChange}
  >
    <span>{label}</span>
    <span
      aria-hidden="true"
      className={cn(
        "flex h-[18px] w-[30px] shrink-0 items-center rounded-full p-[2px] transition-colors duration-150 ease-out",
        // 关态也要看得见：实心槽 + 内描边，避免只剩一块空白
        checked
          ? "bg-ink"
          : "bg-[var(--ds-line-strong)] shadow-[inset_0_0_0_1px_var(--ds-line-strong)]"
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "block size-[14px] rounded-full transition-transform duration-150 ease-out",
          checked
            ? "translate-x-3 bg-[var(--ds-on-ink)]"
            : "translate-x-0 bg-[var(--ds-chip-bg)] shadow-[var(--ds-sh-chip)]"
        )}
      />
    </span>
  </SwitchPrimitive.Root>
);
