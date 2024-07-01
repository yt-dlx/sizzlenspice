// middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  if (!isLoggedIn) {
    if (req.nextUrl.pathname.startsWith("/cart") || req.nextUrl.pathname.startsWith("/base")) {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
  }
});
export const config = { matcher: ["/cart/:path*", "/base/:path*"] };
