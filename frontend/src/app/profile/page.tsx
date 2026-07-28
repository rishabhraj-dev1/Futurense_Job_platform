"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, Briefcase, MapPin, Plus, Trash2, CheckCircle2, Save } from "lucide-react";
import { BackButton } from "@/components/shared/back-button";

export default function ProfilePage() {
  const { user } = useAuth(true);
  const [skills, setSkills] = useState(["React", "TypeScript", "Next.js", "Python", "FastAPI"]);
  const [newSkill, setNewSkill] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl space-y-8 animate-in fade-in duration-500 pb-16">
      {/* Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <BackButton fallbackUrl="/dashboard/student" />
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Student Settings
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 pt-2">
            <User className="w-7 h-7 text-primary" />
            My Candidate Profile
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your technical skills, CTC targets, and notice period preferences.
          </p>
        </div>

        <Button onClick={handleSave} size="default" className="shrink-0 gap-2 shadow-md">
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-sm">Profile Preferences Saved!</p>
            <p className="text-xs">Your AI job recommendations have been updated based on your latest skill tree.</p>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Personal Details
            </CardTitle>
            <CardDescription>Contact information visible to verified hiring recruiters.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-semibold text-xs">Full Name</Label>
              <Input defaultValue={user?.name || "Alice Smith"} className="h-10" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-xs">Email Address</Label>
              <Input defaultValue={user?.email || "alice@example.com"} disabled className="h-10 bg-muted/40" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-xs">Phone Number</Label>
              <Input defaultValue="+91 9876543210" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-xs">Current Designation</Label>
              <Input defaultValue="Frontend Developer" className="h-10" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-indigo-500" /> Career & Salary Targets
            </CardTitle>
            <CardDescription>Matching factors used to pair you with high-fit roles.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-semibold text-xs">Current CTC (LPA)</Label>
              <Input type="number" defaultValue="12" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-xs">Expected CTC (LPA)</Label>
              <Input type="number" defaultValue="18" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-xs">Notice Period (Days)</Label>
              <Input type="number" defaultValue="30" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold text-xs">Preferred Work Mode</Label>
              <Input defaultValue="Hybrid / Remote" className="h-10" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Verified Technical Skills
            </CardTitle>
            <CardDescription>Your skill tree analyzed by vector embedding similarity.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 max-w-md">
              <Input 
                placeholder="Add a new skill (e.g. Docker, AWS)..." 
                value={newSkill} 
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                className="h-10"
              />
              <Button onClick={handleAddSkill} variant="secondary" className="h-10 px-4 shrink-0 font-semibold">
                <Plus className="h-4 w-4 mr-1" /> Add Skill
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1.5 text-xs bg-primary/10 text-primary border border-primary/20 flex items-center gap-2 font-semibold">
                  {skill}
                  <button onClick={() => handleRemoveSkill(skill)} className="hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-border/40 p-4 bg-muted/20">
            <Button onClick={handleSave} className="shadow-md gap-2 font-semibold">
              <Save className="w-4 h-4" /> Save Profile Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
