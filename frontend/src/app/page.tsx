import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BrainCircuit, Briefcase, FileSpreadsheet, LineChart, Target, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Navbar */}
      <header className="px-6 lg:px-10 py-5 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">
            S
          </div>
          <span className="font-bold text-2xl tracking-tight text-foreground">
            SkillMatch <span className="text-primary">Pro</span>
          </span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it works</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-medium hover:bg-muted/50">Log in</Button>
          </Link>
          <Link href="/login">
            <Button className="font-medium shadow-md">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 pt-24 pb-32 md:pt-32 md:pb-40 lg:pt-40 lg:pb-48 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50" />
          <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl opacity-30" />
          
          <div className="container mx-auto text-center max-w-4xl relative z-10">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-6 animate-fade-in">
              <span className="flex w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
              AI-Powered Job Recommendations
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
              Connect Students to their <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Perfect Career Path</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              SkillMatch Pro uses advanced matching algorithms to pair student profiles with the best job opportunities based on skills, preferences, and real-time market data.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-lg shadow-primary/20 group">
                  Start Matching Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base border-muted-foreground/20 hover:bg-muted/50">
                  View Demo Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise-Grade Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to manage student placements at scale.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: BrainCircuit, title: "Smart Matching", desc: "Weighted algorithm considering 7+ data points to find the ideal fit." },
                { icon: FileSpreadsheet, title: "Excel Ingestion", desc: "Upload hundreds of student profiles instantly via our robust parser." },
                { icon: Briefcase, title: "Live Job Sources", desc: "Pull from live APIs or mock databases to ensure fresh opportunities." },
                { icon: Target, title: "Skill Gap Analysis", desc: "Identify missing skills and recommend targeted upskilling paths." },
                { icon: LineChart, title: "Rich Analytics", desc: "Track placement rates and recommendation quality in real-time." },
                { icon: Zap, title: "LLM Ready", desc: "Built with abstractions to swap in OpenAI for semantic reranking." },
              ].map((f, i) => (
                <div key={i} className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-12 text-center">
              {[
                { step: "01", title: "Import Data", desc: "Admins upload student data from Excel or students build their profiles directly." },
                { step: "02", title: "Fetch Jobs", desc: "The system aggregates live job listings from configured API providers." },
                { step: "03", title: "Get Matched", desc: "Our engine ranks the best opportunities and highlights why they are a fit." },
              ].map((s, i) => (
                <div key={i} className="relative">
                  <div className="text-6xl font-black text-muted-foreground/10 absolute -top-8 left-1/2 -translate-x-1/2 z-0">
                    {s.step}
                  </div>
                  <div className="relative z-10 pt-4">
                    <h3 className="text-xl font-semibold mb-3">{s.title}</h3>
                    <p className="text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/40">
        <p>© 2026 SkillMatch Pro. Demo Application.</p>
      </footer>
    </div>
  );
}
