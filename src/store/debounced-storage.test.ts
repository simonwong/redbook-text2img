import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { createDebouncedStorage } from "./debounced-storage";

function createBackingStorage() {
  const items = new Map<string, string>();
  return {
    getItem: (name: string) => items.get(name) ?? null,
    removeItem: vi.fn((name: string) => {
      items.delete(name);
    }),
    setItem: vi.fn((name: string, value: string) => {
      items.set(name, value);
    }),
  };
}

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

it("连续写入只落盘一次，且落盘的是最后一次的值", () => {
  const backing = createBackingStorage();
  const storage = createDebouncedStorage(backing, 300);
  storage.setItem("doc", "a");
  storage.setItem("doc", "ab");
  expect(backing.setItem).not.toHaveBeenCalled();
  vi.advanceTimersByTime(300);
  expect(backing.setItem).toHaveBeenCalledTimes(1);
  expect(backing.getItem("doc")).toBe("ab");
});

it("落盘前读取拿到尚未写入的值", () => {
  const storage = createDebouncedStorage(createBackingStorage(), 300);
  storage.setItem("doc", "a");
  expect(storage.getItem("doc")).toBe("a");
});

it("删除会取消尚未落盘的写入", () => {
  const backing = createBackingStorage();
  const storage = createDebouncedStorage(backing, 300);
  storage.setItem("doc", "a");
  storage.removeItem("doc");
  vi.advanceTimersByTime(300);
  expect(backing.setItem).not.toHaveBeenCalled();
  expect(storage.getItem("doc")).toBeNull();
});

it("写入失败不抛出", () => {
  const backing = createBackingStorage();
  backing.setItem.mockImplementation(() => {
    throw new Error("quota");
  });
  const storage = createDebouncedStorage(backing, 300);
  storage.setItem("doc", "a");
  expect(() => vi.advanceTimersByTime(300)).not.toThrow();
});
