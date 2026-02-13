import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "sonner";
import { isEqual, pick } from "lodash";
import { accessTokenKey, refreshTokenKey } from "@/constants/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const normalizePath = (path: string) =>
  path.startsWith("/") ? path.slice(1) : path;

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error?: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((error) => {
      setError(error.field, {
        message: error.message,
      });
    });
  } else {
    toast.error(error?.payload?.message || "Lỗi không xác định", {
      duration,
    });
  }
};

const isClient = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () =>
  isClient ? localStorage.getItem(accessTokenKey) : null;

export const getRefreshTokenFromLocalStorage = () =>
  isClient ? localStorage.getItem(refreshTokenKey) : null;

export const setAccessTokenToLocalStorage = (accessToken: string) =>
  isClient && localStorage.setItem(accessTokenKey, accessToken);

export const setRefreshTokenToLocalStorage = (refreshToken: string) =>
  isClient && localStorage.setItem(refreshTokenKey, refreshToken);

/**
 * Hàm so sánh 2 object có cùng các fields
 * @param obj1 - Object thứ nhất
 * @param obj2 - Object thứ hai
 * @param fields - Các fields cần so sánh
 * @returns true nếu 2 object bằng nhau, false nếu không bằng nhau
 * @example
 */
export const object = {
  isEqual: (
    obj1: Record<string, any>,
    obj2: Record<string, any>,
    ...fields: string[]
  ) => {
    if (fields.length > 0) {
      return isEqual(pick(obj1, ...fields), pick(obj2, ...fields));
    }

    return isEqual(obj1, obj2);
  },
};
