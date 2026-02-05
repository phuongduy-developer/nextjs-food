import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type LogoutMutationData = Awaited<ReturnType<typeof authApiRequest.logout>>;
type LoginMutationOptions = Omit<
  UseMutationOptions<LogoutMutationData, HttpError>,
  "mutationFn"
>;

export const useLogoutMutation = (options?: LoginMutationOptions) =>
  useMutation<LogoutMutationData, HttpError>({
    mutationFn: authApiRequest.logout,
    ...options,
  });
