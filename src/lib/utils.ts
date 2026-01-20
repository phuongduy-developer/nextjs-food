import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import {
  accessTokenKey,
  EntityError,
  refreshTokenKey,
} from "./http";
import { toast } from "sonner";

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
