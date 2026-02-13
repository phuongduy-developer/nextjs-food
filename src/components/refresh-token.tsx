"use client";

import authApiRequest from "@/apiRequests/auth";
import { UNAUTHORIZED_PATH } from "@/constants/navigation";
import { TokenType } from "@/constants/type";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import { decode } from "jsonwebtoken";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

let interval: NodeJS.Timeout | undefined;

const RefreshToken = () => {
  const pathname = usePathname();
  console.log("pathname", pathname);
  useEffect(() => {
    if (Object.values(UNAUTHORIZED_PATH).includes(pathname)) return;

    const checkAndRefreshToken = async () => {
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
      if (decodedRefreshToken.exp <= now) return;
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
        } catch (error) {
          clearInterval(interval);
        }
      }
    };
    // Phải gọi lần đầu tiên, vì interval sẽ chạy sau thời gian TIMEOUT
    checkAndRefreshToken();

    // Timeout interval phải bé hơn thời gian hết hạn của access token
    // Ví dụ thời gian hết hạn access token là 10s thì 1s mình sẽ cho check 1 lần
    const TIMEOUT = 1000;
    interval = setInterval(async () => {
      checkAndRefreshToken();
    }, TIMEOUT);
  }, [pathname]);

  return null;
};

export default RefreshToken;
