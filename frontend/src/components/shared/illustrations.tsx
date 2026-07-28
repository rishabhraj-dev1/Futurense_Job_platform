import React from "react";

export function AuthHeroIllustration({ className = "w-full max-w-lg" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center p-6 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-primary/10 to-accent/20 rounded-3xl blur-2xl opacity-70" />
      <svg
        viewBox="0 0 500 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto relative z-10 drop-shadow-xl"
      >
        {/* Background Card Grid */}
        <rect x="30" y="40" width="440" height="320" rx="20" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.1" strokeWidth="2"/>
        
        {/* Connection Waves */}
        <path d="M70 200 C 150 120, 220 280, 300 180 S 400 240, 430 200" stroke="url(#paint0_linear)" strokeWidth="4" strokeDasharray="6 6" className="animate-pulse" />

        {/* User Node (Left) */}
        <g transform="translate(90, 150)">
          <circle cx="35" cy="35" r="35" fill="hsl(var(--primary))" fillOpacity="0.15" stroke="hsl(var(--primary))" strokeWidth="3"/>
          <circle cx="35" cy="25" r="12" fill="hsl(var(--primary))"/>
          <path d="M15 48 C15 40, 24 38, 35 38 C46 38, 55 40, 55 48" stroke="hsl(var(--primary))" strokeWidth="3.5" strokeLinecap="round"/>
          <rect x="0" y="80" width="70" height="24" rx="12" fill="currentColor" fillOpacity="0.08"/>
          <text x="35" y="96" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="600">Candidate</text>
        </g>

        {/* AI Engine Center Node */}
        <g transform="translate(215, 125)">
          <circle cx="35" cy="35" r="42" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="3" className="shadow-lg"/>
          <circle cx="35" cy="35" r="30" fill="url(#paint1_linear)"/>
          <path d="M25 35 L32 42 L45 28" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          {/* Glowing rings */}
          <circle cx="35" cy="35" r="48" stroke="hsl(var(--primary))" strokeOpacity="0.3" strokeWidth="2" strokeDasharray="4 4"/>
          <rect x="-10" y="90" width="90" height="26" rx="13" fill="hsl(var(--primary))"/>
          <text x="35" y="107" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">AI Matcher</text>
        </g>

        {/* Job Opportunity Node (Right) */}
        <g transform="translate(340, 150)">
          <circle cx="35" cy="35" r="35" fill="hsl(var(--accent))" fillOpacity="0.2" stroke="hsl(var(--primary))" strokeWidth="3"/>
          <rect x="21" y="21" width="28" height="22" rx="4" fill="hsl(var(--primary))"/>
          <path d="M29 21 V17 C29 15.5 30.5 14 32 14 H38 C39.5 14 41 15.5 41 17 V21" stroke="hsl(var(--primary))" strokeWidth="2.5"/>
          <rect x="0" y="80" width="70" height="24" rx="12" fill="currentColor" fillOpacity="0.08"/>
          <text x="35" y="96" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="600">Ideal Job</text>
        </g>

        {/* Floating Skill Badges */}
        <g transform="translate(100, 65)">
          <rect width="84" height="28" rx="14" fill="hsl(var(--background))" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5"/>
          <text x="42" y="18" textAnchor="middle" fill="hsl(var(--primary))" fontSize="11" fontWeight="600">ReactJS</text>
        </g>
        <g transform="translate(310, 70)">
          <rect width="90" height="28" rx="14" fill="hsl(var(--background))" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5"/>
          <text x="45" y="18" textAnchor="middle" fill="hsl(var(--primary))" fontSize="11" fontWeight="600">TypeScript</text>
        </g>
        <g transform="translate(110, 290)">
          <rect width="80" height="28" rx="14" fill="hsl(var(--background))" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5"/>
          <text x="40" y="18" textAnchor="middle" fill="hsl(var(--primary))" fontSize="11" fontWeight="600">Python</text>
        </g>
        <g transform="translate(300, 295)">
          <rect width="95" height="28" rx="14" fill="hsl(var(--background))" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5"/>
          <text x="47.5" y="18" textAnchor="middle" fill="hsl(var(--primary))" fontSize="11" fontWeight="600">FastAPI</text>
        </g>

        {/* Gradients */}
        <defs>
          <linearGradient id="paint0_linear" x1="70" y1="200" x2="430" y2="200" gradientUnits="userSpaceOnUse">
            <stop stopColor="hsl(var(--primary))" stopOpacity="0.2"/>
            <stop offset="0.5" stopColor="hsl(var(--primary))"/>
            <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0.2"/>
          </linearGradient>
          <linearGradient id="paint1_linear" x1="5" y1="5" x2="65" y2="65" gradientUnits="userSpaceOnUse">
            <stop stopColor="hsl(var(--primary))"/>
            <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0.8"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function EmptyStateIllustration({ title = "No Items Found", message = "Check back soon for new updates." }: { title?: string; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
        <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3 className="text-xl font-bold tracking-tight mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
    </div>
  );
}
