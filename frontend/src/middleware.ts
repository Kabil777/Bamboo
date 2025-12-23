import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/callback"
    ) {
        return NextResponse.next();
    }
}

export const config = {
    matcher: ["/((?!_next|login|register).*)"],
};
