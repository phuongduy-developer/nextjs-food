"use client";

import { UNAUTHORIZED_PATH } from "@/constants/navigation";
import { TokenType } from "@/constants/type";
import {
  checkAndRefreshToken,
  getAccessTokenFromLocalStorage,
} from "@/lib/utils";
import { decode } from "jsonwebtoken";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

let interval: NodeJS.Timeout | undefined;

const RefreshToken = () => {
  const pathname = usePathname();
  useEffect(() => {
    if (Object.values(UNAUTHORIZED_PATH).includes(pathname)) return;

    // Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian TIMEOUT
    checkAndRefreshToken({
      onError() {
        clearInterval(interval);
      },
    });

    // Công thức TIMEOUT từ TTL access token (không hardcode):
    // - Refresh khi còn < ttl/3 → "cửa sổ refresh" = ttl/3 (giây).
    // - Check ít nhất 2 lần trong cửa sổ đó → interval = (ttl/3) / 2 = ttl/6 (giây).
    // - Đổi ra ms, giới hạn min/max để tránh interval quá nhỏ hoặc quá lớn.
    const getRefreshIntervalMs = (): number => {
      const accessToken = getAccessTokenFromLocalStorage();
      if (!accessToken) return 60_000; // default khi chưa có token
      try {
        const decoded = decode(accessToken) as TokenType;
        const ttlSeconds = decoded.exp - decoded.iat;
        const refreshWindowSeconds = ttlSeconds / 3;
        const intervalSeconds = refreshWindowSeconds / 2; // check 2 lần trong cửa sổ
        const TIMEOUT_MS = Math.round(intervalSeconds * 1000);
        const MIN_MS = 1000;
        const MAX_MS = 60_000;
        return Math.min(MAX_MS, Math.max(MIN_MS, TIMEOUT_MS));
      } catch {
        return 60_000;
      }
    };
    const TIMEOUT = getRefreshIntervalMs();
    interval = setInterval(() => {
      checkAndRefreshToken();
    }, TIMEOUT);

    return () => {
      clearInterval(interval);
    };
  }, [pathname]);

  return null;
};

export default RefreshToken;
