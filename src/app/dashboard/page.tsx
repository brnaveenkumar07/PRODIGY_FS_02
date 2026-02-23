"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, AlertCircle } from "lucide-react";
import { useApi } from "@/hooks/useApi";

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
}

export default function DashboardPage() {
  const { request, isLoading, error } = useApi();
  const [stats, setStats] = useState<{ total: number } | null>(null);
  const [recentEmployees, setRecentEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      // Get total employees count
      const result = await request<{
        data: Employee[];
        pagination: { total: number };
      }>("/api/employees?limit=10");

      if (result.data) {
        // Handle both direct array response and nested object response
        const employees = Array.isArray(result.data) ? result.data : result.data.data;
        const paginationData = Array.isArray(result.data) ? { total: employees.length } : result.data.pagination;
        
        setStats({ total: paginationData.total });
        setRecentEmployees(employees || []);
      }
    };

    fetchStats();
  }, [request]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Welcome back! Here is your employee management overview.
          </p>
        </div>
      </div>

      {/* Stats */}
      {isLoading && !stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                Active employees in system
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {recentEmployees.length > 0
                  ? new Set(recentEmployees.map((e) => e.department)).size
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Active departments
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Employees */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Employees</CardTitle>
              <CardDescription>
                Recently added employees
              </CardDescription>
            </div>
            <Link href="/dashboard/employees">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-sm text-red-600 mb-4">
              {error}
            </div>
          )}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : recentEmployees.length > 0 ? (
            <div className="space-y-3">
              {recentEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-medium">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <p className="text-sm text-slate-600">
                      {employee.email}
                    </p>
                  </div>
                  <span className="text-sm bg-slate-100 px-3 py-1 rounded">
                    {employee.department}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">
                No employees yet
              </p>
              <Link href="/dashboard/employees">
                <Button>Add First Employee</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
