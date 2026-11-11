import { create } from "zustand";

interface PreviewNavigationState {
  activeSegmentIndex: number;
  goNext: () => void;
  goPrev: () => void;
  /** 跳到某个源码分段（由 --- 划分）的第一张；自动拆分后一个分段可能占多张 */
  goToSegment: (segmentIndex: number) => void;
  segmentCount: number;
  /** 每个源码分段的第一张在全部卡片中的序号 */
  segmentStarts: number[];
  setActiveSegmentIndex: (index: number) => void;
  setSegmentCount: (count: number) => void;
  setSegmentStarts: (starts: number[]) => void;
}

export const usePreviewNavigationStore = create<PreviewNavigationState>(
  (set, get) => ({
    activeSegmentIndex: 0,
    goNext: () => {
      const { activeSegmentIndex, segmentCount } = get();
      if (activeSegmentIndex < segmentCount - 1) {
        set({ activeSegmentIndex: activeSegmentIndex + 1 });
      }
    },
    goPrev: () => {
      const { activeSegmentIndex } = get();
      if (activeSegmentIndex > 0) {
        set({ activeSegmentIndex: activeSegmentIndex - 1 });
      }
    },
    goToSegment: (segmentIndex) => {
      const { segmentStarts, setActiveSegmentIndex } = get();
      setActiveSegmentIndex(segmentStarts[segmentIndex] ?? segmentIndex);
    },
    segmentCount: 0,
    segmentStarts: [],
    setActiveSegmentIndex: (index) => {
      const { segmentCount, activeSegmentIndex } = get();
      if (index === activeSegmentIndex) {
        return;
      }
      if (index >= 0 && index < segmentCount) {
        set({ activeSegmentIndex: index });
      }
    },
    setSegmentCount: (count) => {
      if (count === get().segmentCount) {
        return;
      }
      set((state) => ({
        activeSegmentIndex: Math.min(
          state.activeSegmentIndex,
          Math.max(0, count - 1)
        ),
        segmentCount: count,
      }));
    },
    setSegmentStarts: (starts) => set({ segmentStarts: starts }),
  })
);
