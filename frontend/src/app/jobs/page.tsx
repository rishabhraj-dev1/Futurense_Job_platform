"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Search, Briefcase, Filter, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { JobListResponse } from "@/types";
import { BackButton } from "@/components/shared/back-button";
import Link from "next/link";

export default function JobsDiscoveryPage() {
  const { data, loading, execute } = useApi<JobListResponse>();
  const [search, setSearch] = useState("");

  const fetchJobs = () => {
    execute("GET", "/jobs", undefined, { params: { limit: 18, search } });
  };

  useEffect(() => {
    fetchJobs();
  }, [execute, search]);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <BackButton fallbackUrl="/dashboard/student" />
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Job Directory
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 pt-2">
            <Briefcase className="w-7 h-7 text-primary" />
            Discover Tech Roles
          </h1>
          <p className="text-muted-foreground text-sm">
            Explore verified job postings matched against candidate skill trees.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-card border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search title, tech stack, or employer..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : data?.items?.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-card rounded-2xl border border-dashed">
            <Briefcase className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold">No matching jobs found</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto mt-1">
              Try adjusting your query terms to explore open software developer roles.
            </p>
            <Button variant="outline" className="mt-4" onClick={() => setSearch("")}>
              Clear Search
            </Button>
          </div>
        ) : (
          data?.items?.map((job) => (
            <Card 
              key={job.id} 
              className="border-border/60 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between h-full group overflow-hidden"
            >
              <CardHeader className="p-6 pb-3">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <CardTitle className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
                      <Link href={`/jobs/${job.id}`}>
                        {job.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="mt-1 flex items-center font-semibold text-foreground/80 text-sm">
                      <Building2 className="h-4 w-4 mr-1.5 text-primary" />
                      {job.company}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 shrink-0 font-semibold text-xs">
                    {job.work_mode || "Hybrid"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 pt-0 space-y-4 flex-1 flex flex-col justify-between">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {job.description || "Exciting tech role looking for skilled developers."}
                </p>
                
                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {job.skills_required.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs px-2.5 py-0.5 font-medium bg-muted">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground pt-3 border-t border-border/40">
                    <div className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1 text-primary" />
                      {job.location || "Remote"}
                    </div>
                    <div className="text-primary font-bold">
                      {job.salary_range ? job.salary_range : (job.salary_min ? `₹${job.salary_min}L - ₹${job.salary_max}L` : "Competitive CTC")}
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 border-t border-border/40 bg-muted/10 mt-auto flex justify-end">
                <Button size="sm" asChild className="w-full sm:w-auto gap-1 font-semibold">
                  <Link href={`/jobs/${job.id}`}>
                    View Details <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
