"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { BrainCircuit, Briefcase, MapPin, Target, Sparkles, ChevronRight, FileText, ArrowUpRight } from "lucide-react";
import { Recommendation } from "@/types";
import Link from "next/link";

export default function StudentDashboardPage() {
  const { user } = useAuth(true, "student");
  const { data: recommendations, loading: recsLoading, execute: fetchRecs } = useApi<Recommendation[]>();

  useEffect(() => {
    fetchRecs("GET", "/recommendations/me", undefined, { params: { limit: 5 } });
  }, [fetchRecs]);

  const profileCompleteness = 85;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Welcome Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 p-6 sm:p-10 shadow-sm">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <BrainCircuit className="w-48 h-48 text-primary" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <Badge variant="outline" className="bg-background border-primary/30 text-primary font-semibold">
            Student Portal
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Your profile is looking strong. We&apos;ve analyzed your technical skills and identified optimal enterprise software roles matching your path.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-xl bg-card/80 border shadow-sm backdrop-blur-sm">
            <div className="flex-1 w-full space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span>Profile Completeness</span>
                <span className="text-primary font-bold">{profileCompleteness}%</span>
              </div>
              <Progress value={profileCompleteness} className="h-2.5" />
            </div>
            <Button variant="outline" size="sm" asChild className="shrink-0 font-semibold">
              <Link href="/profile">Edit Profile</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-amber-500 fill-amber-500/20" />
                Top AI Recommendations
              </h2>
              <p className="text-muted-foreground text-sm mt-0.5">High-fit opportunities based on your vector profile.</p>
            </div>
            <Button variant="ghost" size="sm" asChild className="gap-1 text-primary">
              <Link href="/recommendations">View All <ChevronRight className="w-4 h-4"/></Link>
            </Button>
          </div>

          <div className="space-y-6">
            {recsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="border-border/60 shadow-sm">
                  <CardContent className="p-6 space-y-3">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : !recommendations || recommendations.length === 0 ? (
              <Card className="border-dashed bg-muted/20">
                <CardContent className="p-12 text-center space-y-3">
                  <Target className="w-12 h-12 text-muted-foreground/50 mx-auto" />
                  <h3 className="text-lg font-bold">No recommendations generated yet</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Update your skills or visit the AI Matches section to trigger tailored roles.
                  </p>
                  <Button asChild className="mt-2"><Link href="/profile">Update Profile Skills</Link></Button>
                </CardContent>
              </Card>
            ) : (
              recommendations.map((rec) => {
                const fitScore = rec.fit_score ? Math.round(rec.fit_score) : (rec.match_score ? Math.round(rec.match_score * 100) : 85);
                const fitBand = rec.fit_band || (fitScore >= 80 ? "Excellent" : "Good");
                const matchedSkills = rec.matched_skills || (rec.job?.skills_required ? rec.job.skills_required.slice(0, 3) : []);

                return (
                  <Card key={rec.id} className="border-border/60 shadow-sm hover:shadow-md hover:border-primary/40 transition-all overflow-hidden flex flex-col justify-between group">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6 justify-between items-start">
                        <div className="space-y-2 flex-1">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                <Link href={`/jobs/${rec.job?.id}`}>
                                  {rec.job?.title}
                                </Link>
                              </h3>
                              <p className="font-semibold text-muted-foreground flex items-center text-sm mt-0.5">
                                {rec.job?.company}
                                <span className="mx-2 h-1 w-1 rounded-full bg-muted-foreground/50" />
                                <MapPin className="w-3.5 h-3.5 mr-1 text-primary" /> {rec.job?.location || "Remote"}
                              </p>
                            </div>

                            <div className="flex flex-col items-end shrink-0">
                              <div className="text-3xl font-black text-primary tracking-tighter">
                                {fitScore}<span className="text-base text-muted-foreground">%</span>
                              </div>
                              <Badge variant="outline" className={`mt-1 font-bold border-none text-xs ${
                                fitBand === 'Excellent' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-blue-500/10 text-blue-600'
                              }`}>
                                {fitBand} Match
                              </Badge>
                            </div>
                          </div>

                          <div className="bg-muted/30 rounded-xl p-3 my-3 border border-border/40 text-xs leading-relaxed">
                            <span className="font-bold text-foreground">Why it fits: </span>
                            <span className="text-muted-foreground">{rec.reason_summary || (rec.reasons ? rec.reasons.join(". ") : "Strong match based on your programming skills.")}</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {matchedSkills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs bg-primary/10 text-primary font-semibold border-transparent">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="bg-muted/20 border-t border-border/40 px-6 py-3 flex justify-between items-center">
                      <div className="text-sm font-bold text-primary">
                        {rec.job?.salary_range ? rec.job.salary_range : (rec.job?.salary_min ? `₹${rec.job.salary_min}L - ₹${rec.job.salary_max}L` : "Competitive CTC")}
                      </div>
                      <Button size="sm" asChild className="gap-1 font-semibold">
                        <Link href={`/jobs/${rec.job?.id}`}>
                          View Position <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg font-bold flex items-center">
                <FileText className="w-4 h-4 mr-2 text-primary" />
                Applications Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center text-muted-foreground"><div className="w-2 h-2 rounded-full bg-blue-500 mr-2"/> Applied</div>
                <span className="font-bold">3</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center text-muted-foreground"><div className="w-2 h-2 rounded-full bg-amber-500 mr-2"/> Under Review</div>
                <span className="font-bold">1</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center text-muted-foreground"><div className="w-2 h-2 rounded-full bg-emerald-500 mr-2"/> Interviews</div>
                <span className="font-bold">1</span>
              </div>
              <div className="pt-3 border-t">
                <Button variant="outline" className="w-full text-xs font-semibold" asChild>
                  <Link href="/dashboard/student/applications">View Applications Tracker</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Skill Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <p className="text-muted-foreground leading-relaxed">
                Adding <span className="font-bold text-foreground">Docker</span> or <span className="font-bold text-foreground">FastAPI</span> to your profile increases your fit score for senior roles by 25%.
              </p>
              <Button size="sm" variant="outline" asChild className="w-full text-xs font-semibold">
                <Link href="/profile">Add Skills to Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
