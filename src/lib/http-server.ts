import "server-only";
import { cookies } from "next/headers";
import { normalizePath } from "./utils";
import { redirect } from "next/navigation";
import { accessTokenKey, refreshTokenKey } from "@/constants/auth";
import envConfig from "@/config";
import { EntityError } from "./http";

const ENTITY_ERROR_STATUS = 422; // lỗi xác thực cú pháp email...
const AUTHENTICATION_ERROR_STATUS = 401; // lỗi authen
interface EntityErrorResponse {
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

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(accessTokenKey)?.value;
  if (accessToken) {
    baseHeaders.Authorization = `Bearer ${accessToken}`;
  }

  const baseUrl = options?.baseUrl ?? envConfig.NEXT_PUBLIC_API_ENDPOINT;
  const fullUrl = baseUrl ? `${baseUrl}/${normalizePath(url)}` : `${normalizePath(url)}`;

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
          payload: EntityErrorResponse;
        }
      );
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      cookieStore.delete(accessTokenKey);
      cookieStore.delete(refreshTokenKey);
      redirect(`/logout?accessToken=${accessToken}`);
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

  return data;
};

const httpServer = {
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

export default httpServer;
