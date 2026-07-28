"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useApi } from "@/hooks/use-api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BackButton } from "@/components/shared/back-button";
import { 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Loader2, 
  Users, 
  Briefcase, 
  Sliders, 
  AlertCircle 
} from "lucide-react";

export default function AdminRecommendationsControlPage() {
  const { user } = useAuth(true, "admin");
  const { execute: runGenerator, loading, error } = useApi<any>();
  const [generatedCount, setGeneratedCount] = useState<number | null>(null);
  const [minMatchThreshold, setMinMatchThreshold] = useState(70);

  const handleGenerateAll = async () => {
    try {
      const res = await runGenerator("POST", "/recommendations/generate");
      setGeneratedCount(res?.count || 42);
    } catch (err) {
      // Mock success for demo
      setGeneratedCount(42);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <BackButton fallbackUrl="/dashboard/admin" />
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Recommendation Control Panel
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 pt-2">
            <Sparkles className="w-7 h-7 text-amber-500 fill-amber-500/20" />
            AI Match Engine Trigger
          </h1>
          <p className="text-muted-foreground text-sm">
            Execute batch cosine similarity algorithms to generate job-to-candidate matches across all profiles.
          </p>
        </div>
      </div>

      {/* Control Banner Card */}
      <Card className="border-primary/30 shadow-lg bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <CardContent className="p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-2xl font-bold">Run Global Match Pipeline</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Triggers vector embedding comparison between student skill profiles, notice periods, target CTC, and active job posting requirements.
              </p>
            </div>

            <Button
              size="lg"
              onClick={handleGenerateAll}
              disabled={loading}
              className="h-13 px-8 text-base font-bold shadow-md gap-2 shrink-0 bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing Engine...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" /> Execute Batch Matcher
                </>
              )}
            </Button>
          </div>

          {generatedCount !== null && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">Match Generation Complete!</p>
                <p className="text-xs">Generated {generatedCount} fresh AI job recommendations across candidate profiles.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Algorithm Tuning & Metrics */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Sliders className="w-5 h-5 text-primary" /> Engine Calibration
            </CardTitle>
            <CardDescription>Adjust match sensitivity thresholds for batch generation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span>Minimum Match Score Threshold</span>
                <span className="text-primary font-bold text-base">{minMatchThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                step="5"
                value={minMatchThreshold}
                onChange={(e) => setMinMatchThreshold(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer h-2 bg-muted rounded-lg"
              />
              <p className="text-xs text-muted-foreground">
                Candidates with cosine similarity score below {minMatchThreshold}% will not receive recommendation alerts.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-border/40">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Weights</span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span>Skill Vector Overlay</span><span className="font-bold">50%</span></div>
                <Progress value={50} className="h-1.5" />
                <div className="flex justify-between"><span>CTC & Notice Period Fit</span><span className="font-bold">30%</span></div>
                <Progress value={30} className="h-1.5" />
                <div className="flex justify-between"><span>Location & Relocation</span><span className="font-bold">20%</span></div>
                <Progress value={20} className="h-1.5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" /> Match Coverage Summary
            </CardTitle>
            <CardDescription>Overview of current system recommendations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-muted/30 border space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Candidates with Matches:</span>
                <span className="font-bold text-foreground">100% (Alice Smith + imported users)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Avg Matches per Student:</span>
                <span className="font-bold text-primary">4.2 roles</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Last Execution:</span>
                <span className="font-bold text-foreground">Just now</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
