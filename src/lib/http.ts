import { normalizePath } from "./utils";
import { redirect } from "next/navigation";
import envConfig from "@/config";
import { LoginResType } from "@/schemaValidations/auth.schema";

const ENTITY_ERROR_STATUS = 422; // lỗi xác thực cú pháp email...
const AUTHENTICATION_ERROR_STATUS = 401; // lỗi authen
interface EntityErrorPayload {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
}

export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({
    status,
    payload,
    message = "Http Error",
  }: {
    status: number;
    payload: {
      message: string;
      [key: string]: any;
    };
    message?: string;
  }) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: typeof ENTITY_ERROR_STATUS;
  payload: EntityErrorPayload;
  constructor({
    payload,
    status = 422,
  }: {
    status?: typeof ENTITY_ERROR_STATUS;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload, message: "Entity Error" }); // Lỗi thực thể
    //Tuy nhiên, trong TypeScript, đôi khi bạn sẽ thấy người ta viết lại như vậy vì lý do Thu hẹp kiểu dữ liệu (Type Narrowing).
    this.payload = payload;
    this.status = status;
  }
}

interface CustomOptions extends Omit<RequestInit, "method" | "body"> {
  baseUrl?: string | undefined;
  body?: Record<string, any>;
}

export interface StoreCookiesType {
  token?: string;
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

let clientLogoutRequest: null | Promise<any> = null; // tránh gọi logout 2 lần

const isClient = typeof window !== "undefined";

export const accessTokenKey = "accessToken";
export const refreshTokenKey = "refreshToken";
export const accessTokenExpiresAt = "accessTokenExpiresAt";

const request = async <Response>(
  method: HttpMethod,
  url: string,
  options?: CustomOptions
) => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options?.body;
  } else if (options?.body) {
    body = JSON.stringify(options?.body);
  }
  const baseHeaders: RequestInit["headers"] =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };
  //    Dùng hàm isClient() cho phép kiểm tra lại mỗi lần gọi, đảm bảo kết quả chính xác ở cả server và client.
  if (isClient) {
    const accessToken = localStorage.getItem(accessTokenKey);
    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`;
    }
  }
  //nếu không truyền baseUrl (hoặc baseUrl === undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  //Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next JS server

  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = `${baseUrl}/${normalizePath(url)}`;
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  });

  // successfull
  const payload: Response = await res.json();

  const data = {
    status: res.status,
    payload,
  };

  // unsuccessfull
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as {
          status: 422;
          payload: EntityErrorPayload;
        }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      // Trường hợp lỗi liên quan đến authen
      // client side
      if (isClient) {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: HttpMethod.POST,
            body: null, // Logout mình sẽ cho phép luôn luôn thành công
          });
          try {
            await clientLogoutRequest;
          } catch {
          } finally {
            localStorage.removeItem(accessTokenKey);
            localStorage.removeItem(refreshTokenKey);
            clientLogoutRequest = null;
            // Redirect về trang login có thể dẫn đến loop vô hạn
            // Nếu không không được xử lý đúng cách
            // Vì nếu rơi vào trường hợp tại trang Login, chúng ta có gọi các API cần access token
            // Mà access token đã bị xóa thì nó lại nhảy vào đây, và cứ thế nó sẽ bị lặp
            location.href = "/login";
          }
        }
      } else {
        // server side
        const accessToken = (options?.headers as any)?.Authorization.split(
          "Bearer " as string
        )[1];
        redirect(`/logout?accessToken=${accessToken}`);
      }
    } else {
      throw new HttpError(
        data as {
          status: number;
          payload: {
            message: string;
            [key: string]: any;
          };
        }
      );
    }
  }

  // Đảm bảo logic dưới đây chỉ chạy ở phía client (browser) để xét login và register
  if (isClient) {
    const normalizeUrl = normalizePath(url);
    if (normalizeUrl === "api/auth/login") {
      const { accessToken, refreshToken } = (payload as LoginResType).data;
      localStorage.setItem(accessTokenKey, accessToken);
      localStorage.setItem(refreshTokenKey, refreshToken);
    } else if (normalizeUrl === "api/auth/logout") {
      localStorage.removeItem(accessTokenKey);
      localStorage.removeItem(refreshTokenKey);
    }
  }

  return data;
};

const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, "body">) {
    return request<Response>(HttpMethod.GET, url, options);
  },

  post<Response>(url: string, options?: CustomOptions) {
    return request<Response>(HttpMethod.POST, url, options);
  },

  put<Response>(url: string, options?: CustomOptions) {
    return request<Response>(HttpMethod.PUT, url, options);
  },

  patch<Response>(url: string, options?: CustomOptions) {
    return request<Response>(HttpMethod.PATCH, url, options);
  },

  delete<Response>(url: string, options?: CustomOptions) {
    return request<Response>(HttpMethod.DELETE, url, options);
  },
};

export default http;
