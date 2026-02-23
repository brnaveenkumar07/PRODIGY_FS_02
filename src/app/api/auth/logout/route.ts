import { NextRequest } from "next/server";
import { clearAuthCookie } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

/**
 * POST /api/auth/logout
 * Clear authentication cookie
 */
export async function POST(request: NextRequest) {
  try {
    await clearAuthCookie();
    return successResponse(null, "Logout successful", 200);
  } catch (error) {
    console.error("Logout error:", error);
    return errorResponse("Failed to logout", 500);
  }
}

