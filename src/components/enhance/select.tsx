'use client';

import type * as React from 'react';
import {
  Select as BaseSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface SelectProps<
  OptionType extends { label: React.ReactNode; value: string },
> {
  options: readonly OptionType[];
  value?: OptionType['value'];
  onChange?: (value: OptionType['value'], option: OptionType) => void;
  placeholder?: string;
  className?: string;
}

export const Select = <
  OptionType extends { label: React.ReactNode; value: string },
>({
  options,
  value,
  onChange,
  placeholder,
  className,
}: SelectProps<OptionType>) => {
  const handleValueChange = (selectedValue: string) => {
    if (!onChange) {
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
        <SelectValue placeholder={placeholder} />
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
