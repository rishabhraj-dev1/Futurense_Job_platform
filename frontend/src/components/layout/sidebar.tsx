"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  LogOut, 
  UploadCloud, 
  BarChart, 
  FileText,
  Sparkles
} from "lucide-react";

const adminRoutes = [
  { name: "Overview", path: "/dashboard/admin", icon: LayoutDashboard },
  { name: "AI Match Engine", path: "/dashboard/admin/recommendations", icon: Sparkles },
  { name: "Students", path: "/dashboard/admin/students", icon: Users },
  { name: "Excel Imports", path: "/dashboard/admin/imports", icon: UploadCloud },
  { name: "Job Directory", path: "/dashboard/admin/jobs", icon: Briefcase },
  { name: "Analytics", path: "/dashboard/admin/analytics", icon: BarChart },
];

const studentRoutes = [
  { name: "Dashboard", path: "/dashboard/student", icon: LayoutDashboard },
  { name: "AI Matches", path: "/recommendations", icon: Sparkles },
  { name: "Job Discovery", path: "/jobs", icon: Briefcase },
  { name: "My Profile", path: "/profile", icon: Users },
  { name: "Applications", path: "/dashboard/student/applications", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  if (!user) return null;
  
  const routes = user.role === "admin" ? adminRoutes : studentRoutes;

  return (
    <aside className="w-64 bg-card border-r flex flex-col hidden md:flex h-full min-h-screen sticky top-0 z-30">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform">
            S
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            SkillMatch Pro
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-2 px-3">
          Navigation
        </div>
        {routes.map((route) => {
          const isActive = pathname === route.path || (route.path !== "/dashboard/admin" && route.path !== "/dashboard/student" && pathname.startsWith(route.path));
          
          return (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 font-medium",
                isActive 
                  ? "bg-primary/10 text-primary font-semibold shadow-sm" 
                  : "text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground"
              )}
            >
              <route.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground")} />
              <span>{route.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t mt-auto">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-3.5 py-2.5 w-full rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
