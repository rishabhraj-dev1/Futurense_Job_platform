"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  label?: string;
  fallbackUrl?: string;
  className?: string;
  variant?: "ghost" | "outline" | "default" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export function BackButton({
  label = "Back",
  fallbackUrl,
  className,
  variant = "ghost",
  size = "sm",
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else if (fallbackUrl) {
      router.push(fallbackUrl);
    } else {
      router.push("/dashboard/student");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleBack}
      className={cn(
        "gap-2 text-muted-foreground hover:text-foreground transition-colors group",
        className
      )}
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      <span>{label}</span>
    </Button>
  );
}
