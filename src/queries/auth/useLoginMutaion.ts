import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type LoginMutationData = Awaited<ReturnType<typeof authApiRequest.login>>;
type LoginMutationOptions = Omit<
  UseMutationOptions<LoginMutationData, HttpError, LoginBodyType>,
  "mutationFn"
>;

export const useLoginMutation = (options?: LoginMutationOptions) =>
  useMutation<LoginMutationData, HttpError, LoginBodyType>({
    mutationFn: authApiRequest.login,
    ...options,
  });
