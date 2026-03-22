"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async <T,>(
    endpoint: string,
    options: ApiRequestOptions & { body?: unknown } = {}
  ): Promise<ApiResponse<T>> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || "An error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
        return { error: errorMessage };
      }

      // Preserve server pagination (if provided) while keeping the
      // existing behaviour of returning `data` for convenience.
      return {
        data: data.data || data,
        pagination: data.pagination,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    request,
    isLoading,
    error,
  };
}

export async function apiCall<T>(
  endpoint: string,
  options: ApiRequestOptions & { body?: unknown } = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(endpoint, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "An error occurred" };
    }

    return { data: data.data || data, pagination: data.pagination };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "An error occurred" };
  }
}
