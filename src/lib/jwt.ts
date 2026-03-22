import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET: string = process.env.JWT_SECRET || (() => {
  throw new Error(
    "CRITICAL: JWT_SECRET environment variable is not set. Generate a strong random key."
  );
})();

const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "7";

if (JWT_SECRET.length < 32) {
  console.warn(
    "WARNING: JWT_SECRET is shorter than recommended (32+ bytes). This is insecure in production."
  );
}

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

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    if (!token || typeof token !== "string") {
      return null;
    }

    const verified = await jwtVerify(token, getSecretKey());
    const payload = verified.payload as JWTPayload;

    if (!payload.userId || !payload.email || !payload.role) {
      console.warn("Invalid token payload structure");
      return null;
    }

    return payload;
  } catch (error) {
    console.error(
      "JWT verification failed:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return null;
  }
}

export function getJwtExpirationDays(): number {
  const parsed = Number.parseInt(JWT_EXPIRATION, 10);
  return Number.isNaN(parsed) ? 7 : parsed;
}
