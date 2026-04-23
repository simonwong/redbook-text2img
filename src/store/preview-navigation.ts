import { create } from "zustand";

interface PreviewNavigationState {
  activeSegmentIndex: number;
  goNext: () => void;
  goPrev: () => void;
  segmentCount: number;
  setActiveSegmentIndex: (index: number) => void;
  setSegmentCount: (count: number) => void;
}

export const usePreviewNavigationStore = create<PreviewNavigationState>(
  (set, get) => ({
    activeSegmentIndex: 0,
    segmentCount: 0,
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
        segmentCount: count,
        activeSegmentIndex: Math.min(
          state.activeSegmentIndex,
          Math.max(0, count - 1)
        ),
      }));
    },
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
  })
);
