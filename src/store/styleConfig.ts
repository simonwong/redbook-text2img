import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { defaultStyles } from '@/lib/default-styles';
import type { StyleConfig } from '@/lib/image-style-config';

interface StyleConfigState {
  isChange: boolean;
  setIsChange: (isChange: boolean) => void;
  styleConfig: StyleConfig;
  setStyleConfig: (styleConfig: StyleConfig) => void;
}

export const useStyleConfigStore = create<StyleConfigState>()(
  devtools(
    persist(
      (set) => ({
        isChange: false,
        setIsChange: (isChange) => set({ isChange }),
        styleConfig: defaultStyles[0],
        setStyleConfig: (styleConfig) => set({ styleConfig }),
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
