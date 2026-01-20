import { mediaRequest } from "@/apiRequests/media";
import { HttpError } from "@/lib/http";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type UploadImageMutationData = Awaited<ReturnType<typeof mediaRequest.uploadImage>>;
type UploadImageMutationOptions = Omit<
    UseMutationOptions<UploadImageMutationData, HttpError, FormData>,
    "mutationFn"
>;

export const useUploadImage = (options?: UploadImageMutationOptions) =>
    useMutation<UploadImageMutationData, HttpError, FormData>({
        mutationFn: mediaRequest.uploadImage,
        ...options,
    });
