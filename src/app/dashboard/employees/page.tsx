"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { EmployeeTable, EmployeeRow } from "@/components/EmployeeTable";
import { EmployeeFormDialog } from "@/components/EmployeeFormDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { useApi } from "@/hooks/useApi";
import { CreateEmployeeInput } from "@/lib/validators";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function EmployeesPage() {
  const { request, isLoading } = useApi();
  const [employees, setEmployees] = useState<EmployeeRow[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeRow | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEmployees = useCallback(async () => {
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
      ...(searchQuery && { search: searchQuery }),
    });

    const result = await request<{
      data: EmployeeRow[];
      pagination: PaginationData;
    }>(`/api/employees?${params}`);

    if (result.data) {
      // Handle both direct array response and nested object response.
      // `useApi` now returns `pagination` at the top level when the server provides it.
      const employees = Array.isArray(result.data) ? result.data : result.data.data;
      const paginationData = result.pagination ?? (Array.isArray(result.data) ? undefined : result.data.pagination);

      setEmployees(employees || []);
      if (paginationData) {
        setPagination(paginationData);
      }
    }
  }, [pagination.limit, pagination.page, request, searchQuery]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleCreateEmployee = async (
    data: CreateEmployeeInput,
    employeeId?: string
  ) => {
    setIsSaving(true);
    try {
      if (employeeId) {
        // Update employee
        const result = await request(`/api/employees/${employeeId}`, {
          method: "PUT",
          body: data,
        });

        if (!result.error) {
          toast.success("Employee updated successfully");
          await fetchEmployees();
        }
      } else {
        // Create employee
        const result = await request("/api/employees", {
          method: "POST",
          body: data,
        });

        if (!result.error) {
          toast.success("Employee created successfully");
          setPagination({ ...pagination, page: 1 });
          await fetchEmployees();
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;

    setIsDeleting(true);
    try {
      const result = await request(`/api/employees/${selectedEmployee.id}`, {
        method: "DELETE",
      });

      if (!result.error) {
        toast.success("Employee deleted successfully");
        setSelectedEmployee(null);
        await fetchEmployees();
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Employees</h1>
          <p className="text-slate-600 mt-1">
            Manage and view all employees in the system
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedEmployee(null);
            setFormOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, email, or department..."
                className="pl-10"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            All Employees ({pagination.total})
          </CardTitle>
          <CardDescription>
            Showing {employees.length} of {pagination.total} employees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeTable
            employees={employees}
            isLoading={isLoading}
            onEdit={(employee) => {
              setSelectedEmployee(employee);
              setFormOpen(true);
            }}
            onDelete={(employee) => {
              setSelectedEmployee(employee);
              setDeleteOpen(true);
            }}
          />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setPagination({
                          ...pagination,
                          page: Math.max(1, pagination.page - 1),
                        })
                      }
                      className={
                        pagination.page === 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() =>
                            setPagination({ ...pagination, page })
                          }
                          isActive={page === pagination.page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPagination({
                          ...pagination,
                          page: Math.min(
                            pagination.totalPages,
                            pagination.page + 1
                          ),
                        })
                      }
                      className={
                        pagination.page === pagination.totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EmployeeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        employee={selectedEmployee || undefined}
        onSubmit={handleCreateEmployee}
        isLoading={isSaving}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Employee"
        description={`Are you sure you want to delete ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}? This action cannot be undone.`}
        onConfirm={handleDeleteEmployee}
        isLoading={isDeleting}
      />
    </div>
  );
}
