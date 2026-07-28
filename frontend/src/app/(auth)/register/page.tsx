"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useApi } from "@/hooks/use-api";
import { setAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { AlertCircle, Loader2, ArrowLeft, CheckCircle2, UserCheck, Briefcase } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthHeroIllustration } from "@/components/shared/illustrations";

const formSchema = z.object({
  full_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function RegisterPage() {
  const router = useRouter();
  const { execute, loading, error } = useApi<any>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await execute("POST", "/auth/register", {
        email: values.email,
        password: values.password,
        full_name: values.full_name,
        role: "student"
      });

      if (res && res.id) {
        const formData = new FormData();
        formData.append("username", values.email);
        formData.append("password", values.password);
        const loginRes = await execute("POST", "/auth/login", formData);
        
        if (loginRes && loginRes.access_token) {
          setAuth(loginRes.access_token, {
            id: loginRes.user_id,
            email: values.email,
            role: loginRes.role,
            name: values.full_name
          });
          router.push("/dashboard/student");
        }
      }
    } catch (err) {
      // Handled by useApi
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background relative overflow-hidden">
      {/* Back to Home floating action */}
      <div className="absolute top-6 left-6 z-20">
        <Button variant="outline" size="sm" asChild className="gap-2 bg-background/80 backdrop-blur-md">
          <Link href="/">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </Button>
      </div>

      {/* Left Column: Hero Art & Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-r border-border/50 relative">
        <div className="flex items-center space-x-3 pt-6">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-md">
            S
          </div>
          <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            SkillMatch Pro
          </span>
        </div>

        <div className="my-auto py-8">
          <AuthHeroIllustration className="max-w-md mx-auto" />
          <div className="text-center max-w-md mx-auto mt-6 space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">Join SkillMatch Pro Today</h2>
            <p className="text-muted-foreground text-base">
              Build your profile, showcase your technical capabilities, and receive AI recommendations for relevant job offers.
            </p>
            <div className="flex justify-center items-center gap-6 pt-4 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Free Account</span>
              <span className="flex items-center gap-1.5"><UserCheck className="w-4 h-4 text-primary"/> AI Skill Audit</span>
              <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-indigo-500"/> Direct Hiring</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} SkillMatch Pro. All rights reserved.
        </div>
      </div>

      {/* Right Column: Glassmorphic Register Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-6">
          <Card className="shadow-2xl border-border/60 bg-card/95 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="space-y-2 text-center pb-6 border-b border-border/40 bg-muted/20">
              <div className="flex justify-center mb-2 lg:hidden">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-md">
                  S
                </div>
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Create Account</CardTitle>
              <CardDescription>Start matching with high-fit tech roles in seconds</CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              {error && (
                <Alert variant="destructive" className="mb-6 rounded-xl">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-sm font-semibold">Full Name</Label>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="h-11 rounded-lg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-sm font-semibold">Email Address</Label>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} className="h-11 rounded-lg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-sm font-semibold">Password</Label>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} className="h-11 rounded-lg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-11 text-base font-semibold rounded-lg shadow-md mt-2" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Complete Registration"}
                  </Button>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="flex justify-center border-t border-border/40 pt-4 bg-muted/30 pb-6">
              <div className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-semibold">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
