import { cookies } from "next/headers";

import { HttpError } from "@/lib/http";
import { accessTokenKey, refreshTokenKey } from "@/constants/auth";
import authApiRequest from "@/apiRequests/auth";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(refreshTokenKey)?.value;
  const accessToken = cookieStore.get(accessTokenKey)?.value;
  try {
    if (refreshToken && accessToken) {
      const { payload } = await authApiRequest.slogout({
        refreshToken,
        accessToken,
      });

      return Response.json(payload);
    }
    return Response.json(
      {
        message: "Không nhận được access token hoặc access token",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        {
          message: "Có lỗi xảy ra khi gọi đến Backend server",
        },
        {
          status: 200,
        }
      );
    }
  } finally {
    cookieStore.delete(accessTokenKey);
    cookieStore.delete(refreshTokenKey);
  }
}
