import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";
import httpServer from "@/lib/http-server";

const authApiServerRequest = {
  sLogin: (body: LoginBodyType) =>
    httpServer.post<LoginResType>("/auth/login", {
      body,
    }),

  slogout: (refreshToken: string) =>
    httpServer.post<{ message: string }>("/auth/logout", {
      body: {
        refreshToken: refreshToken,
      },
    }),
};

export default authApiServerRequest;
