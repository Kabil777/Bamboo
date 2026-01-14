import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const rfToken = req.cookies.get("rf_token");

    const isAuthRoute = req.nextUrl.pathname.startsWith("/login");

    console.log("HOST:", req.headers.get("host"));
    console.log("COOKIE:", req.cookies.get("rf_token"));
    if (!rfToken && !isAuthRoute) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (rfToken && isAuthRoute) {
        return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next|favicon.ico|public).*)"],
};
