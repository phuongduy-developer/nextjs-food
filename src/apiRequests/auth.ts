import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";
import { LogoutParams } from "./type";

//nếu không truyền baseUrl (hoặc baseUrl === undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
//Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next JS server

const authApiRequest = {
  sLogin: (body: LoginBodyType) =>
    http.post<LoginResType>("/auth/login", {
      body,
    }),

  login: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", {
      body,
      baseUrl: "",
    }),
  slogout: ({ accessToken, refreshToken }: LogoutParams) => http.post<{ message: string }>('/auth/logout', {
    body: {
      refreshToken: refreshToken
    },
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }),
  logout: () => http.post<{ message: string }>('/api/auth/logout', {
    baseUrl: "",
  })

};

export default authApiRequest;
