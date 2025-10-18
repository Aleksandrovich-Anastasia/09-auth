import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // або "accessToken", залежно від бекенду
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isPrivatePage = pathname.startsWith("/profile") || pathname.startsWith("/notes");

  // Якщо користувач неавторизований і намагається відкрити приватну сторінку → редірект на /sign-in
  if (isPrivatePage && !token) {
    const loginUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Якщо користувач авторизований і відкриває сторінку логіну/реєстрації → редірект на /profile
  if (isAuthPage && token) {
    const profileUrl = new URL("/profile", req.url);
    return NextResponse.redirect(profileUrl);
  }

  return NextResponse.next();
}

// Вказуємо, які маршрути перевіряємо
export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
