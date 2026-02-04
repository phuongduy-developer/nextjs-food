import http from "@/lib/http-client";
import {
  AccountResType,
  ChangePasswordV2BodyType,
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
};

export { accountApiRequest };
