import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "sonner";
import { isEqual, pick } from "lodash";
import { accessTokenKey, refreshTokenKey } from "@/constants/auth";
import { decode } from "jsonwebtoken";
import { TokenType } from "@/constants/type";
import authApiRequest from "@/apiRequests/auth";

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

export const removeTokenFromLocalStorage = () => {
  if (isClient) {
    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(refreshTokenKey);
  }
};

export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
  //Không nên đưa logic lấy access và refresh token ra khỏi cái function 'checkAndRefreshToken'
  // Vì mỗi lần mà checkAndRefreshToken() được gọi thì chúng ta sẽ có một access và refresh token mới
  //Tránh hiện tượng bug nó lấy access và refresh token cũ ở lần đầu rồi gọi cho các lần tiếp theo
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();

  // Chưa đăng nhập thì cũng không cho chạy
  if (!accessToken || !refreshToken) return;

  // Kiểm tra token có hết hạn không
  const decodedAccessToken = decode(accessToken) as TokenType;
  const decodedRefreshToken = decode(refreshToken) as TokenType;

  // Thời điểm hết hạn của token là tính theo epoch time (s)
  // Còn khi các bạn dùng cú pháp new Date().getTime() thì nó sẽ trả về epoch time (ms)

  const now = Math.round(new Date().getTime() / 1000);

  //trường hợp refreshToken hết hạn thì không xử lí nữa
  if (decodedRefreshToken.exp <= now) {
    removeTokenFromLocalStorage();
    return param?.onError?.();
  }
  // Ví dụ access token của chúng ta có thời gian hết hạn là 10s
  // thì mình sẽ kiểm tra còn 1/3 thời gian (3s) thì mình sẽ cho refresh token lại
  // Thời gian còn lại sẽ tính dựa trên công thức: decodedAccessToken.exp - now
  // Khoảng thời gian hết hạn của access token dựa trên công thức: decodedAccessToken.exp - decodedAccessToken.iat
  if (
    decodedAccessToken.exp - now <
    (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  ) {
    try {
      const res = await authApiRequest.refreshToken();
      setAccessTokenToLocalStorage(res.payload.data.accessToken);
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
      param?.onSuccess?.();
    } catch {
      param?.onError?.();
    }
  }
};
