import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { defaultStyles } from '@/lib/default-styles';
import type { StyleConfig } from '@/lib/image-style-config';

interface StyleConfigState {
  isChange: boolean;
  styleConfig: StyleConfig;
  setBuildInStyleConfig: (styleConfig: StyleConfig) => void;
  setStyleConfig: (styleConfig: StyleConfig) => void;
}

export const useStyleConfigStore = create<StyleConfigState>()(
  devtools(
    persist(
      (set) => ({
        isChange: false,
        styleConfig: defaultStyles[0],
        setBuildInStyleConfig: (styleConfig) =>
          set({ styleConfig, isChange: false }),
        setStyleConfig: (styleConfig) => set({ styleConfig, isChange: true }),
      }),
      {
        name: 'redbook-current-style-config',
      }
    )
  )
);

interface ShowConfigState {
  isShowSetting: boolean;
  switchShowSetting: () => void;
}

export const showSettingStore = create<ShowConfigState>()((set) => ({
  isShowSetting: false,
  switchShowSetting: () => {
    set((state) => ({ isShowSetting: !state.isShowSetting }));
  },
}));
