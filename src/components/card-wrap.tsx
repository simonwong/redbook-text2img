import React, { PropsWithChildren } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { cn } from '@/lib/utils';

export interface CardWrapProps {
  title?: string;
  className?: string;
  extra?: React.ReactNode | React.ReactNode[];
}

export const CardWrap: React.FC<PropsWithChildren<CardWrapProps>> = ({
  className,
  children,
  title,
  extra,
}) => {
  return (
    <Card className={cn('h-full gap-4 py-3', className)}>
      <CardHeader className="flex items-center justify-between">
        <h2 className="font-medium text-gray-900">{title}</h2>
        <div className="flex gap-2">{extra}</div>
      </CardHeader>
      <CardContent className="px-4 flex-1 overflow-hidden">{children}</CardContent>
    </Card>
  );
};
