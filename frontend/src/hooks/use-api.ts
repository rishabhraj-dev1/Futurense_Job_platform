"use client";

import { useState, useCallback } from "react";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type ApiMethod = "GET" | "POST" | "PUT" | "DELETE";

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const execute = useCallback(async (
    method: ApiMethod, 
    endpoint: string, 
    body?: any, 
    options?: any
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      switch (method) {
        case "GET":
          result = await api.get<T>(endpoint, options);
          break;
        case "POST":
          result = await api.post<T>(endpoint, body, options);
          break;
        case "PUT":
          result = await api.put<T>(endpoint, body, options);
          break;
        case "DELETE":
          result = await api.delete<T>(endpoint, options);
          break;
      }
      
      setData(result);
      return result;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "An unexpected error occurred";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { data, loading, error, execute, setData };
}
