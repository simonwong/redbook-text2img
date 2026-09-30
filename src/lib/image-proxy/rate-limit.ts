interface Window {
  count: number;
  resetAt: number;
}

const maxTrackedKeys = 10_000;

/**
 * 固定窗口限流，状态只在当前进程内。Serverless 下每个实例各自计数，
 * 只能压住单实例上的连续滥用，不是全局配额。
 */
export function createRateLimiter(
  limit: number,
  windowMs: number,
  now: () => number = Date.now
) {
  const windows = new Map<string, Window>();

  return (key: string): boolean => {
    const time = now();
    const current = windows.get(key);
    if (current && current.resetAt > time) {
      current.count += 1;
      return current.count <= limit;
    }
    if (windows.size >= maxTrackedKeys) {
      for (const [tracked, window] of windows) {
        if (window.resetAt <= time) {
          windows.delete(tracked);
        }
      }
      if (windows.size >= maxTrackedKeys) {
        windows.clear();
      }
    }
    windows.set(key, { count: 1, resetAt: time + windowMs });
    return true;
  };
}
