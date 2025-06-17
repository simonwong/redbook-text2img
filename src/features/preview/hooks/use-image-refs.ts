import { useRef } from 'react';
import { useCallback } from 'react';

export const useImageRefs = () => {
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const refSetters = useRef<Record<number, (el: HTMLDivElement | null) => void>>({});

  const setImageRef = useCallback((idx: number) => {
    if (!refSetters.current[idx]) {
      refSetters.current[idx] = (el) => {
        imageRefs.current[idx] = el;
      };
    }
    return refSetters.current[idx];
  }, []);

  return { imageRefs, setImageRef };
};
