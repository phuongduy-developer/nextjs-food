import { NextResponse, NextRequest } from "next/server";
import { accessTokenKey, refreshTokenKey } from "@/constants/auth";
import { navigation } from "./constants/navigation";

const privatePaths = [navigation.MANAGE.GENERAL];
const unAuthPaths = [navigation.LOGIN];

// Helper function to check if pathname matches any path in the list
const matchesPath = (pathname: string, paths: string[]): boolean => {
  return paths.some((path) => pathname.startsWith(path));
};

// Helper function to create redirect URL
const createRedirectUrl = (path: string, baseUrl: string): URL => {
  return new URL(path, baseUrl);
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(accessTokenKey)?.value;
  const refreshToken = request.cookies.get(refreshTokenKey)?.value;
  const isAuthenticated = Boolean(refreshToken); // Nếu có refresh token thì đã đăng nhập
  const hasAccessToken = Boolean(accessToken); // accessToken chưa hết hạn
  const isPrivatePath = matchesPath(pathname, privatePaths);
  const isUnAuthPath = matchesPath(pathname, unAuthPaths);

  // Đăng nhập rồi thì không cho vào page login, vào trang chủ
  if (isUnAuthPath && isAuthenticated) {
    return NextResponse.redirect(
      createRedirectUrl(navigation.HOME, request.url),
    );
  }

  // Trường hợp đăng nhập rồi nhưng accessToken hết hạn
  if (isAuthenticated && isPrivatePath && !hasAccessToken) {
    const refreshTokenUrl = createRedirectUrl(
      navigation.REFRESHTOKEN,
      request.url,
    );
    refreshTokenUrl.searchParams.set(refreshTokenKey, refreshToken!);
    refreshTokenUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(refreshTokenUrl);
  }

  // Chưa đăng nhập thì không cho vào private path
  if (isPrivatePath && !isAuthenticated) {
    return NextResponse.redirect(
      createRedirectUrl(navigation.LOGIN, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/", "/login"],
};
