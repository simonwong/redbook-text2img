import React, { PropsWithChildren } from 'react';
import { Tooltip as TooltipBase, TooltipContent, TooltipTrigger } from './ui/tooltip';

export interface TooltipProps {
  content?: React.ReactNode;
}

export const Tooltip: React.FC<PropsWithChildren<TooltipProps>> = ({ children, content }) => {
  return (
    <TooltipBase>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </TooltipBase>
  );
};
