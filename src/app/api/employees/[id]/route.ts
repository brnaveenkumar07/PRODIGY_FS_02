import { NextRequest } from "next/server";
import { UpdateEmployeeSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, validationErrorResponse, handleError } from "@/lib/api-response";
import { ZodError } from "zod";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/employees/:id
 * Get a single employee by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Validate ID format
    if (!id || typeof id !== "string" || id.length === 0) {
      return errorResponse("Invalid employee ID", 400);
    }

    const employee = await prisma.employee.findUnique({
      where: { id },
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

    if (!employee) {
      return errorResponse("Employee not found", 404);
    }

    return successResponse(employee, "Employee retrieved successfully", 200);
  } catch (error) {
    return handleError(error, "Failed to retrieve employee");
  }
}

/**
 * PUT /api/employees/:id
 * Update an employee
 * 
 * Request body (all fields optional):
 * {
 *   "firstName": "Jane",
 *   "lastName": "Doe",
 *   "email": "jane@example.com",
 *   "phone": "+1234567890",
 *   "department": "Sales",
 *   "position": "Sales Manager",
 *   "salary": 150000
 * }
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Validate ID format
    if (!id || typeof id !== "string" || id.length === 0) {
      return errorResponse("Invalid employee ID", 400);
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return errorResponse("Employee not found", 404);
    }

    const body = await request.json();

    // Validate request body
    let validatedData;
    try {
      validatedData = UpdateEmployeeSchema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        return validationErrorResponse(error);
      }
      throw error;
    }

    // Check if email is being updated and if it already exists (for another employee)
    if (validatedData.email && validatedData.email !== employee.email) {
      const existingEmployee = await prisma.employee.findUnique({
        where: { email: validatedData.email },
      });

      if (existingEmployee && existingEmployee.id !== id) {
        return errorResponse("Employee with this email already exists", 409);
      }
    }

    // Update employee
    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: {
        ...(validatedData.firstName && { firstName: validatedData.firstName }),
        ...(validatedData.lastName && { lastName: validatedData.lastName }),
        ...(validatedData.email && { email: validatedData.email }),
        ...(validatedData.phone !== undefined && { phone: validatedData.phone || null }),
        ...(validatedData.department && { department: validatedData.department }),
        ...(validatedData.position && { position: validatedData.position }),
        ...(validatedData.salary && { salary: validatedData.salary }),
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
      updatedEmployee,
      "Employee updated successfully",
      200
    );
  } catch (error) {
    return handleError(error, "Failed to update employee");
  }
}

/**
 * DELETE /api/employees/:id
 * Delete an employee (hard delete)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Validate ID format
    if (!id || typeof id !== "string" || id.length === 0) {
      return errorResponse("Invalid employee ID", 400);
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      return errorResponse("Employee not found", 404);
    }

    // Delete employee
    await prisma.employee.delete({
      where: { id },
    });

    return successResponse(
      null,
      "Employee deleted successfully",
      200
    );
  } catch (error) {
    return handleError(error, "Failed to delete employee");
  }
}

