"use client";

import { type KeyboardEvent, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  maxCustomThemeNameLength,
  maxCustomThemes,
} from "@/lib/style-system/style-system";
import { useContentThemeStore } from "@/store/theme";

interface SaveThemePopoverProps {
  /** 次要位置（已有「更新此主题」主按钮时）用 ghost */
  variant: "ghost" | "raised";
}

const nameInputId = "custom-theme-name";

/**
 * 「另存为主题」弹层：命名并把当前有效配置存为自定义主题。
 * 上限与配额都由状态容器判定，这里只负责禁用入口与回显失败原因。
 */
export const SaveThemePopover = ({ variant }: SaveThemePopoverProps) => {
  const { customThemes, saveCustomTheme } = useContentThemeStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const isFull = customThemes.length >= maxCustomThemes;

  const openChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setName(`我的主题 ${customThemes.length + 1}`);
      setError("");
    }
    setOpen(nextOpen);
  };

  const save = () => {
    const result = saveCustomTheme(name);
    if (result.ok) {
      setOpen(false);
      return;
    }
    setError(
      result.reason === "quota"
        ? "本地存储空间不足，请删除一个自定义主题或改用更小的背景图"
        : "最多保存 8 个"
    );
  };

  const editName = (event: { target: { value: string } }) =>
    setName(event.target.value);

  const saveOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      save();
    }
  };

  return (
    <Popover onOpenChange={openChange} open={open}>
      <PopoverTrigger
        className={buttonVariants({ size: "sm", variant })}
        disabled={isFull}
        title={isFull ? "最多保存 8 个" : undefined}
      >
        另存为主题
      </PopoverTrigger>
      <PopoverContent
        align="start"
        aria-label="另存为主题"
        className="w-[248px] gap-2.5"
        side="top"
        sideOffset={8}
      >
        <label
          className="font-semibold text-[11px] text-ink-3"
          htmlFor={nameInputId}
        >
          主题名称
        </label>
        <Input
          autoFocus
          id={nameInputId}
          maxLength={maxCustomThemeNameLength}
          onChange={editName}
          onKeyDown={saveOnEnter}
          placeholder="我的主题"
          value={name}
        />
        {error ? <p className="text-[11px] text-destructive">{error}</p> : null}
        <Button
          className="w-full"
          disabled={name.trim().length === 0}
          onClick={save}
          size="sm"
        >
          保存
        </Button>
      </PopoverContent>
    </Popover>
  );
};
