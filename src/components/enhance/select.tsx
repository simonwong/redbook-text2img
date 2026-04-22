"use client";

import type * as React from "react";
import {
  Select as BaseSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type BaseOptionType = {
  label: React.ReactNode;
  value: string;
} & {
  [K in string]: unknown;
};

export interface SelectProps<OptionType extends BaseOptionType> {
  className?: string;
  onChange?: (value: OptionType["value"], option: OptionType) => void;
  options: readonly OptionType[];
  placeholder?: string;
  value?: OptionType["value"] | string;
}

export const Select = <OptionType extends BaseOptionType>({
  options,
  value,
  onChange,
  placeholder,
  className,
}: SelectProps<OptionType>) => {
  const handleValueChange = (selectedValue: string | null) => {
    if (!onChange || selectedValue === null) {
      return;
    }
    const selectedOption = options.find(
      (option) => option.value === selectedValue
    );
    if (selectedOption) {
      onChange(selectedOption.value, selectedOption);
    }
  };

  return (
    <BaseSelect onValueChange={handleValueChange} value={value}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder}>
          {(selectedValue: string | null) => {
            const option = options.find((o) => o.value === selectedValue);
            return option?.label ?? placeholder;
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </BaseSelect>
  );
};
