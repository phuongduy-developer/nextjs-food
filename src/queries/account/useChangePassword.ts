import { accountApiRequest } from "@/apiRequests/account";
import { HttpError } from "@/lib/http";
import { ChangePasswordV2BodyType } from "@/schemaValidations/account.schema";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type ChangePasswordMutationData = Awaited<
  ReturnType<typeof accountApiRequest.changePassword>
>;

type ChangePasswordMutationOptions = Omit<
  UseMutationOptions<ChangePasswordMutationData, HttpError, ChangePasswordV2BodyType>,
  "mutationFn"
>;

export const useChangePassword = (options?: ChangePasswordMutationOptions) =>
  useMutation<ChangePasswordMutationData, HttpError, ChangePasswordV2BodyType>({
    mutationFn: accountApiRequest.changePassword,
    ...options,
  });
