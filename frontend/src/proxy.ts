import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/signup", "/setprofile","/profile"];

export function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
        pathname.startsWith(route),
    );
    const token = req.cookies.get("rf_token")?.value;

    if (isPublicRoute && !token) {
        return NextResponse.next();
    }

    if (!isPublicRoute && !token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isPublicRoute && token) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    if (token) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
