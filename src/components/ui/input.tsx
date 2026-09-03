import { Input as InputPrimitive } from "@base-ui/react/input";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      className={cn(
        "ds-input h-11 w-full min-w-0 px-3 text-[13px] text-ink outline-none transition-[box-shadow] duration-150 ease-out placeholder:text-ink-3 disabled:pointer-events-none disabled:opacity-40 md:h-[34px]",
        className
      )}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}

export { Input };
