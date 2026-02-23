import { NextRequest } from "next/server";
import { LoginSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import { comparePassword, setAuthCookie, generateToken } from "@/lib/auth";
import { successResponse, errorResponse, validationErrorResponse } from "@/lib/api-response";
import { ZodError } from "zod";

/**
 * POST /api/auth/login
 * Authenticate user and set HttpOnly JWT cookie
 * 
 * Request body:
 * {
 *   "email": "admin@ems.com",
 *   "password": "Admin@123"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    let validatedData;

    try {
      validatedData = LoginSchema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        return validationErrorResponse(error);
      }
      throw error;
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      // Generic error message for security (don't reveal if email exists)
      return errorResponse("Invalid email or password", 401);
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(
      validatedData.password,
      user.password
    );

    if (!isPasswordValid) {
      return errorResponse("Invalid email or password", 401);
    }

    // Generate JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Set the JWT cookie
    await setAuthCookie(token);

    // Return success response (do NOT return token in body, it's in httpOnly cookie)
    return successResponse(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      "Login successful",
      200
    );
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Internal server error", 500);
  }
}

