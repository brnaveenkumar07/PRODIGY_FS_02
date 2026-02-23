import { NextRequest } from "next/server";
import { CreateEmployeeSchema, EmployeeQuerySchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, validationErrorResponse, handleError } from "@/lib/api-response";
import { ZodError } from "zod";

/**
 * GET /api/employees
 * Get all employees with pagination and search
 * 
 * Query parameters:
 * - page: number (default: 1)
 * - limit: number (default: 10, max: 100)
 * - search: string (searches firstName, lastName, email, department)
 * - sortBy: firstName | lastName | email | department | createdAt
 * - sortOrder: asc | desc
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryData = {
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
      search: searchParams.get("search") ?? undefined,
      sortBy: searchParams.get("sortBy") ?? undefined,
      sortOrder: searchParams.get("sortOrder") || "asc",
    };

    // Validate query parameters
    let validatedQuery;
    try {
      validatedQuery = EmployeeQuerySchema.parse(queryData);
    } catch (error) {
      if (error instanceof ZodError) {
        return validationErrorResponse(error);
      }
      throw error;
    }

    const skip = (validatedQuery.page - 1) * validatedQuery.limit;

    // Build where clause for search
    const where = validatedQuery.search
      ? {
          OR: [
            { firstName: { contains: validatedQuery.search, mode: "insensitive" as const } },
            { lastName: { contains: validatedQuery.search, mode: "insensitive" as const } },
            { email: { contains: validatedQuery.search, mode: "insensitive" as const } },
            { department: { contains: validatedQuery.search, mode: "insensitive" as const } },
          ],
        }
      : {};

    // Get employees (exclude sensitive fields)
    const employees = await prisma.employee.findMany({
      where,
      skip,
      take: validatedQuery.limit,
      orderBy: validatedQuery.sortBy
        ? { [validatedQuery.sortBy]: validatedQuery.sortOrder }
        : { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        department: true,
        position: true,
        salary: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        // DO NOT include: createdByUserId
      },
    });

    // Get total count for pagination
    const total = await prisma.employee.count({ where });

    return successResponse(
      employees,
      "Employees retrieved successfully",
      200,
      {
        page: validatedQuery.page,
        limit: validatedQuery.limit,
        total,
        totalPages: Math.ceil(total / validatedQuery.limit),
      }
    );
  } catch (error) {
    return handleError(error, "Failed to retrieve employees");
  }
}

/**
 * POST /api/employees
 * Create a new employee
 * 
 * Request body:
 * {
 *   "firstName": "John",
 *   "lastName": "Doe",
 *   "email": "john@example.com",
 *   "phone": "+1234567890",
 *   "department": "Engineering",
 *   "position": "Senior Developer",
 *   "salary": 120000
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Get user ID from middleware (set in x-user-id header)
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return errorResponse("User not authenticated", 401);
    }

    const body = await request.json();

    // Validate request body
    let validatedData;
    try {
      validatedData = CreateEmployeeSchema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        return validationErrorResponse(error);
      }
      throw error;
    }

    // Check if email already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { email: validatedData.email },
    });

    if (existingEmployee) {
      return errorResponse("Employee with this email already exists", 409);
    }

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone || null,
        department: validatedData.department,
        position: validatedData.position,
        salary: validatedData.salary,
        status: "ACTIVE",
        createdByUserId: userId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        department: true,
        position: true,
        salary: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return successResponse(
      employee,
      "Employee created successfully",
      201
    );
  } catch (error) {
    return handleError(error, "Failed to create employee");
  }
}

