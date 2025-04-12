/* eslint-disable @typescript-eslint/no-unused-vars */
import VerifyTokenAction from "@/actions/verify";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyUser } from "./lib/service/user";

export async function middleware(req: NextRequest) {
  // Get the current path
  const currentPath = req.nextUrl.pathname;

  // Get token from query params or cookies
  const queryToken = req.nextUrl.searchParams.get("token");
  const cookieToken = req.cookies.get("auth_token")?.value;
  const token = queryToken || cookieToken;

  const phoneNumber = req.nextUrl.searchParams.get("phone");

  // Allow access to login, signup, and OTP pages without token
  if (
    (!token &&
      (currentPath.includes("/login") || currentPath.includes("/signup"))) ||
    (phoneNumber && currentPath.includes("/otp"))
  ) {
    return NextResponse.next();
  }

  // Redirect to login if no token is found
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verify the token
    const user = await verifyUser(token);
    const decoded = user.data;

    // If we have a verified user with token in query param, set it as a cookie
    if (queryToken && decoded.data.userId) {
      console.log("we are here 2", req.nextUrl);
      const response = NextResponse.redirect(
        new URL("/dashboard/home", req.url)
      );
      response.cookies.set("auth_token", queryToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
      return response;
    }

    // For already authenticated users trying to access login/signup pages
    if (
      currentPath === "/login" ||
      currentPath === "/signup" ||
      currentPath === "/otp"
    ) {
      return NextResponse.redirect(new URL("/dashboard/home", req.url));
    }
    if (currentPath === "/" || currentPath === "/dashboard") {
      return NextResponse.redirect(new URL("/dashboard/home", req.url));
    }
    return NextResponse.next({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);

    // If token verification fails but we're already on the login page, don't redirect
    if (currentPath.includes("/login")) {
      return NextResponse.next();
    }

    // Otherwise redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ["/(auth)/:path*", "/", "/:path", "/dashboard", "/dashboard/:path*"],
};
