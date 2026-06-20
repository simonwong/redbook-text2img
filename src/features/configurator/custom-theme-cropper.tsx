"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { useDevice } from "@/features/layouts/hooks/use-device";
import {
  CUSTOM_THEME_SCALE_MAX,
  CUSTOM_THEME_SCALE_MIN,
  getPreviewImageLayout,
} from "@/lib/theme/custom-theme-image";
import { cn } from "@/lib/utils";
import { useContentThemeStore } from "@/store/theme";

export const CustomThemeCropper = () => {
  const {
    pendingUpload,
    isCropperOpen,
    updatePendingCrop,
    cancelCustomThemeUpload,
    commitCustomThemeCrop,
  } = useContentThemeStore();
  const { isMobile } = useDevice();
  const frameRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<{
    pointerId: number;
    clientX: number;
    clientY: number;
    cropX: number;
    cropY: number;
  } | null>(null);
  const [frameElement, setFrameElement] = useState<HTMLDivElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!frameElement) {
      return;
    }

    const updateFrameSize = () => {
      const nextWidth = frameElement.clientWidth;
      const nextHeight = frameElement.clientHeight;

      setFrameSize((currentSize) => {
        if (
          currentSize.width === nextWidth &&
          currentSize.height === nextHeight
        ) {
          return currentSize;
        }

        return {
          width: nextWidth,
          height: nextHeight,
        };
      });
    };

    updateFrameSize();

    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = entry.contentRect.width;
      const nextHeight = entry.contentRect.height;

      setFrameSize((currentSize) => {
        if (
          currentSize.width === nextWidth &&
          currentSize.height === nextHeight
        ) {
          return currentSize;
        }

        return {
          width: nextWidth,
          height: nextHeight,
        };
      });
    });

    observer.observe(frameElement);

    window.addEventListener("resize", updateFrameSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateFrameSize);
    };
  }, [frameElement]);

  useEffect(() => {
    if (!isCropperOpen || isMobile) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSaving) {
        cancelCustomThemeUpload();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [cancelCustomThemeUpload, isCropperOpen, isMobile, isSaving]);

  const previewLayout = useMemo(() => {
    if (!pendingUpload || frameSize.width <= 0 || frameSize.height <= 0) {
      return null;
    }

    return getPreviewImageLayout(
      pendingUpload.crop,
      frameSize.width,
      frameSize.height
    );
  }, [frameSize.height, frameSize.width, pendingUpload]);

  if (!pendingUpload) {
    return null;
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!previewLayout) {
      return;
    }

    dragStartRef.current = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      cropX: pendingUpload.crop.x,
      cropY: pendingUpload.crop.y,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!(dragStartRef.current && previewLayout)) {
      return;
    }

    if (dragStartRef.current.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragStartRef.current.clientX;
    const deltaY = event.clientY - dragStartRef.current.clientY;

    updatePendingCrop({
      x: dragStartRef.current.cropX - deltaX / previewLayout.previewScale,
      y: dragStartRef.current.cropY - deltaY / previewLayout.previewScale,
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current?.pointerId !== event.pointerId) {
      return;
    }

    dragStartRef.current = null;
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await commitCustomThemeCrop(
      pendingUpload.basePresetThemeId,
      pendingUpload.themeName
    );
    setIsSaving(false);
  };

  const cropperContent = (
    <div className="space-y-5">
      <div className="space-y-1">
        <h3 className="font-medium text-base">裁剪背景图</h3>
        <p className="text-muted-foreground text-sm">
          拖动调整位置，固定 3:4 比例裁剪后保存为主题背景。
        </p>
      </div>

      <div className="mx-auto w-full max-w-[320px]">
        <div
          className={cn(
            "relative aspect-[3/4] overflow-hidden rounded-[28px] bg-muted/60 ring-1 ring-border",
            isDragging ? "cursor-grabbing" : "cursor-grab"
          )}
          onPointerCancel={handlePointerUp}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          ref={(node) => {
            frameRef.current = node;
            setFrameElement(node);
          }}
          style={{ touchAction: "none" }}
        >
          {previewLayout ? (
            <div
              aria-label={pendingUpload.themeName}
              className="pointer-events-none absolute select-none"
              role="img"
              style={{
                backgroundImage: `url(${pendingUpload.imageDataUrl})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% 100%",
                height: `${previewLayout.height}px`,
                left: `${previewLayout.left}px`,
                top: `${previewLayout.top}px`,
                width: `${previewLayout.width}px`,
              }}
            />
          ) : null}
          <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-2 ring-white/80 ring-offset-0" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/45 to-transparent px-4 py-4 text-white">
            <div className="font-medium text-sm">{pendingUpload.themeName}</div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="font-medium text-xs">缩放</Label>
          <span className="text-muted-foreground text-xs">
            {pendingUpload.crop.scale.toFixed(2)}x
          </span>
        </div>
        <input
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
          max={CUSTOM_THEME_SCALE_MAX}
          min={CUSTOM_THEME_SCALE_MIN}
          onChange={(event) =>
            updatePendingCrop({ scale: Number(event.target.value) })
          }
          step={0.01}
          type="range"
          value={pendingUpload.crop.scale}
        />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer
        onOpenChange={(open) => {
          if (!(open || isSaving)) {
            cancelCustomThemeUpload();
          }
        }}
        open={isCropperOpen}
      >
        <DrawerContent className="min-h-[92vh]">
          <DrawerHeader>
            <DrawerTitle>裁剪主题背景</DrawerTitle>
            <DrawerDescription>
              上传图片会按 3:4 输出，导出效果和预览保持一致。
            </DrawerDescription>
          </DrawerHeader>
          <div className="overflow-auto px-4 pb-4">{cropperContent}</div>
          <DrawerFooter>
            <Button
              disabled={isSaving}
              onClick={cancelCustomThemeUpload}
              size="lg"
              variant="outline"
            >
              取消
            </Button>
            <Button disabled={isSaving} onClick={handleSave} size="lg">
              {isSaving ? "保存中..." : "保存主题"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return isCropperOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[32px] border border-border bg-background p-6 shadow-2xl">
        {cropperContent}
        <div className="mt-6 flex items-center justify-end gap-2">
          <Button
            disabled={isSaving}
            onClick={cancelCustomThemeUpload}
            variant="outline"
          >
            取消
          </Button>
          <Button disabled={isSaving} onClick={handleSave}>
            {isSaving ? "保存中..." : "保存主题"}
          </Button>
        </div>
      </div>
    </div>
  ) : null;
};
