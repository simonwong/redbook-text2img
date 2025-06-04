import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { StyleConfig } from '@/lib/image-style-config';
import { defaultStyles } from '@/lib/default-styles';

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
