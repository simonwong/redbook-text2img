import { create } from "zustand";

type MobileView = "preview" | "editor";

interface MobileViewState {
  currentView: MobileView;
  setCurrentView: (view: MobileView) => void;
}

export const useMobileViewStore = create<MobileViewState>((set) => ({
  currentView: "preview", // 默认显示预览视图
  setCurrentView: (view) => set({ currentView: view }),
}));
