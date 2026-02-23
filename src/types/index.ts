/**
 * User Types
 */
export interface User {
  id: string;
  email: string;
  role: 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword extends User {
  password: string;
}

/**
 * Employee Types
 */
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  salary: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeWithCreator extends Employee {
  createdBy: string;
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Auth Types
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Form Input Types
 */
export interface CreateEmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  salary: number;
}

export interface UpdateEmployeeFormData extends Partial<CreateEmployeeFormData> {}

/**
 * Query Types
 */
export interface EmployeeListQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'firstName' | 'lastName' | 'email' | 'department';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Hook Types
 */
export interface UseApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
}

export interface UseApiState {
  isLoading: boolean;
  error: string | null;
}
