"use client";

import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { colors } from "@/lib/theme";
import { cn } from "@/lib/utils";

const DECORATION_COLORS = [
  "#e64f7a",
  colors.accent.orange,
  colors.accent.green,
  colors.accent.blue,
  colors.accent.purple,
  "#f43f5e",
];

const RAINBOW =
  "conic-gradient(from 0deg, #ff4d4d, #ffd24d, #4dff88, #4dd2ff, #4d6bff, #c44dff, #ff4d4d)";

interface DecorationColorPickerProps {
  descriptionId?: string;
  disabled: boolean;
  onChange: (color: string) => void;
  value: string;
}

export const DecorationColorPicker = ({
  descriptionId,
  disabled,
  onChange,
  value,
}: DecorationColorPickerProps) => {
  const active = value.toLowerCase();
  const isCustom = !DECORATION_COLORS.some(
    (color) => color.toLowerCase() === active
  );

  return (
    <fieldset
      aria-describedby={disabled ? descriptionId : undefined}
      className="m-0 grid min-w-0 grid-cols-4 gap-1 border-0 p-0"
      disabled={disabled}
    >
      {DECORATION_COLORS.map((color) => (
        <button
          aria-label={`装饰颜色 ${color}`}
          aria-pressed={active === color.toLowerCase()}
          className="group flex min-h-11 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40"
          key={color}
          onClick={() => onChange(color)}
          type="button"
        >
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-full ring-1 ring-black/10 transition-shadow group-hover:ring-2 group-hover:ring-foreground/40",
              active === color.toLowerCase() && "ring-2 ring-foreground"
            )}
            style={{ backgroundColor: color }}
          >
            {active === color.toLowerCase() && (
              <HugeiconsIcon
                className="size-4 text-white drop-shadow-sm"
                icon={Tick02Icon}
                strokeWidth={3}
              />
            )}
          </span>
        </button>
      ))}

      <label
        className={cn(
          "flex min-h-11 items-center justify-center rounded-md focus-within:ring-2 focus-within:ring-ring",
          disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex size-7 items-center justify-center rounded-full ring-1 ring-black/10",
            isCustom && "ring-2 ring-foreground"
          )}
          style={{ background: isCustom ? active : RAINBOW }}
        >
          {isCustom && (
            <HugeiconsIcon
              className="size-4 text-white drop-shadow-sm"
              icon={Tick02Icon}
              strokeWidth={3}
            />
          )}
        </span>
        <input
          aria-label="自定义装饰颜色"
          className="sr-only"
          onChange={(event) => onChange(event.target.value)}
          type="color"
          value={value.startsWith("#") ? value : colors.accent.purple}
        />
      </label>
    </fieldset>
  );
};
