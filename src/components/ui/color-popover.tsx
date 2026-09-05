"use client";

import { type KeyboardEvent, useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { ColorPresetSwatch } from "@/components/ui/color-preset-swatch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { swatchSkin } from "@/components/ui/swatch-skin";
import { commitHexColor, hexColorInputValue } from "@/lib/color/hex-color";
import { cn } from "@/lib/utils";

interface ColorPopoverProps {
  className?: string;
  /** 无障碍名称，也用于弹层与十六进制输入的标签（纯色背景、渐变起点、强调色…） */
  label: string;
  onChange: (color: string) => void;
  /** 色板预设，由调用方决定：背景传 12 色，强调色传 8 色。 */
  presets: readonly string[];
  /** 触发器圆点的尺寸类名，缺省 28px */
  swatchClassName?: string;
  /** 6 位十六进制颜色 */
  value: string;
}

/**
 * 统一取色弹层：28px 圆形触发器 + 色板 / 自由取色 / 十六进制三段弹层。
 * 触控端触发器外框放大到 44px 并用负外边距保持排布不变，圆点只是内层视觉。
 * 纯色背景、自定义渐变的两个色标、强调色共用，替代原生 `<input type="color">`。
 * 弹层内的改动实时写回配置；非法十六进制输入不写入，回退到上一个合法值。
 */
export const ColorPopover = ({
  className,
  label,
  onChange,
  presets,
  swatchClassName,
  value,
}: ColorPopoverProps) => {
  const [draft, setDraft] = useState(() => hexColorInputValue(value));

  // 外部值变化（色板、自由取色、渐变预设、恢复主题）时回填输入框
  useEffect(() => {
    setDraft(hexColorInputValue(value));
  }, [value]);

  const commitDraft = () => {
    const committed = commitHexColor(draft, value);
    setDraft(hexColorInputValue(committed));
    if (committed !== value) {
      onChange(committed);
    }
  };

  const editDraft = (event: { target: { value: string } }) =>
    setDraft(event.target.value);

  const commitOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commitDraft();
    }
  };

  return (
    <Popover>
      <PopoverTrigger
        aria-label={label}
        className={cn(
          "-m-2 flex size-11 shrink-0 items-center justify-center rounded-full transition-transform duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 active:scale-95 md:m-0 md:size-7",
          className
        )}
        title={`${label} ${value}`}
      >
        <span
          aria-hidden="true"
          className={cn(swatchSkin, "block size-7", swatchClassName)}
          style={{ backgroundColor: value }}
        />
      </PopoverTrigger>
      <PopoverContent aria-label={label} className="w-[232px]" sideOffset={8}>
        <div className="grid grid-cols-6 gap-y-2">
          {presets.map((preset) => (
            <ColorPresetSwatch
              color={preset}
              key={preset}
              onSelect={onChange}
              selected={preset === value}
            />
          ))}
        </div>

        <div className="color-picker-surface">
          <HexColorPicker color={value} onChange={onChange} />
        </div>

        <div className="ds-input flex h-9 items-center gap-1 px-3">
          <span aria-hidden="true" className="text-[12px] text-ink-3">
            #
          </span>
          <input
            aria-label={`${label}十六进制值`}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            className="w-full min-w-0 bg-transparent font-mono text-[12px] text-ink uppercase outline-none"
            maxLength={7}
            onBlur={commitDraft}
            onChange={editDraft}
            onKeyDown={commitOnEnter}
            spellCheck={false}
            value={draft}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
