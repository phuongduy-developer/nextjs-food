"use client";

import { accessTokenKey, refreshTokenKey } from "@/constants/auth";
import { navigation } from "@/constants/navigation";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogoutMutation } from "@/queries/auth/useLogoutMutation";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get(refreshTokenKey);
  const accessTokenFromUrl = searchParams.get(accessTokenKey);

  const { mutate: logoutMutation } = useLogoutMutation({
    onSuccess() {
      router.replace(navigation.LOGIN);
    },
  });
  
  useEffect(() => {
    if (
      (refreshTokenFromUrl &&
        refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) ||
      (accessTokenFromUrl &&
        accessTokenFromUrl === getAccessTokenFromLocalStorage()) // server componetnt trong http khi bị 401
    ) {
      logoutMutation();
    }
  }, [logoutMutation, refreshTokenFromUrl, accessTokenFromUrl]);

  // useEffect(() => {
  //   if (ref.current) return;
  //   ref.current = mutateAsync;
  //   mutateAsync().then((res) => {
  //     setTimeout(()=> {
  //       ref.current = null;
  //     }, 1000);
  //     router.replace(navigation.LOGIN)
  //   });
  // }, [refreshTokenFromUrl, accessTokenFromUrl]);

  return <></>
}
