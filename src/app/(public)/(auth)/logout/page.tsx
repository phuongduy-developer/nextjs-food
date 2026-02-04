"use client";

import { refreshTokenKey } from "@/constants/auth";
import { navigation } from "@/constants/navigation";
import { getRefreshTokenFromLocalStorage } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/auth/useLogoutMutation";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshToken = searchParams.get(refreshTokenKey);

  const { mutate: logoutMutation } = useLogoutMutation({
    onSuccess() {
      router.push(navigation.LOGIN);
    },
  });
  useEffect(() => {
    if (refreshToken === getRefreshTokenFromLocalStorage()) {
      logoutMutation();
    }
  }, [logoutMutation, refreshToken]);

  return <div className="min-h-screen flex items-center justify-center"></div>;
}
