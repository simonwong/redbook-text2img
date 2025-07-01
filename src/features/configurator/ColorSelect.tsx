import Colorful from '@uiw/react-color-colorful';
import { useState } from 'react';
import {
  type BaseOptionType,
  Select,
  type SelectProps,
} from '@/components/enhance/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ColorOption extends BaseOptionType {
  color: string;
}

export interface ColorSelectProps<OptionType extends ColorOption>
  extends Omit<SelectProps<OptionType>, 'options'> {
  options: readonly OptionType[];
  onChange: (color: string) => void;
}

export const ColorSelect = <OptionType extends ColorOption>({
  options,
  onChange,
  value,
  className,
  ...props
}: ColorSelectProps<OptionType>) => {
  const currentOption = options.find((item) => item.value === value);
  const [showColorful, setShowColorful] = useState(false);
  const isCustom = !currentOption;
  const selectValue = isCustom ? 'custom' : value;

  return (
    <div className={cn('w-32 space-y-2', className)}>
      <Select
        className={cn('w-full')}
        onChange={(v) => {
          if (v === 'custom') {
            onChange?.(currentOption?.color || value || '');
            return;
          }
          onChange?.(v);
        }}
        options={options.map((option) => ({
          ...option,
          label: (
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded border"
                style={{
                  background:
                    option.value === 'custom' && isCustom
                      ? value
                      : option.color,
                }}
              />
              <span className="text-xs">{option.label}</span>
            </div>
          ),
          value: option.value,
        }))}
        value={selectValue}
        {...props}
      />
      {isCustom && (
        <div className="relative">
          {showColorful && (
            <div className="absolute top-[-200px] left-0 shadow">
              <Colorful
                color={value}
                onChange={(color) => {
                  onChange?.(color.hexa);
                }}
              />
            </div>
          )}
          <Input
            className="w-full"
            onBlur={() => setShowColorful(false)}
            onChange={(e) => onChange?.(e.target.value)}
            onFocus={() => setShowColorful(true)}
            placeholder="e.g., #fff"
            value={value}
          />
        </div>
      )}
    </div>
  );
};
