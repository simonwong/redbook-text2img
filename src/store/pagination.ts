import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface PaginationState {
  /** 自动拆分：内容超出卡片时自动续到下一张，默认开启 */
  autoSplit: boolean;
  setAutoSplit: (autoSplit: boolean) => void;
}

/** 分页偏好，独立于主题和样式配置，切换或重置主题时保持不变 */
export const usePaginationStore = create<PaginationState>()(
  devtools(
    persist(
      (set) => ({
        autoSplit: true,
        setAutoSplit: (autoSplit: boolean) => set({ autoSplit }),
      }),
      { name: "redbook-pagination" }
    ),
    { enabled: process.env.NODE_ENV === "development" }
  )
);
