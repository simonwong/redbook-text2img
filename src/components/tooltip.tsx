import { isValidElement, type PropsWithChildren, type ReactNode } from "react";
import {
  Tooltip as TooltipBase,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";

export interface TooltipProps {
  content?: ReactNode;
}

export const Tooltip = ({
  children,
  content,
}: PropsWithChildren<TooltipProps>) => {
  return (
    <TooltipBase>
      {isValidElement(children) ? (
        <TooltipTrigger render={children} />
      ) : (
        <TooltipTrigger>{children}</TooltipTrigger>
      )}
      <TooltipContent>{content}</TooltipContent>
    </TooltipBase>
  );
};
