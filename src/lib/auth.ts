import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

// Security: Use strongly generated JWT_SECRET, never default values
const JWT_SECRET: string = process.env.JWT_SECRET || (() => {
  throw new Error("CRITICAL: JWT_SECRET environment variable is not set. Generate a strong random key.");
})();

const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "7"; // days

// Validate JWT_SECRET length (minimum 32 bytes = 64 hex chars)
if (JWT_SECRET.length < 32) {
  console.warn("⚠️  WARNING: JWT_SECRET is shorter than recommended (32+ bytes). This is insecure in production.");
}

// Convert string secret to Uint8Array for jose
const getSecretKey = (): Uint8Array => {
  return new TextEncoder().encode(JWT_SECRET);
};

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}

/**
 * Generate a JWT token
 */
export async function generateToken(payload: JWTPayload): Promise<string> {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${JWT_EXPIRATION}d`)
      .sign(getSecretKey());
    return token;
  } catch (error) {
    console.error("Token generation failed:", error);
    throw new Error("Failed to generate authentication token");
  }
}

/**
 * Verify a JWT token with expiration and safety checks
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    if (!token || typeof token !== "string") {
      return null;
    }

    const verified = await jwtVerify(token, getSecretKey());
    const payload = verified.payload as JWTPayload;
    
    // Validate required fields
    if (!payload.userId || !payload.email || !payload.role) {
      console.warn("Invalid token payload structure");
      return null;
    }

    return payload;
  } catch (error) {
    // Don't log token values for security
    console.error("JWT verification failed:", error instanceof Error ? error.message : "Unknown error");
    return null;
  }
}

/**
 * Hash a password using bcrypt with secure salt rounds (10)
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error("Password hashing failed:", error);
    throw new Error("Failed to hash password");
  }
}

/**
 * Compare a password with its hashed version
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("Password comparison failed:", error);
    return false;
  }
}

/**
 * Set JWT token in HttpOnly cookie with security flags
 */
export async function setAuthCookie(token: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    const maxAgeSeconds = 60 * 60 * 24 * parseInt(JWT_EXPIRATION);
    
    cookieStore.set("auth_token", token, {
      httpOnly: true, // Prevents JavaScript access - CRITICAL for XSS protection
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "lax", // CSRF protection
      maxAge: maxAgeSeconds,
      path: "/",
    });
  } catch (error) {
    console.error("Failed to set auth cookie:", error);
    throw new Error("Failed to set authentication cookie");
  }
}

/**
 * Get JWT token from cookie (server-side only)
 */
export async function getAuthCookie(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("auth_token")?.value;
  } catch (error) {
    console.error("Failed to get auth cookie:", error);
    return undefined;
  }
}

/**
 * Clear auth cookie on logout
 */
export async function clearAuthCookie(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
  } catch (error) {
    console.error("Failed to clear auth cookie:", error);
    throw new Error("Failed to logout");
  }
}

/**
 * Get the current user from the JWT token in cookie
 */
export async function getCurrentUser(): Promise<JWTPayload | null> {
  try {
    const token = await getAuthCookie();
    if (!token) return null;
    return await verifyToken(token);
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}

