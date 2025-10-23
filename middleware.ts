import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "./lib/api/serverApi";

type SessionResult = {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpiresIn?: number;
  refreshTokenExpiresIn?: number;
} | null;

const ACCESS_COOKIE = "accessToken";
const REFRESH_COOKIE = "refreshToken";
const DEFAULT_ACCESS_TTL = 60 * 60;
const DEFAULT_REFRESH_TTL = 60 * 60 * 24 * 30;
const isProduction = process.env.NODE_ENV === "production";

function setAuthCookies(res: NextResponse, session: SessionResult) {
  if (!session) return;
  if (session.accessToken) {
    res.cookies.set({
      name: ACCESS_COOKIE,
      value: session.accessToken,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: isProduction,
      maxAge: session.accessTokenExpiresIn ?? DEFAULT_ACCESS_TTL,
    });
  }
  if (session.refreshToken) {
    res.cookies.set({
      name: REFRESH_COOKIE,
      value: session.refreshToken,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: isProduction,
      maxAge: session.refreshTokenExpiresIn ?? DEFAULT_REFRESH_TTL,
    });
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;

  const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivatePage = pathname.startsWith("/profile") || pathname.startsWith("/notes");

  const isApiOrAjax =
    pathname.startsWith("/api") ||
    pathname.startsWith("/me") ||
    pathname.startsWith("/session") ||
    req.headers.get("x-requested-with") === "XMLHttpRequest";
  if (isApiOrAjax) return NextResponse.next();

  if (accessToken) {
    if (isAuthPage && pathname !== "/profile") {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
    return NextResponse.next();
  }

  if (refreshToken) {
    try {
      const session = (await checkSession(refreshToken)) as SessionResult;

      if (session?.accessToken) {
        const res = (!isAuthPage || pathname === "/profile")
          ? NextResponse.next()
          : NextResponse.redirect(new URL("/profile", req.url));

        setAuthCookies(res, session);
        return res;
      } else {
        const res = NextResponse.next();
        res.cookies.delete(ACCESS_COOKIE);
        res.cookies.delete(REFRESH_COOKIE);
        if (isPrivatePage) return NextResponse.redirect(new URL("/sign-in", req.url));
        return res;
      }
    } catch (err) {
      console.error("Middleware: session refresh failed", err);
      const res = NextResponse.next();
      res.cookies.delete(ACCESS_COOKIE);
      res.cookies.delete(REFRESH_COOKIE);
      if (isPrivatePage) return NextResponse.redirect(new URL("/sign-in", req.url));
      return res;
    }
  }

  if (isPrivatePage) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
