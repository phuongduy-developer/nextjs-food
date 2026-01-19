import { NextResponse, NextRequest } from "next/server";
import { accessTokenKey } from "./lib/http";
import { navigation, UNAUTHORIZED_PATH } from "./constants/navigation";

const privatePaths = [navigation.MANAGE.dashboard];
const unAuthPaths = Object.values(UNAUTHORIZED_PATH);

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuth = Boolean(request.cookies.get(accessTokenKey)?.value);
  // Chưa đăng nhập thì khônng cho vào private path
  if (privatePaths.some((path) => path.startsWith(pathname)) && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Đăng nhập rồi thì không cho vào page login, vào trang chủ
  if (unAuthPaths.some((path) => path.startsWith(pathname)) && isAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", '/login'],
};
