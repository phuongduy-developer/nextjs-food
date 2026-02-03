import httpServer from "@/lib/http-server";
import {
  ChangePasswordV2BodyType,
  ChangePasswordV2ResType,
} from "@/schemaValidations/account.schema";

const accountServerApiRequest = {
  sChangePassword: (body: ChangePasswordV2BodyType) =>
    httpServer.put<ChangePasswordV2ResType>("/accounts/change-password-v2", {
      body,
    }),
};

export { accountServerApiRequest };
