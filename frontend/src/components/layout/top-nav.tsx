"use client";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Bell, Menu, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const adminRoutes = [
  { name: "Overview", path: "/dashboard/admin" },
  { name: "Students", path: "/dashboard/admin/students" },
  { name: "Imports", path: "/dashboard/admin/imports" },
  { name: "Jobs", path: "/dashboard/admin/jobs" },
  { name: "Analytics", path: "/dashboard/admin/analytics" },
];

const studentRoutes = [
  { name: "Dashboard", path: "/dashboard/student" },
  { name: "My Profile", path: "/profile" },
  { name: "Job Discovery", path: "/jobs" },
  { name: "Applications", path: "/dashboard/student/applications" },
];

export function TopNav() {
  const { user, logout } = useAuth(false);
  const pathname = usePathname();
  
  if (!user) return null;
  
  const initials = user?.name ? user.name.substring(0, 2).toUpperCase() : user?.email?.substring(0, 2).toUpperCase() || "SM";
  const routes = user.role === "admin" ? adminRoutes : studentRoutes;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-6 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="md:hidden flex items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="p-6 border-b">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">
                  S
                </div>
                <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  SkillMatch
                </span>
              </Link>
            </div>
            <nav className="flex flex-col p-4 space-y-1">
              {routes.map((route) => {
                const isActive = pathname === route.path || (route.path !== "/dashboard/admin" && pathname.startsWith(route.path));
                return (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={cn(
                      "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent"
                    )}
                  >
                    {route.name}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      <div className="w-full flex-1">
        <div className="relative max-w-md hidden md:flex items-center">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search anywhere... (Cmd+K)"
            className="w-full bg-muted/50 rounded-md border-transparent focus:border-primary focus:bg-background h-9 pl-9 pr-4 text-sm outline-none transition-colors"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-border shadow-sm">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
                <p className="text-xs font-semibold text-primary capitalize mt-1">
                  {user.role} Account
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user.role === "student" && (
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile Settings</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Preferences</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
