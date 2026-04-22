import type React from "react";
import type { ReactNode } from "react";
import {
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Card as InternalCard,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface CardProps
  extends Omit<React.ComponentProps<typeof InternalCard>, "title"> {
  action?: ReactNode;
  actionClassName?: string;
  actionProps?: React.ComponentProps<typeof CardAction>;
  contentClassName?: string;
  contentProps?: React.ComponentProps<typeof CardContent>;
  description?: ReactNode;
  descriptionClassName?: string;
  descriptionProps?: React.ComponentProps<typeof CardDescription>;
  footer?: ReactNode;
  footerClassName?: string;
  footerProps?: React.ComponentProps<typeof CardFooter>;
  headerClassName?: string;
  headerProps?: React.ComponentProps<typeof CardHeader>;
  title?: ReactNode;
  titleClassName?: string;
  titleProps?: React.ComponentProps<typeof CardTitle>;
}

export const Card: React.FC<CardProps> = ({
  headerClassName,
  headerProps,
  title,
  titleClassName,
  titleProps,
  description,
  descriptionClassName,
  descriptionProps,
  action,
  actionClassName,
  actionProps,
  contentClassName,
  contentProps,
  footer,
  footerClassName,
  footerProps,
  children,
  ...resetProps
}) => (
  <InternalCard {...resetProps} className={cn(resetProps?.className)}>
    {(title || description) && (
      <CardHeader
        {...headerProps}
        className={cn(headerClassName, headerProps?.className)}
      >
        {title && (
          <CardTitle
            {...titleProps}
            className={cn(titleClassName, titleProps?.className)}
          >
            {title}
          </CardTitle>
        )}
        {description && (
          <CardDescription
            {...descriptionProps}
            className={cn(descriptionClassName, descriptionProps?.className)}
          >
            {description}
          </CardDescription>
        )}
        {action && (
          <CardAction
            {...actionProps}
            className={cn(actionClassName, actionProps?.className)}
          >
            {action}
          </CardAction>
        )}
      </CardHeader>
    )}
    {children && (
      <CardContent
        {...contentProps}
        className={cn(
          "overflow-auto",
          contentClassName,
          contentProps?.className
        )}
      >
        {children}
      </CardContent>
    )}
    {footer && (
      <CardFooter
        {...footerProps}
        className={cn(footerClassName, footerProps?.className)}
      >
        {footer}
      </CardFooter>
    )}
  </InternalCard>
);

export default Card;
