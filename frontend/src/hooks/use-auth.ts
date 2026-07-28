"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo, isAuthenticated, clearAuth } from "@/lib/auth";

export const useAuth = (requireAuth = true, requiredRole?: string) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      const userInfo = getUserInfo();
      
      if (requireAuth && !isAuth) {
        router.push("/login");
        return;
      }

      if (requireAuth && requiredRole && userInfo?.role !== requiredRole) {
        // Redirect to appropriate dashboard
        router.push(userInfo?.role === "admin" ? "/dashboard/admin" : "/dashboard/student");
        return;
      }

      setUser(userInfo);
      setLoading(false);
    };

    checkAuth();
  }, [requireAuth, requiredRole, router]);

  const logout = () => {
    clearAuth();
    router.push("/login");
  };

  return { user, loading, logout };
};
