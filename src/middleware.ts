import { deleteCookie } from "cookies-next";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from "next/server";

type ROLE = "FOLLOWER" | "ADMIN" | "SUPER_ADMIN" | "PRO_TRADER" | "PUBLISHER";

type UserType = {
  sub: string;
  role: ROLE;
  exp: number;
  iat: number;
};

const loginUrls = ["/login"];
const routes = {
  SUPER_ADMIN: [
    "/",
    "/users",
    "/learning-hub",
    "/blog-manager",
    "/protraders",
    "/trading-simulator",
    "/email-center",
    "/feeback",
    "/analytics",
  ],
  PRO_TRADERS: ["/", "/protraders"],
  PUBLISHER: ["/", "blog-manager", "/learning-hub"],
  ADMIN: [
    "/",
    "/users",
    "/learning-hub",
    "/blog-manager",
    "/protraders",
    "/trading-simulator",
    "/email-center",
    "/feeback",
    "/analytics",
  ],
};

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  let isAuthenticated = false;
  const BASE_FRONTEND_URL = request.nextUrl.origin;
  const CURRENT_URL_PATHNAME = request.nextUrl.pathname;
  let data: UserType | null = null;

  const strepleAuthToken = request.cookies.get("streple_auth_token");
  if (strepleAuthToken)
    try {
      const authTokens = strepleAuthToken.value;
      data = jwtDecode(authTokens) as UserType;

      const isExpired = dayjs.unix(data.exp).diff(dayjs()) < 1;

      if (!isExpired) isAuthenticated = true;
      else deleteCookie("streple_auth_token", { req: request, res: response });
    } catch (error) {
      console.error("Failed to decode JWT:", error);
    }

  const hasRoute = (routes: Array<string>, currentPath: string) => {
    return routes.some((route) => {
      if (route === "/" && currentPath === "/") return true;

      if (route !== "/" && currentPath.startsWith(route))
        return currentPath === route || currentPath.startsWith(route + "/");

      return false;
    });
  };

  const buildUrl = (route: string) =>
    new URL(route, BASE_FRONTEND_URL).toString();

  if (!isAuthenticated && !loginUrls.includes(CURRENT_URL_PATHNAME))
    return NextResponse.redirect(buildUrl("/login"));

  if (isAuthenticated && loginUrls.includes(CURRENT_URL_PATHNAME))
    return NextResponse.redirect(buildUrl("/"));

  if (isAuthenticated && data && !Object.keys(routes).includes(data.role)) {
    deleteCookie("streple_auth_token", { req: request, res: response });
    return NextResponse.redirect("https://app.streple.com");
  }

  if (
    isAuthenticated &&
    data &&
    !hasRoute(routes[data.role], CURRENT_URL_PATHNAME)
  )
    return NextResponse.redirect(buildUrl("/"));

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
