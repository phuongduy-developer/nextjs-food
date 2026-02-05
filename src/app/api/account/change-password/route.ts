import { cookies } from "next/headers";

import { decode } from "jsonwebtoken";
import { HttpError } from "@/lib/http";
import { ChangePasswordV2BodyType } from "@/schemaValidations/account.schema";
import { accountApiRequest } from "@/apiRequests/account";
import { accessTokenKey } from "@/constants/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as ChangePasswordV2BodyType;
  const cookieStore = await cookies();
  const accessTokenStore = cookieStore.get(accessTokenKey)?.value;
  if (!accessTokenStore) {
    return Response.json(
      {
        message: "Không tìm thấy access token",
      },
      {
        status: 401,
      }
    );
  }
  try {
    const { payload } = await accountApiRequest.sChangePassword(
      body,
      accessTokenStore
    );
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
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        {
          message: "Có lỗi xảy ra",
        },
        {
          status: 500,
        }
      );
    }
  }
}
