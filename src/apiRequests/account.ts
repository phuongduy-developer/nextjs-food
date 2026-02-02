import http from "@/lib/http";
import {
  AccountResType,
  ChangePasswordV2BodyType,
  ChangePasswordV2ResType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";

const accountApiRequest = {
  getMe: () => http.get<AccountResType>("/accounts/me"),
  updateMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>("/accounts/me", {
      body,
    }),
  sChangePassword: (body: ChangePasswordV2BodyType) =>
    http.put<ChangePasswordV2ResType>("/accounts/change-password-v2", {
      body,
    }),
  changePassword: (body: ChangePasswordV2BodyType) =>
    http.post<{ message: string }>("/api/account/change-password", {
      body,
      baseUrl: "",
    }),
};

export { accountApiRequest };
