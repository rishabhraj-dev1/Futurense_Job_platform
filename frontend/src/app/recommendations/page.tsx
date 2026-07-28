"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { BackButton } from "@/components/shared/back-button";
import { 
  Sparkles, 
  MapPin, 
  Briefcase, 
  Search, 
  SlidersHorizontal, 
  ArrowUpRight, 
  CheckCircle2, 
  Target 
} from "lucide-react";
import { Recommendation } from "@/types";
import Link from "next/link";

export default function RecommendationsPage() {
  const { user } = useAuth(true);
  const { data: recommendations, loading, execute: fetchRecs } = useApi<Recommendation[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const [minScore, setMinScore] = useState(60);

  useEffect(() => {
    fetchRecs("GET", "/recommendations/me");
  }, [fetchRecs]);

  const filteredRecs = recommendations?.filter(rec => {
    const title = rec.job?.title || "";
    const company = rec.job?.company || "";
    const matchesSearch = 
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.toLowerCase().includes(searchTerm.toLowerCase());
    const score = rec.fit_score ?? (rec.match_score ? rec.match_score * 100 : 80);
    const matchesScore = score >= minScore;
    return matchesSearch && matchesScore;
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <BackButton fallbackUrl="/dashboard/student" />
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              AI Job Engine
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 pt-2">
            <Sparkles className="w-7 h-7 text-amber-500 fill-amber-500/20" />
            Recommended Opportunities
          </h1>
          <p className="text-muted-foreground text-sm">
            Jobs specifically calculated for your skill profile and trajectory.
          </p>
        </div>

        <Button asChild size="default" className="shrink-0 gap-2 shadow-sm">
          <Link href="/profile">
            Refine Skill Preferences
          </Link>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-card border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search role, company or skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-3 shrink-0 px-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-semibold whitespace-nowrap">Min Match: {minScore}%</span>
          <input
            type="range"
            min="40"
            max="95"
            step="5"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="w-28 accent-primary cursor-pointer"
          />
        </div>
      </div>

      {/* Recommendations Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i} className="border-border/60">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredRecs?.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="p-12 text-center space-y-4">
            <Target className="w-12 h-12 text-muted-foreground/50 mx-auto" />
            <h3 className="text-xl font-semibold">No high-fit recommendations found</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Try adjusting the minimum match threshold slider above or adding more skills to your profile.
            </p>
            <Button variant="outline" onClick={() => { setSearchTerm(""); setMinScore(40); }}>
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecs?.map((rec) => {
            const scorePct = Math.round(rec.fit_score ?? (rec.match_score ? rec.match_score * 100 : 85));
            return (
              <Card key={rec.id} className="border-border/60 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between overflow-hidden group">
                <CardHeader className="p-6 pb-4">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div>
                      <CardTitle className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
                        {rec.job?.title || "Software Opening"}
                      </CardTitle>
                      <CardDescription className="font-semibold text-foreground/80 mt-0.5">
                        {rec.job?.company || "Tech Enterprise"}
                      </CardDescription>
                    </div>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 shrink-0 font-bold">
                      {scorePct}% Match
                    </Badge>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Compatibility Score</span>
                      <span className="font-bold text-primary">{scorePct}%</span>
                    </div>
                    <Progress value={scorePct} className="h-2" />
                  </div>
                </CardHeader>

                <CardContent className="p-6 pt-0 space-y-4 flex-1">
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground pt-2">
                    <span className="flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
                      <MapPin className="w-3.5 h-3.5" /> {rec.job?.location || "Remote"}
                    </span>
                    <span className="flex items-center gap-1 bg-muted px-2.5 py-1 rounded-md">
                      <Briefcase className="w-3.5 h-3.5" /> {rec.job?.employment_type || "Full-time"}
                    </span>
                  </div>

                  {(rec.reason_summary || (rec.reasons && rec.reasons.length > 0)) && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key Fit Drivers</span>
                      <ul className="text-xs space-y-1">
                        <li className="flex items-center gap-1.5 text-foreground/90">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="line-clamp-2">{rec.reason_summary || rec.reasons?.[0]}</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="p-6 pt-0 border-t border-border/40 mt-auto bg-muted/10 flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">
                    {rec.job?.salary_range ? rec.job.salary_range : "Competitive CTC"}
                  </span>
                  <Button size="sm" asChild className="gap-1">
                    <Link href={`/jobs/${rec.job?.id}`}>
                      View Job <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
