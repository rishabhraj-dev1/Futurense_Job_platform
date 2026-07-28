"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BackButton } from "@/components/shared/back-button";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Briefcase, 
  Award, 
  Sparkles, 
  CheckCircle2,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";

export default function AdminAnalyticsPage() {
  const { user } = useAuth(true, "admin");

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <BackButton fallbackUrl="/dashboard/admin" />
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Admin Intelligence
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 pt-2">
            <BarChart3 className="w-7 h-7 text-primary" />
            Placement & AI Analytics
          </h1>
          <p className="text-muted-foreground text-sm">
            Real-time candidate qualification metrics, skill demand vectors, and placement conversion rates.
          </p>
        </div>

        <Button asChild size="default" className="shrink-0 gap-2 shadow-sm">
          <Link href="/dashboard/admin/recommendations">
            <Sparkles className="w-4 h-4 text-amber-400" /> Run Recommendation Engine
          </Link>
        </Button>
      </div>

      {/* Metric Highlights */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Candidate Pool</span>
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div className="text-3xl font-extrabold">142</div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> +12% this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg Skill Match Score</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold">87.4%</div>
            <p className="text-xs text-muted-foreground font-medium">Vector cosine accuracy</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Job Openings</span>
              <Briefcase className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-3xl font-extrabold">38</div>
            <p className="text-xs text-muted-foreground font-medium">Verified employer posts</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Successful Matches</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-3xl font-extrabold">94</div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> 82% conversion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Top Demanded Skills */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Top In-Demand Skills</CardTitle>
            <CardDescription>Most frequently required technologies across all open jobs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { skill: "React.js / Next.js", pct: 92, count: "35 jobs" },
              { skill: "TypeScript", pct: 85, count: "31 jobs" },
              { skill: "Python / FastAPI", pct: 78, count: "28 jobs" },
              { skill: "PostgreSQL / SQL", pct: 70, count: "24 jobs" },
              { skill: "Docker & Cloud Deploy", pct: 62, count: "20 jobs" },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span>{item.skill}</span>
                  <span className="text-xs text-muted-foreground">{item.count}</span>
                </div>
                <Progress value={item.pct} className="h-2.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Candidate Distribution by CTC */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Salary Bracket Distribution</CardTitle>
            <CardDescription>Student candidate target CTC expectations breakdown.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "₹6 - ₹10 LPA (Entry Level)", pct: 40, students: "57 students" },
              { label: "₹10 - ₹15 LPA (Mid Level)", pct: 35, students: "50 students" },
              { label: "₹15 - ₹22 LPA (Senior)", pct: 18, students: "25 students" },
              { label: "₹22+ LPA (Lead/Specialist)", pct: 7, students: "10 students" },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span>{item.label}</span>
                  <span className="text-xs text-primary font-bold">{item.students}</span>
                </div>
                <Progress value={item.pct} className="h-2.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
