import type { StateStorage } from "zustand/middleware";

/**
 * 把连续写入合并成一次落盘：正文每次按键都会触发 persist，
 * 同步序列化全文再写 localStorage 会拖慢长文输入。
 * 页面隐藏或离开前立即落盘，刷新不丢最后几次按键。
 */
export function createDebouncedStorage(
  storage: Pick<Storage, "getItem" | "removeItem" | "setItem">,
  delay: number
): StateStorage {
  const pending = new Map<string, string>();
  let timer: ReturnType<typeof setTimeout> | undefined;

  const flush = () => {
    clearTimeout(timer);
    timer = undefined;
    for (const [name, value] of pending) {
      try {
        storage.setItem(name, value);
      } catch {
        // 配额已满：与 persist 默认行为一致，丢弃本次写入
      }
    }
    pending.clear();
  };

  if (typeof window !== "undefined") {
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        flush();
      }
    });
  }

  return {
    getItem: (name) => pending.get(name) ?? storage.getItem(name),
    removeItem: (name) => {
      pending.delete(name);
      storage.removeItem(name);
    },
    setItem: (name, value) => {
      pending.set(name, value);
      timer ??= setTimeout(flush, delay);
    },
  };
}
