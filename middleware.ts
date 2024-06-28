// middleware.ts
import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  if ((req.nextUrl.pathname.startsWith("/cart") || req.nextUrl.pathname.startsWith("/routes") || req.nextUrl.pathname.startsWith("/admin")) && !isLoggedIn)
    return NextResponse.redirect(new URL("/", req.nextUrl.origin));
});

export const config = { matcher: ["/cart/:path*", "/routes/:path*", "/admin/:path*"] };
