import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";
import { LogoutParams } from "./type";

//nếu không truyền baseUrl (hoặc baseUrl === undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
//Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next JS server

const authApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number;
    payload: RefreshTokenResType;
  }> | null,
  login: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", {
      body,
      baseUrl: "",
    }),
  logout: () =>
    http.post<{ message: string }>("/api/auth/logout", {
      baseUrl: "",
    }),
  sLogin: (body: LoginBodyType) =>
    http.post<LoginResType>("/auth/login", {
      body,
    }),

  slogout: ({ refreshToken, accessToken }: LogoutParams) =>
    http.post<{ message: string }>("/auth/logout", {
      body: {
        refreshToken,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),

  sRefreshToken: ({ refreshToken }: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>("/auth/refresh-token", {
      body: {
        refreshToken,
      },
    }),
  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      "/api/auth/refresh-token",
      {
        baseUrl: "",
      },
    );
    const result = this.refreshTokenRequest;
    this.refreshTokenRequest = null;
    return result;
  },
};

export default authApiRequest;
