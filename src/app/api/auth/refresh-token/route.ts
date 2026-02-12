import { cookies } from "next/headers";

import { decode } from "jsonwebtoken";
import { HttpError } from "@/lib/http";
import authApiRequest from "@/apiRequests/auth";
import { refreshTokenKey } from "@/constants/auth";

export async function POST() {
  const cookieStore = await cookies();
  const refreshTokenStore = cookieStore.get(refreshTokenKey)?.value;

  if (!refreshTokenStore) {
    return Response.json(
      {
        message: "Không tìm thấy refreshToken",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const { payload } = await authApiRequest.sRefreshToken({
      refreshToken: refreshTokenStore,
    });
    const { accessToken, refreshToken } = payload.data;
    const decodedAccessToken = decode(accessToken) as { exp: number };
    const decodedRefreshToken = decode(refreshToken) as { exp: number };
    cookieStore.set("accessToken", accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedAccessToken.exp * 1000,
    });
    cookieStore.set("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodedRefreshToken.exp * 1000,
    });

    return Response.json(payload);
  } catch (error: any) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        {
          message: error?.message || "Có lỗi xảy ra",
        },
        {
          status: 401,
        },
      );
    }
  }
}
