import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_ROUTES = ["/login", "/signup"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route),
  );
  const token = req.cookies.get("rf_token")?.value;

  // 🔓 Public routes
  if (isPublicRoute && !token) {
    return NextResponse.next();
  }

  // 🔒 Protected routes
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🔁 Logged-in users shouldn't see auth pages (only if token is valid)
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If token is present but invalid, redirect to login
  if (token) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
