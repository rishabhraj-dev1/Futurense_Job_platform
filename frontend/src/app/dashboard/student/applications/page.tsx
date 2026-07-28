"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BackButton } from "@/components/shared/back-button";
import { 
  FileText, 
  Building2, 
  MapPin, 
  Search, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Briefcase
} from "lucide-react";
import Link from "next/link";

// Mock student applications tracking data
const initialApplications = [
  {
    id: "app-1",
    jobTitle: "Senior Frontend Engineer",
    company: "TechSoft Systems",
    location: "Bangalore (Hybrid)",
    salary: "₹18 - ₹22 LPA",
    status: "Under Review",
    appliedDate: "2026-07-20",
    matchScore: 92,
  },
  {
    id: "app-2",
    jobTitle: "Fullstack Developer (React & FastAPI)",
    company: "CloudScale Labs",
    location: "Remote",
    salary: "₹15 - ₹18 LPA",
    status: "Interview Scheduled",
    appliedDate: "2026-07-18",
    matchScore: 88,
  },
  {
    id: "app-3",
    jobTitle: "Python Backend Developer",
    company: "DataEngine AI",
    location: "Hyderabad",
    salary: "₹14 - ₹16 LPA",
    status: "Applied",
    appliedDate: "2026-07-22",
    matchScore: 84,
  },
];

export default function StudentApplicationsPage() {
  const { user } = useAuth(true, "student");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApps = initialApplications.filter(app => 
    app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Interview Scheduled":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {status}</Badge>;
      case "Under Review":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold"><Clock className="w-3.5 h-3.5 mr-1" /> {status}</Badge>;
      case "Applied":
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold"><FileText className="w-3.5 h-3.5 mr-1" /> {status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <BackButton fallbackUrl="/dashboard/student" />
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Applications Tracker
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 pt-2">
            <FileText className="w-7 h-7 text-primary" />
            My Job Applications
          </h1>
          <p className="text-muted-foreground text-sm">
            Track real-time candidate evaluation status across all submitted applications.
          </p>
        </div>

        <Button asChild size="default" className="shrink-0 gap-2 shadow-sm">
          <Link href="/jobs">
            <Briefcase className="w-4 h-4" /> Discover New Roles
          </Link>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-card border shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search applied roles or companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Applications Cards List */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <Card className="border-dashed bg-muted/20">
            <CardContent className="p-12 text-center space-y-3">
              <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto" />
              <h3 className="text-xl font-semibold">No applications found</h3>
              <p className="text-sm text-muted-foreground">You haven&apos;t submitted applications matching this query.</p>
              <Button asChild variant="outline" className="mt-2">
                <Link href="/jobs">Browse Job Directory</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredApps.map((app) => (
            <Card key={app.id} className="border-border/60 shadow-sm hover:shadow-md hover:border-primary/40 transition-all overflow-hidden">
              <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold text-foreground">{app.jobTitle}</h3>
                    {getStatusBadge(app.status)}
                    <Badge variant="outline" className="text-xs font-bold text-primary bg-primary/5">
                      {app.matchScore}% Match
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                      <Building2 className="w-4 h-4 text-primary" /> {app.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" /> {app.location}
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                      Applied: {app.appliedDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-4 sm:pt-0">
                  <span className="text-sm font-semibold text-primary hidden md:inline">
                    {app.salary}
                  </span>
                  <Button variant="outline" size="sm" asChild className="gap-1.5">
                    <Link href="/jobs">
                      View Details <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
