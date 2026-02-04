import { NextResponse, NextRequest } from "next/server";
import { accessTokenKey, refreshTokenKey } from "@/constants/auth";
import { navigation, UNAUTHORIZED_PATH } from "./constants/navigation";

const privatePaths = [navigation.MANAGE.DASHBOARD, navigation.MANAGE.SETTING];
const unAuthPaths = Object.values(UNAUTHORIZED_PATH);

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // const isAuth = Boolean(request.cookies.get(accessTokenKey)?.value);
  const accessToken = request.cookies.get(accessTokenKey)?.value;
  const refreshToken = request.cookies.get(refreshTokenKey)?.value || "";

  // Chưa đăng nhập thì không cho vào private path
  if (privatePaths.some((path) => path.startsWith(pathname)) && !refreshToken) {
    return NextResponse.redirect(new URL(navigation.LOGIN, request.url));
  }

  // Đăng nhập rồi thì không cho vào page login, vào trang chủ
  if (unAuthPaths.some((path) => path.startsWith(pathname)) && refreshToken) {
    return NextResponse.redirect(new URL(navigation.HOME, request.url));
  }

  // Trường hợp đăng nhập rồi nhưng accessToken hết hạn
  if (
    privatePaths.some((path) => path.startsWith(pathname)) &&
    !accessToken &&
    refreshToken
  ) {
    const url = new URL(navigation.LOGOUT, request.url);
    url.searchParams.set(refreshTokenKey, refreshToken);

    return NextResponse.redirect(new URL(url, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/login", "/logout"],
};
