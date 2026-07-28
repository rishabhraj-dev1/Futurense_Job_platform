"use client";

import { useEffect } from "react";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Briefcase, Zap, UploadCloud, ArrowUpRight, Sparkles, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Link from "next/link";

export default function AdminOverviewPage() {
  const { data, loading, execute } = useApi<any>();

  useEffect(() => {
    execute("GET", "/analytics");
  }, [execute]);

  if (loading || !data) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitor platform activity and metrics.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="col-span-4 h-[400px] rounded-xl" />
          <Skeleton className="col-span-3 h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  const { stats, skills_distribution, match_quality } = data;
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const BAND_COLORS = { "Excellent": '#10b981', "Good": '#3b82f6', "Fair": '#f59e0b', "Low": '#ef4444' };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header & Quick Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-semibold">
              Admin Portal
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground text-sm">
            Monitor real-time candidate vectors, match accuracy distributions, and dataset imports.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button asChild variant="outline" size="sm" className="gap-1.5 font-semibold">
            <Link href="/dashboard/admin/analytics">
              <BarChart3 className="w-4 h-4 text-primary" /> Full Analytics
            </Link>
          </Button>
          <Button asChild size="sm" className="gap-1.5 font-semibold shadow-sm">
            <Link href="/dashboard/admin/recommendations">
              <Sparkles className="w-4 h-4 text-amber-400" /> Match Engine
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 shadow-sm hover:border-primary/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Students</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{stats.total_students}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500 mr-1" />
              <span className="text-emerald-500 font-bold mr-1">+12%</span> candidate growth
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/60 shadow-sm hover:border-primary/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{stats.total_jobs}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <span className="text-emerald-500 font-bold mr-1">45</span> active listings
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-border/60 shadow-sm hover:border-primary/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Match Recommendations</CardTitle>
            <Zap className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{stats.recommendations_generated}</div>
            <p className="text-xs text-muted-foreground mt-1">AI pairs generated</p>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm hover:border-primary/40 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Recent Bulk Imports</CardTitle>
            <UploadCloud className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{stats.recent_imports}</div>
            <p className="text-xs text-muted-foreground mt-1">Batches parsed</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Skills Distribution</CardTitle>
            <CardDescription>Top tech competencies present in the candidate database</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skills_distribution} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'rgba(0,0,0,0.05)'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Match Quality Breakdown</CardTitle>
            <CardDescription>Distribution of calculated fit bands across matches</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={match_quality}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={115}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {match_quality.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={BAND_COLORS[entry.name as keyof typeof BAND_COLORS] || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
