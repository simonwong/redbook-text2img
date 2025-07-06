import type React from 'react';
import type { PropsWithChildren, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  Card as CardBase,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';

export type CardProps = {
  title?: ReactNode;
  titleClassName?: string;
  contentClassName?: string;
  className?: string;
};

export const Card: React.FC<PropsWithChildren<CardProps>> = ({
  title,
  children,
  titleClassName,
  contentClassName,
  className,
}) => {
  return (
    <CardBase className={cn(className)}>
      {title && (
        <CardHeader>
          <CardTitle className={cn('flex gap-2', titleClassName)}>
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(contentClassName)}>{children}</CardContent>
    </CardBase>
  );
};
