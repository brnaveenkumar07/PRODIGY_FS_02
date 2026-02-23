import { z } from "zod";

// ========== Auth Schemas ==========
export const LoginSchema = z.object({
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters").max(255),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(255)
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

// ========== Employee Schemas ==========
export const CreateEmployeeSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Invalid email address").toLowerCase(),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  department: z.string().trim().min(1, "Department is required").max(100),
  position: z.string().trim().min(1, "Position is required").max(100),
  salary: z.number().positive("Salary must be greater than 0").max(999999999),
});

export type CreateEmployeeInput = z.infer<typeof CreateEmployeeSchema>;

export const UpdateEmployeeSchema = CreateEmployeeSchema.partial();

export type UpdateEmployeeInput = z.infer<typeof UpdateEmployeeSchema>;

// Pagination & Search
export const EmployeeQuerySchema = z.object({
  page: z.string()
    .regex(/^\d+$/, "Page must be a positive number")
    .transform(Number)
    .pipe(z.number().int().min(1, "Page must be at least 1"))
    .default(1),
  limit: z.string()
    .regex(/^\d+$/, "Limit must be a positive number")
    .transform(Number)
    .pipe(z.number().int().min(1, "Limit must be at least 1").max(100, "Limit cannot exceed 100"))
    .default(10),
  search: z.string().trim().max(255).optional().or(z.literal("")).nullable().optional(),
  sortBy: z.enum(["firstName", "lastName", "email", "department", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type EmployeeQueryInput = z.infer<typeof EmployeeQuerySchema>;

