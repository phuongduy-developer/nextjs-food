"use client";

import { refreshTokenKey } from "@/constants/auth";
import { navigation } from "@/constants/navigation";
import {
  checkAndRefreshToken,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function RefreshTokenPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const refreshTokenFromUrl = searchParams.get(refreshTokenKey);
  const redirectPathname = searchParams.get("redirect");
  
  useEffect(() => {
    if (
      refreshTokenFromUrl &&
      refreshTokenFromUrl === getRefreshTokenFromLocalStorage()
    ) {
      checkAndRefreshToken({
        onSuccess: () => router.replace(redirectPathname || navigation.HOME),
      });
    } else {
      router.replace(navigation.HOME)
    }
  }, [refreshTokenFromUrl, redirectPathname, router]);

  return <></>;
}
