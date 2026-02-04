/** HTTP status codes dùng cho xử lý lỗi */
export const ENTITY_ERROR_STATUS = 422; // lỗi xác thực (validation)
export const AUTHENTICATION_ERROR_STATUS = 401; // lỗi xác thực (authen)

export interface EntityErrorResponse {
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
  payload: EntityErrorResponse;
  constructor({
    payload,
    status = 422,
  }: {
    status?: typeof ENTITY_ERROR_STATUS;
    payload: EntityErrorResponse;
  }) {
    super({ status, payload, message: "Entity Error" });
    this.payload = payload;
    this.status = status;
  }
}
