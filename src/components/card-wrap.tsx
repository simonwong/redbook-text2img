import type React from "react";
import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "./ui/card";

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
    <Card className={cn("h-full gap-4 py-3", className)}>
      <CardHeader className="flex h-8 items-center justify-between">
        <h2 className="font-medium text-foreground">{title}</h2>
        <div className="flex gap-2">{extra}</div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden px-4">
        {children}
      </CardContent>
    </Card>
  );
};
