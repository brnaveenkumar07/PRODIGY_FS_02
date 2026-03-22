import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import {
  generateToken,
  getJwtExpirationDays,
  type JWTPayload,
  verifyToken,
} from "@/lib/jwt";

export { generateToken, type JWTPayload, verifyToken };

export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error("Password hashing failed:", error);
    throw new Error("Failed to hash password");
  }
}

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

export async function setAuthCookie(token: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    const maxAgeSeconds = 60 * 60 * 24 * getJwtExpirationDays();

    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: maxAgeSeconds,
      path: "/",
    });
  } catch (error) {
    console.error("Failed to set auth cookie:", error);
    throw new Error("Failed to set authentication cookie");
  }
}

export async function getAuthCookie(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("auth_token")?.value;
  } catch (error) {
    console.error("Failed to get auth cookie:", error);
    return undefined;
  }
}

export async function clearAuthCookie(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
  } catch (error) {
    console.error("Failed to clear auth cookie:", error);
    throw new Error("Failed to logout");
  }
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
  try {
    const token = await getAuthCookie();
    if (!token) {
      return null;
    }

    return await verifyToken(token);
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}
