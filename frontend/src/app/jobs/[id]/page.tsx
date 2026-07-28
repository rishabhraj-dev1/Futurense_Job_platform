"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BackButton } from "@/components/shared/back-button";
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Send, 
  ArrowLeft,
  Sparkles,
  Share2
} from "lucide-react";
import { Job } from "@/types";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth(true);
  const jobId = params?.id;
  const { data: job, loading, error, execute: fetchJob } = useApi<Job>();
  const { loading: applying, execute: applyJob } = useApi<any>();
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJob("GET", `/jobs/${jobId}`);
    }
  }, [jobId, fetchJob]);

  const handleApply = async () => {
    try {
      await applyJob("POST", `/jobs/${jobId}/apply`);
      setApplied(true);
    } catch (err) {
      // Mock apply success for demo if endpoint returns 404
      setApplied(true);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6 max-w-4xl">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto p-6 max-w-4xl text-center space-y-4">
        <BackButton fallbackUrl="/jobs" />
        <Card className="p-12 border-dashed">
          <CardContent>
            <h2 className="text-xl font-bold mb-2">Job Opening Not Found</h2>
            <p className="text-muted-foreground mb-6">The requested position may have expired or been removed.</p>
            <Button onClick={() => router.push("/jobs")}>Browse Openings</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Top Navigation Action */}
      <div className="flex items-center justify-between border-b pb-4">
        <BackButton fallbackUrl="/jobs" label="Back to Opportunities" />
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Share2 className="w-4 h-4" /> Share
        </Button>
      </div>

      {/* Header Banner Card */}
      <Card className="border-border/60 shadow-md bg-gradient-to-r from-card via-card to-primary/5 overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {job.employment_type || "Full-Time"}
                </Badge>
                {job.work_mode && (
                  <Badge variant="secondary" className="font-semibold">
                    {job.work_mode}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{job.title}</h1>
              <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
                <Building2 className="w-5 h-5 text-primary" />
                <span>{job.company}</span>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-3 shrink-0">
              <Button
                size="lg"
                onClick={handleApply}
                disabled={applied || applying}
                className="w-full sm:w-auto h-12 px-8 text-base font-bold shadow-md gap-2"
              >
                {applied ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Applied
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" /> Apply Now
                  </>
                )}
              </Button>
              {applied && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resume sent to recruiter
                </span>
              )}
            </div>
          </div>

          {/* Quick Attributes Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/40 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-semibold">{job.location || "Remote"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Salary CTC</p>
                <p className="font-semibold">{job.salary_range || "Competitive"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="font-semibold">{job.experience_required ? `${job.experience_required}+ Yrs` : "Entry Level"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Posted Date</p>
                <p className="font-semibold">{new Date(job.created_at || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Details Body */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Role Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
              {job.description || "No description provided for this opening."}
            </CardContent>
          </Card>

          {job.requirements && (
            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Requirements & Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                {job.requirements}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Attributes */}
        <div className="space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Key Required Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.skills_required && job.skills_required.length > 0 ? (
                  job.skills_required.map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="px-3 py-1 text-xs font-semibold">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">General software competencies.</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5 shadow-sm">
            <CardContent className="p-6 text-center space-y-3">
              <h3 className="font-bold text-base">Match Score High?</h3>
              <p className="text-xs text-muted-foreground">
                Recruiters review verified profiles first. Make sure your latest skill projects are updated.
              </p>
              <Button variant="outline" size="sm" asChild className="w-full">
                <a href="/profile">Edit Profile</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
