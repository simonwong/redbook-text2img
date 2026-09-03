import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-semibold text-[13px] outline-none transition-[background-color,box-shadow,color] duration-150 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "raised",
    },
    variants: {
      size: {
        default: "h-9 px-3.5",
        icon: "size-9 px-0",
        "icon-lg": "size-10 px-0",
        "icon-sm": "size-8 px-0",
        "icon-xs": "size-6 px-0 [&_svg:not([class*='size-'])]:size-3",
        lg: "h-10 px-4",
        sm: "h-[30px] gap-1.5 px-[11px] text-xs",
        xs: "h-6 gap-1 px-2.5 text-[11px] [&_svg:not([class*='size-'])]:size-3",
      },
      variant: {
        // 兼容旧调用点，视觉等同 raised
        default: "ds-raised text-ink",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
        // 弱操作：透明底，悬停 well
        ghost: "text-ink-2 hover:bg-[var(--ds-well)] hover:text-ink",
        link: "text-ink underline-offset-4 hover:underline",
        // 磨砂彩色玻璃，每屏只用于「主题」这一个主操作
        "mesh-glass": "ds-mesh-glass",
        outline: "ds-raised text-ink",
        // 白色凸起：所有次级可点击控件
        raised: "ds-raised text-ink",
        secondary: "ds-well text-ink hover:bg-[var(--ds-line-strong)]",
      },
    },
  }
);

function Button({
  className,
  variant = "raised",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ className, size, variant }))}
      data-slot="button"
      {...props}
    />
  );
}

export { Button, buttonVariants };
