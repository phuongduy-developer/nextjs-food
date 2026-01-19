import http from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";

const accountApiRequest = {
    getMe: () => http.get<AccountResType>('/accounts/me',)
}

export { accountApiRequest }