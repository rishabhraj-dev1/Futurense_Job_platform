"use client";

import { useEffect } from "react";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminStudentsPage() {
  const { data, loading, execute } = useApi<any[]>();

  useEffect(() => {
    execute("GET", "/students");
  }, [execute]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Students</h1>
          <p className="text-muted-foreground">Manage the student talent pool.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students..."
              className="w-full bg-background pl-9"
            />
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Add Student
          </Button>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-3 border-b">
          <CardTitle>All Students</CardTitle>
          <CardDescription>Showing {data?.length || 0} registered students</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="pl-6">Name</TableHead>
                <TableHead>Role / Current Co.</TableHead>
                <TableHead>CTC / Expected</TableHead>
                <TableHead>Profile Completeness</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-6"><Skeleton className="h-5 w-32 mb-2" /><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 mb-2" /><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16 mb-2" /><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-2 w-24 rounded-full" /></TableCell>
                    <TableCell className="text-right pr-6"><Skeleton className="h-8 w-8 rounded-md ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No students found. Import some data to get started.
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((student) => (
                  <TableRow key={student.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="font-medium text-foreground">{student.user?.full_name || "Unknown"}</div>
                      <div className="text-sm text-muted-foreground">{student.user?.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{student.current_role || "Student"}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        {student.current_company || "Fresher"}
                        {student.work_mode && <Badge variant="secondary" className="text-[10px] h-4 px-1">{student.work_mode}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">Current: ₹{student.current_ctc || 0}L</div>
                      <div className="text-sm font-medium text-emerald-600">Expected: ₹{student.expected_ctc || 0}L</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Progress value={student.profile_completeness} className="h-2 w-24" />
                        <span className="text-xs font-medium">{student.profile_completeness}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
