import { accountApiRequest } from "@/apiRequests/account";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type GetMeQueryData = Awaited<ReturnType<typeof accountApiRequest.getMe>>;
type GetMeQueryOptions = Omit<UseQueryOptions<GetMeQueryData>, 'queryKey' | 'queryFn'>;

export const useGetMe = (options?: GetMeQueryOptions) =>
    useQuery({
        queryKey: ['me'],
        queryFn: accountApiRequest.getMe,
        ...options,
    });
