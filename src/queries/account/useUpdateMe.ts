import { accountApiRequest } from "@/apiRequests/account";
import { HttpError } from "@/lib/http";
import { UpdateMeBodyType } from "@/schemaValidations/account.schema";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type UpdateMeMutationData = Awaited<ReturnType<typeof accountApiRequest.updateMe>>;
type UploadImageMutationOptions = Omit<
    UseMutationOptions<UpdateMeMutationData, HttpError, UpdateMeBodyType>,
    "mutationFn"
>;

export const useUpdateMe = (options?: UploadImageMutationOptions) =>
    useMutation<UpdateMeMutationData, HttpError, UpdateMeBodyType>({
        mutationFn: accountApiRequest.updateMe,
        ...options,
    });
