import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Routes that don't require authentication
const publicRoutes = ["/login", "/", "/api/auth/login", "/api/auth/register"];

// Routes that require ADMIN role
const adminRoutes = ["/dashboard", "/api/employees"];

/**
 * Middleware for authentication and authorization
 * 
 * Protects:
 * - /dashboard routes (requires ADMIN role)
 * - /api/employees/* routes (requires ADMIN role)
 * 
 * Flow:
 * 1. Check if route is public → allow
 * 2. Check for valid auth token → deny if missing or invalid
 * 3. Check for ADMIN role on protected routes → deny if not ADMIN
 * 4. Add user info to request headers for API routes
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes without authentication
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Get the auth token from the cookie
  const token = request.cookies.get("auth_token")?.value;

  // If no token, deny access
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - No authentication token provided",
        },
        { status: 401 }
      );
    }
    // Redirect to login for UI routes
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verify the token
  const payload = await verifyToken(token);

  if (!payload) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized - Invalid or expired token",
        },
        { status: 401 }
      );
    }
    // Redirect to login for UI routes
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check if user has admin role for employee management routes
  const requiresAdmin = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (requiresAdmin && payload.role !== "ADMIN") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden - Admin access required",
        },
        { status: 403 }
      );
    }
    // Redirect to login for UI routes
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Add user info to request headers for use in API routes
  // WARNING: These headers are only accessible in server-side code, not from browser
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", payload.userId);
  requestHeaders.set("x-user-email", payload.email);
  requestHeaders.set("x-user-role", payload.role);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - .well-known (for SSL certificates, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|.well-known).*)",
  ],
};

