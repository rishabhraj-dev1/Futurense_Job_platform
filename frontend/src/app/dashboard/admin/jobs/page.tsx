"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, MapPin, Building, Search, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { JobListResponse } from "@/types";

export default function AdminJobsPage() {
  const { data, loading, execute } = useApi<JobListResponse>();
  const { execute: executeSync, loading: syncLoading } = useApi<any>();
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const fetchJobs = () => {
    execute("GET", "/jobs", undefined, { params: { limit: 12, search } });
  };

  useEffect(() => {
    fetchJobs();
  }, [execute, search]);

  const handleSync = async () => {
    try {
      const res = await executeSync("POST", "/jobs/sync");
      toast({
        title: "Sync Completed",
        description: res.message || "Jobs synced successfully from provider.",
      });
      fetchJobs();
    } catch (err) {
      // handled
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Jobs Database</h1>
          <p className="text-muted-foreground">Manage active listings and provider sync.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleSync} disabled={syncLoading} className="shadow-sm">
            <RefreshCw className={`mr-2 h-4 w-4 ${syncLoading ? "animate-spin" : ""}`} />
            Sync from Provider
          </Button>
          <Button className="shadow-sm"><Briefcase className="mr-2 h-4 w-4" /> Add Job</Button>
        </div>
      </div>

      <div className="relative w-full max-w-sm mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search jobs by title or company..."
          className="w-full pl-9 bg-card border-border/50 shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : data?.items?.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-card rounded-xl border border-dashed">
            <Briefcase className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No jobs found</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1">
              There are no jobs matching your criteria. Try syncing with your provider or adjusting your search.
            </p>
          </div>
        ) : (
          data?.items?.map((job) => (
            <Card key={job.id} className="border-border/50 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
              <CardHeader className="pb-3 flex-none">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{job.title}</CardTitle>
                    <CardDescription className="mt-1 flex items-center text-sm">
                      <Building className="h-3.5 w-3.5 mr-1" />
                      {job.company}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-primary/5 text-primary text-[10px] uppercase font-semibold">
                    {job.source}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-4 flex-1 flex flex-col">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                  {job.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills_required.slice(0, 3).map(skill => (
                    <Badge key={skill} variant="secondary" className="text-[10px] font-medium bg-muted">
                      {skill}
                    </Badge>
                  ))}
                  {job.skills_required.length > 3 && (
                    <Badge variant="secondary" className="text-[10px] font-medium bg-muted">
                      +{job.skills_required.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground pt-3 border-t">
                  <div className="flex items-center">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-primary/70" />
                    {job.location || "Remote"}
                  </div>
                  <div className="text-emerald-600">
                    {job.salary_min ? `₹${job.salary_min}L - ₹${job.salary_max}L` : "Salary Undisclosed"}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
