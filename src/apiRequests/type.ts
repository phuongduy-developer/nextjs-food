import { LogoutBodyType } from "@/schemaValidations/auth.schema"

interface LogoutParams extends LogoutBodyType {
    accessToken: string
}

export type { LogoutParams }