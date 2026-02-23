import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Standardized API Response Format
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: unknown;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Success response (200, 201, etc.)
 */
export function successResponse<T>(
  data: T,
  message: string = "Success",
  status: number = 200,
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return NextResponse.json(response, { status });
}

/**
 * Error response (400, 401, 403, 404, 409, 500)
 */
export function errorResponse(
  error: string,
  status: number = 500,
  details?: unknown
): NextResponse<ApiResponse> {
  const response: ApiResponse = {
    success: false,
    error,
  };

  if (details) {
    response.details = details;
  }

  return NextResponse.json(response, { status });
}

/**
 * Handle Zod validation errors
 */
export function validationErrorResponse(error: ZodError): NextResponse<ApiResponse> {
  const formattedErrors = error.format();
  return errorResponse(
    "Validation failed",
    400,
    formattedErrors
  );
}

/**
 * Handle generic errors with proper error logging
 */
export function handleError(error: unknown, defaultMessage: string = "Internal server error"): NextResponse<ApiResponse> {
  if (error instanceof ZodError) {
    return validationErrorResponse(error);
  }

  if (error instanceof Error) {
    console.error("API Error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return errorResponse(error.message || defaultMessage, 500);
  }

  console.error("Unknown error:", error);
  return errorResponse(defaultMessage, 500);
}
