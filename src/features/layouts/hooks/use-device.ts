"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

export const useDevice = () => {
  // SSR 安全：默认桌面端，客户端挂载后更新
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT
  );

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // 初始检查
    checkDevice();

    // 监听窗口大小变化
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return {
    isMobile,
    isDesktop: !isMobile,
  };
};
