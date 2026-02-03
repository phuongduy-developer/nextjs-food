import http from "@/lib/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

//nếu không truyền baseUrl (hoặc baseUrl === undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
//Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next JS server

const authApiRequest = {
  login: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", {
      body,
      baseUrl: "",
    }),
  logout: () => http.post<{ message: string }>('/api/auth/logout', {
    baseUrl: "",
  })

};

export default authApiRequest;
