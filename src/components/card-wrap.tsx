import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "./ui/card";

export interface CardWrapProps {
  className?: string;
  extra?: ReactNode;
  title?: string;
}

export const CardWrap = ({
  className,
  children,
  title,
  extra,
}: PropsWithChildren<CardWrapProps>) => (
  <Card className={cn("h-full gap-4 py-3", className)}>
    <CardHeader className="flex h-8 items-center justify-between">
      <h2 className="font-medium text-foreground">{title}</h2>
      <div className="flex gap-2">{extra}</div>
    </CardHeader>
    <CardContent className="flex-1 overflow-auto px-4">{children}</CardContent>
  </Card>
);
