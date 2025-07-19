import { deleteCookie } from "cookies-next";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

export type Tokens = string;

export type UserType = {
  _id: string;
  exp: number;
  iat: number;
};

const loginUrls = ["/login", "/signup", "/forgot-password"];
const protectedRoutes = [
  "/",
  "/users",
  "/learning-hub",
  "/blog-manager",
  "/protraders",
  "/trading-simulator",
  "/email-center",
  "/analytics",
];

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  let isAuthenticated = false;
  const BASE_FRONTEND_URL = request.nextUrl.origin;
  const CURRENT_URL_PATHNAME = request.nextUrl.pathname;

  const strepleAuthToken = request.cookies.get("streple_auth_token");
  if (strepleAuthToken) {
    try {
      const authTokens = strepleAuthToken.value;
      const data = jwtDecode(authTokens) as UserType;
      const isExpired = dayjs.unix(data.exp).diff(dayjs()) < 1;

      if (!isExpired) {
        isAuthenticated = true;
      } else {
        deleteCookie("streple_auth_token", { req: request, res: response });
      }
    } catch (error) {
      console.error("Failed to decode JWT:", error);
    }
  }

  const hasRoute = (routes: Array<string>, currentPath: string) => {
    return routes.some((route) => {
      if (route === "/" && currentPath === "/") return true;

      if (route !== "/" && currentPath.startsWith(route))
        return currentPath === route || currentPath.startsWith(route + "/");

      return false;
    });

    // let isValid = false;

    // routes.forEach((route) => {
    //   const routeRegex = new RegExp(`^${route}(.*)$`);
    //   isValid = isValid || routeRegex.test(currentPath);
    // });

    // return isValid;
  };

  const buildUrl = (route: string) =>
    new URL(route, BASE_FRONTEND_URL).toString();

  if (
    !isAuthenticated &&
    hasRoute(protectedRoutes, CURRENT_URL_PATHNAME) &&
    CURRENT_URL_PATHNAME !== "/login"
  )
    return NextResponse.redirect(buildUrl("/login"));

  if (isAuthenticated && hasRoute(loginUrls, CURRENT_URL_PATHNAME))
    return NextResponse.redirect(buildUrl("/"));

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
