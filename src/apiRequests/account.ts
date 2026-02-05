import http from "@/lib/http";
import {
  AccountResType,
  ChangePasswordV2BodyType,
  ChangePasswordV2ResType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";

// Chỉ dùng cho client. Server dùng account-server.ts (có http-server/server-only).
const accountApiRequest = {
  getMe: () => http.get<AccountResType>("/accounts/me"),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>("/accounts/me", {
      body,
    }),
  changePassword: (body: ChangePasswordV2BodyType) =>
    http.post<{ message: string }>("/api/account/change-password", {
      body,
      baseUrl: "",
    }),

  sChangePassword: (body: ChangePasswordV2BodyType, accessToken: string) =>
    http.put<ChangePasswordV2ResType>("/accounts/change-password-v2", {
      body,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
};

export { accountApiRequest };
