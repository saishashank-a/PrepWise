# Monochrome Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign PrepWise from a blue/green/red light theme to a pure monochrome editorial aesthetic, add sidebar navigation to inner pages, swap fonts to Epilogue + Manrope, and build a new Application Tracker with Kanban board.

**Architecture:** Replace design tokens in globals.css, swap fonts in layout.tsx, create a shared AppSidebar/AppLayout component for inner pages, restyle each page to match Stitch HTML mockups, and build the Application Tracker as a new route with its own Zustand store.

**Tech Stack:** Next.js, React, Tailwind CSS v4, TypeScript, Zustand, Google Fonts (Epilogue, Manrope, Material Symbols Outlined)

---

## File Map

### Create
- `src/components/layout/AppSidebar.tsx` — shared sidebar nav for inner pages
- `src/components/layout/AppLayout.tsx` — sidebar + main content wrapper
- `src/app/tracker/page.tsx` — Application Tracker page
- `src/components/tracker/KanbanBoard.tsx` — 4-column Kanban layout
- `src/components/tracker/ApplicationCard.tsx` — individual application card
- `src/components/tracker/PipelineVelocity.tsx` — analytics section below Kanban
- `src/components/tracker/AddApplicationModal.tsx` — form to add new application
- `src/stores/useApplicationStore.ts` — Zustand store for applications
- `src/lib/applicationTypes.ts` — TypeScript interfaces for applications

### Modify
- `src/app/globals.css` — replace all color/font tokens with monochrome palette
- `src/app/layout.tsx` — swap fonts (Epilogue + Manrope replacing Syne + Outfit)
- `src/app/page.tsx` — restructure landing page sections
- `src/app/dashboard/page.tsx` — wrap in AppLayout, restyle content
- `src/app/plan/page.tsx` — wrap in AppLayout, restyle with right sidebar
- `src/app/resume-builder/page.tsx` — wrap in AppLayout, restyle
- `src/components/landing/Navbar.tsx` — monochrome glassmorphism restyle
- `src/components/landing/Hero.tsx` — remove WebGL, simplify to editorial hero
- `src/components/landing/Features.tsx` — bento grid layout
- `src/components/landing/Pricing.tsx` — monochrome two-card layout
- `src/components/landing/Footer.tsx` — monochrome restyle
- `src/components/upload/ResumeUpload.tsx` — monochrome dropzone
- `src/components/upload/SkillTagger.tsx` — hover-invert badges
- `src/components/upload/GapView.tsx` — monochrome metric cards
- `src/components/plan/PlanBuilder.tsx` — richer topic cards with reorder arrows
- `src/components/plan/TopicCard.tsx` — monochrome badges + status dropdown
- `src/components/plan/ProgressBar.tsx` — architectural cut (no rounded ends)
- `src/components/resume-builder/ATSChecker.tsx` — monochrome inputs/buttons
- `src/components/resume-builder/ScoreDisplay.tsx` — tonal progress bars
- `src/components/resume-builder/ResumeGenerator.tsx` — monochrome restyle
- `src/components/resume-builder/ResumeLibrary.tsx` — monochrome cards
- `src/components/resume-builder/ResumeCard.tsx` — monochrome restyle

### Remove (from landing page)
- `src/components/landing/Stats.tsx` — counter section removed
- `src/components/landing/EditorPreview.tsx` — editor mockup removed
- `src/components/landing/HowItWorks.tsx` — 4-step section removed

### Rewrite
- `src/components/three/ParticleField.tsx` — rewrite as monochrome layered WebGL (dot grid parallax + wireframe mesh + film grain)

---

## Task 1: Design Tokens & Fonts

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace globals.css with monochrome design tokens**

Replace the entire `src/app/globals.css` with:

```css
@import "tailwindcss";

@theme inline {
  /* ── Monochrome Blueprint ── */
  --color-primary: #000000;
  --color-on-primary: #e2e2e2;
  --color-primary-container: #3b3b3b;
  --color-primary-fixed-dim: #474747;

  /* ── Surfaces ── */
  --color-surface: #f8faf9;
  --color-surface-lowest: #ffffff;
  --color-surface-low: #f2f4f3;
  --color-surface-container: #eceeed;
  --color-surface-high: #e6e9e8;
  --color-surface-highest: #e1e3e2;
  --color-surface-dim: #d8dada;
  --color-background: #f8faf9;

  /* ── Text ── */
  --color-on-surface: #191c1c;
  --color-on-surface-variant: #474747;
  --color-on-background: #191c1c;

  /* ── Borders ── */
  --color-outline: #777777;
  --color-outline-variant: #c6c6c6;

  /* ── Semantic (error only) ── */
  --color-error: #ba1a1a;
  --color-error-container: #ffdad6;

  /* ── Legacy aliases (prevent breakage during migration) ── */
  --color-foreground: #191c1c;
  --color-border-default: #e2e8f0;
  --color-text-secondary: #474747;
  --color-text-muted: #777777;
  --color-success: #191c1c;
  --color-accent: #191c1c;

  /* ── Fonts ── */
  --font-sans: var(--font-manrope);
  --font-mono: var(--font-jetbrains);
  --font-display: var(--font-epilogue);

  /* ── Animation curves (Emil Kowalski) ── */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
}

html {
  scroll-behavior: smooth;
}

html,
body {
  overflow-x: hidden;
}

body {
  background: var(--color-background);
  color: var(--color-on-surface);
  font-family: var(--font-sans), system-ui, sans-serif;
}

h1, h2, h3 {
  font-family: var(--font-display), system-ui, sans-serif;
}

/* Custom scrollbar — monochrome */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--color-surface-highest);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-outline-variant);
}

/* Material Symbols */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  vertical-align: middle;
}

/* SVG dashed border for dropzones */
.dashed-border {
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='24' ry='24' stroke='%230000001A' stroke-width='2' stroke-dasharray='8%2c 12' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
}

/* Glassmorphism — monochrome */
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Button feedback (Emil: buttons must feel responsive) */
button, [role="button"], a.btn {
  transition: transform 200ms var(--ease-out);
}

button:active, [role="button"]:active, a.btn:active {
  transform: scale(0.97);
}

/* Stagger animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.3s var(--ease-out) forwards;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Touch device hover guard */
@media (hover: hover) and (pointer: fine) {
  .hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }
}

/* Code block styling */
.code-line {
  font-family: var(--font-mono), "JetBrains Mono", monospace;
}

/* Markdown prose — monochrome */
.prose-prepwise {
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--color-on-surface-variant);
}

.prose-prepwise h2 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-on-surface);
  margin-top: 1.75rem;
  margin-bottom: 0.75rem;
  font-family: var(--font-display);
}

.prose-prepwise h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-on-surface);
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

.prose-prepwise p { margin-bottom: 0.75rem; }
.prose-prepwise strong { color: var(--color-on-surface); font-weight: 600; }

.prose-prepwise code {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  background: var(--color-surface-low);
  color: var(--color-on-surface);
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  border: 1px solid var(--color-outline-variant);
}

.prose-prepwise pre {
  background: #1e293b !important;
  border: 1px solid var(--color-outline-variant);
  border-radius: 0.75rem;
  padding: 1rem;
  margin: 0.75rem 0;
  overflow-x: auto;
}

.prose-prepwise pre code {
  background: none;
  border: none;
  padding: 0;
  color: #e2e8f0;
  font-size: 0.8rem;
  line-height: 1.6;
}

.prose-prepwise ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 0.75rem; }
.prose-prepwise ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 0.75rem; }
.prose-prepwise li { margin-bottom: 0.25rem; }

.prose-prepwise blockquote {
  border-left: 3px solid var(--color-primary);
  padding-left: 1rem;
  margin: 0.75rem 0;
  color: var(--color-outline);
  font-style: italic;
}

/* highlight.js overrides */
.hljs { background: #1e293b !important; color: #e2e8f0 !important; }
.hljs-keyword { color: #c792ea; }
.hljs-string { color: #c3e88d; }
.hljs-number { color: #f78c6c; }
.hljs-comment { color: #64748b; font-style: italic; }
.hljs-function { color: #82aaff; }
.hljs-built_in { color: #ffcb6b; }
.hljs-title { color: #82aaff; }
.hljs-params { color: #e2e8f0; }
.hljs-attr { color: #ffcb6b; }
```

- [ ] **Step 2: Swap fonts in layout.tsx**

Replace the entire `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Epilogue, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "PrepWise | AI-Powered Interview Preparation",
  description:
    "Master your next technical interview with personalized learning paths, in-browser code execution, and AI-powered gap analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${epilogue.variable} ${manrope.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Verify build compiles**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds (warnings about unused imports are OK at this stage)

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "design: replace color tokens and fonts with monochrome blueprint"
```

---

## Task 2: Shared Sidebar & App Layout

**Files:**
- Create: `src/components/layout/AppSidebar.tsx`
- Create: `src/components/layout/AppLayout.tsx`

- [ ] **Step 1: Create AppSidebar component**

Create `src/components/layout/AppSidebar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/resume-builder", label: "Resume Builder", icon: "description" },
  { href: "/plan", label: "Study Plan", icon: "menu_book" },
  { href: "/tracker", label: "Application Tracker", icon: "assignment_turned_in" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 bg-[#f2f4f3] border-r border-[#c6c6c6]/15 p-6 gap-8 fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="mb-2">
        <Link href="/">
          <h1 className="text-xl font-bold font-[var(--font-display)] text-black tracking-tighter">
            PrepWise
          </h1>
        </Link>
        <p className="text-[10px] uppercase tracking-widest text-[#474747] mt-1">
          Career Architect
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? "bg-black text-white"
                  : "text-[#474747] hover:bg-[#e6e9e8]"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* CTA Button */}
      <button className="w-full py-3 bg-black text-[#e2e2e2] rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
        <span className="material-symbols-outlined text-sm">add</span>
        New Application
      </button>

      {/* Bottom */}
      <div className="pt-6 border-t border-black/5 flex flex-col gap-1">
        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-2 text-[#474747] hover:text-black transition-colors"
        >
          <span className="material-symbols-outlined text-sm">settings</span>
          <span className="text-sm font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Create AppLayout wrapper**

Create `src/components/layout/AppLayout.tsx`:

```tsx
import AppSidebar from "./AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f8faf9]">
      <AppSidebar />
      <main className="flex-1 md:ml-64 min-w-0 bg-[#f8faf9]">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Verify build compiles**

Run: `npm run build 2>&1 | tail -20`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/AppSidebar.tsx src/components/layout/AppLayout.tsx
git commit -m "feat: add shared AppSidebar and AppLayout for inner pages"
```

---

## Task 3: Landing Page — Navbar

**Files:**
- Modify: `src/components/landing/Navbar.tsx`

- [ ] **Step 1: Rewrite Navbar to monochrome glassmorphism**

Read the current file first, then replace its entire contents with the monochrome version based on the Stitch HTML. The navbar should have:
- Fixed top, `bg-white/70 backdrop-blur-md border-b border-black/10 shadow-sm`
- "PrepWise" wordmark (Epilogue font-black tracking-tighter)
- Center links: Features, Editor, Pricing (Epilogue bold, underline active)
- Right: "Sign In" text + "Get Started" black filled button
- Mobile hamburger menu

- [ ] **Step 2: Verify landing page renders**

Run dev server, navigate to `http://localhost:3000`, check navbar appears correctly.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing/Navbar.tsx
git commit -m "design: monochrome glassmorphism navbar"
```

---

## Task 4: Landing Page — Hero

**Files:**
- Modify: `src/components/landing/Hero.tsx`

- [ ] **Step 1: Rewrite Hero to editorial monochrome**

Replace the Hero with the Stitch design:
- Badge pill: "YOUR JOB SEARCH COMPANION" with green dot
- Giant headline: "Land Your Next Role, Faster." (Epilogue 900, text-6xl md:text-8xl, single color black)
- Subtitle in on-surface-variant
- Two CTAs: "Get Started Free" (bg-black) + "See How It Works" (ghost border)
- Full-width grayscale hero image with rounded-xl shadow-2xl and gradient overlay
- Replace: WebGL ParticleField with layered monochrome WebGL effect (dot grid parallax + wireframe mesh + film grain — see Task 4b)
- Remove: tech stack pills, scroll indicator, animated counters, gradient text

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/Hero.tsx
git commit -m "design: monochrome editorial hero section"
```

---

## Task 4b: Landing Page — Monochrome WebGL Background

**Files:**
- Modify: `src/components/three/ParticleField.tsx` (rewrite as `MonochromeField`)

- [ ] **Step 1: Rewrite ParticleField as a layered monochrome WebGL effect**

Replace the existing colorful particle field with a three-layer monochrome composition:

**Layer 1 — Dot Grid with Mouse Parallax:**
- Uniform grid of small circles (radius ~1.5px, color `#c6c6c6` at 40% opacity)
- Grid spacing ~40px
- Dots shift position subtly in response to mouse movement (parallax factor ~0.02)
- Use `useSpring` from Framer Motion for smooth interpolation (not instant tracking)

**Layer 2 — Geometric Wireframe Mesh:**
- Slowly rotating wireframe polyhedron (icosahedron or similar) centered in the hero
- Black strokes only (`#191c1c` at 8-12% opacity), no fill
- Very slow rotation (~0.001 rad/frame on Y axis)
- Scale large enough to fill ~60% of the hero width

**Layer 3 — Film Grain Overlay:**
- Subtle animated noise texture via a shader or canvas 2D
- Very low opacity (3-5%)
- Refreshes every 2-3 frames for cinematic grain feel
- Uses `mix-blend-mode: multiply` or similar to blend with background

All three layers render in a single `<canvas>` element positioned `absolute inset-0 z-0` behind the hero content. Keep Three.js dependency — just change what's rendered.

- [ ] **Step 2: Verify hero renders with new background**

Run dev server, check `/` — background should be subtle, monochrome, and respond to mouse.

- [ ] **Step 3: Commit**

```bash
git add src/components/three/ParticleField.tsx
git commit -m "design: monochrome WebGL background — dot grid, wireframe mesh, film grain"
```

---

## Task 5: Landing Page — Features Bento Grid

**Files:**
- Modify: `src/components/landing/Features.tsx`

- [ ] **Step 1: Rewrite Features as asymmetric bento grid**

Replace the uniform 3×2 grid with the Stitch bento layout:
- Section on `bg-[#f2f4f3]` background
- Label: "The Architecture" (uppercase tracked)
- Heading: "Precision-Engineered Tools." (Epilogue 4xl font-black)
- Bento grid: Large card (2-col) "AI Resume Builder" with Material Symbols icon + grayscale image, black inverted card "Study Plan", white card "Dashboard", wide card (2-col) "Mock Interviews"

- [ ] **Step 2: Commit**

```bash
git add src/components/landing/Features.tsx
git commit -m "design: monochrome bento grid features section"
```

---

## Task 6: Landing Page — Pricing + Footer + Page Assembly

**Files:**
- Modify: `src/components/landing/Pricing.tsx`
- Modify: `src/components/landing/Footer.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Rewrite Pricing to monochrome two-card layout**

- Heading: "The Blueprint for Success."
- Basic ($0): `bg-[#f2f4f3]`, ghost border CTA
- Pro ($?): `bg-black text-white`, "COMING SOON" badge, disabled CTA button

- [ ] **Step 2: Rewrite Footer to monochrome**

- CTA section: "Ready to Build Your Career?" + black button
- 4-column grid, all uppercase tracked links, "PrepWise" wordmark
- Copyright with "The Monochrome Blueprint"

- [ ] **Step 3: Update page.tsx to remove deleted sections**

Remove imports/usage of: Stats, EditorPreview, HowItWorks, ParticleField.
Keep: Navbar, Hero, Features, Pricing, Footer.

- [ ] **Step 4: Verify landing page renders fully**

Run dev server, check all sections render, no console errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/landing/Pricing.tsx src/components/landing/Footer.tsx src/app/page.tsx
git commit -m "design: monochrome pricing, footer, and landing page assembly"
```

---

## Task 7: Dashboard — Layout & Restyle

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/components/upload/ResumeUpload.tsx`
- Modify: `src/components/upload/SkillTagger.tsx`

- [ ] **Step 1: Wrap dashboard in AppLayout and restyle header**

Update `src/app/dashboard/page.tsx`:
- Import and wrap with `<AppLayout>`
- Remove the old top navbar/header
- Add: "WORKSPACE" label (uppercase tracked), "Dashboard" title (Epilogue 5xl), tab pills in `bg-[#f2f4f3]` container

- [ ] **Step 2: Restyle ResumeUpload to monochrome dropzone**

Update `src/components/upload/ResumeUpload.tsx`:
- Use SVG dashed border class (`dashed-border`)
- Cloud upload Material Symbol icon in circle
- "Architect Your Future" heading
- Black "Upload PDF" button + ghost "Import LinkedIn" button
- Remove all blue/primary color references

- [ ] **Step 3: Restyle SkillTagger with hover-invert badges**

Update `src/components/upload/SkillTagger.tsx`:
- White badges with ghost border (`border-[#c6c6c6]/10`)
- Hover: `bg-black text-white` with close icon appearing
- "+ Add New" dashed border card at end

- [ ] **Step 4: Verify dashboard renders**

Run dev server, navigate to `/dashboard`, check layout and components.

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/page.tsx src/components/upload/ResumeUpload.tsx src/components/upload/SkillTagger.tsx
git commit -m "design: monochrome dashboard with sidebar layout"
```

---

## Task 8: Dashboard — Gap Analysis Restyle

**Files:**
- Modify: `src/components/upload/GapView.tsx`
- Modify: `src/components/upload/JDInput.tsx`

- [ ] **Step 1: Restyle GapView to monochrome**

- Summary cards: all monochrome backgrounds (no green/red/blue), use `bg-[#ffffff]` with different border weights or labels to differentiate Matches/Gaps/Extra
- Table: monochrome checkmarks and X marks (black, not colored)
- "Generate Study Plan" button: black filled

- [ ] **Step 2: Restyle JDInput to monochrome**

- Textarea: `bg-white rounded-xl border border-[#c6c6c6]/15`, focus: `border-black ring-1 ring-black/10`
- Extract button: black filled
- JD skill badges: monochrome (same hover-invert pattern)

- [ ] **Step 3: Commit**

```bash
git add src/components/upload/GapView.tsx src/components/upload/JDInput.tsx
git commit -m "design: monochrome gap analysis and JD input"
```

---

## Task 9: Study Plan — Layout & Restyle

**Files:**
- Modify: `src/app/plan/page.tsx`
- Modify: `src/components/plan/PlanBuilder.tsx`
- Modify: `src/components/plan/TopicCard.tsx`
- Modify: `src/components/plan/ProgressBar.tsx`

- [ ] **Step 1: Wrap plan page in AppLayout and restyle**

Update `src/app/plan/page.tsx`:
- Import and wrap with `<AppLayout>`
- Remove old top navbar
- Add: "STUDY PLAN" title (uppercase, Epilogue 5xl) + "ACTIVE" black pill badge
- Add progress tracker on right (count label + percentage + tonal bar)
- Two-column layout: topic list (lg:col-span-8) + right sidebar cards (lg:col-span-4)
- Right sidebar: Smart Scheduling card (bg-black, white text, sparkle icon, "Optimize My Plan" button), Privacy Safe card, Quick Stats grid (Streak + Points)

- [ ] **Step 2: Restyle TopicCard to monochrome**

Update `src/components/plan/TopicCard.tsx`:
- White card with ghost border, rounded-2xl
- Up/down reorder arrows on left
- Type badge: `bg-[#e6e9e8]` monochrome, uppercase tracked
- Difficulty badge: monochrome `bg-[#eceeed]`, differentiated by text only (EASY/MEDIUM/HARD)
- Status: `<select>` dropdown (Not Started/In Progress/Completed) + status icon
- `hover:shadow-2xl hover:shadow-black/5`, `active:scale-[0.97]`

- [ ] **Step 3: Restyle ProgressBar to architectural cut**

Update `src/components/plan/ProgressBar.tsx`:
- Track: `bg-[#e1e3e2]`, no rounded ends
- Fill: `bg-black`, no rounded ends
- Remove any `rounded-full` classes

- [ ] **Step 4: Restyle PlanBuilder**

Update `src/components/plan/PlanBuilder.tsx`:
- Monochrome template selector
- "Add Topic to Plan" dashed border button (full-width)
- Remove all color references

- [ ] **Step 5: Verify study plan renders**

Run dev server, navigate to `/plan`.

- [ ] **Step 6: Commit**

```bash
git add src/app/plan/page.tsx src/components/plan/PlanBuilder.tsx src/components/plan/TopicCard.tsx src/components/plan/ProgressBar.tsx
git commit -m "design: monochrome study plan with sidebar and right panel"
```

---

## Task 10: Resume Builder — Restyle

**Files:**
- Modify: `src/app/resume-builder/page.tsx`
- Modify: `src/components/resume-builder/ATSChecker.tsx`
- Modify: `src/components/resume-builder/ScoreDisplay.tsx`
- Modify: `src/components/resume-builder/ResumeGenerator.tsx`
- Modify: `src/components/resume-builder/ResumeLibrary.tsx`
- Modify: `src/components/resume-builder/ResumeCard.tsx`

- [ ] **Step 1: Wrap resume builder in AppLayout and restyle page**

Update `src/app/resume-builder/page.tsx`:
- Import and wrap with `<AppLayout>`
- Remove old top navbar
- Add monochrome header with title + tab pills

- [ ] **Step 2: Restyle ATSChecker**

- SVG dashed border dropzone
- Black "Check ATS Score" button
- All inputs: white bg, ghost borders, black focus ring

- [ ] **Step 3: Restyle ScoreDisplay**

- Score gauge: monochrome (black fill on grey track)
- Breakdown bars: black fill, `bg-[#e1e3e2]` track, no rounded ends
- Remove all color coding (red/amber/green)

- [ ] **Step 4: Restyle ResumeGenerator, ResumeLibrary, ResumeCard**

- All buttons: black or ghost border
- All cards: white bg, ghost border, hover shadow
- Remove all blue/green/red color references

- [ ] **Step 5: Verify resume builder renders**

Navigate to `/resume-builder`, check all 3 tabs.

- [ ] **Step 6: Commit**

```bash
git add src/app/resume-builder/page.tsx src/components/resume-builder/ATSChecker.tsx src/components/resume-builder/ScoreDisplay.tsx src/components/resume-builder/ResumeGenerator.tsx src/components/resume-builder/ResumeLibrary.tsx src/components/resume-builder/ResumeCard.tsx
git commit -m "design: monochrome resume builder with sidebar layout"
```

---

## Task 11: Application Tracker — Types & Store

**Files:**
- Create: `src/lib/applicationTypes.ts`
- Create: `src/stores/useApplicationStore.ts`

- [ ] **Step 1: Create application types**

Create `src/lib/applicationTypes.ts`:

```typescript
export type ApplicationStatus = "to_apply" | "applied" | "interviewing" | "offer" | "rejected";
export type Priority = "high" | "medium" | "low";

export interface Application {
  id: string;
  company: string;
  role: string;
  location: string;
  status: ApplicationStatus;
  priority: Priority | null;
  appliedDate: string | null;
  interviewDate: string | null;
  interviewLink: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export const STATUS_COLUMNS: { key: ApplicationStatus; label: string }[] = [
  { key: "to_apply", label: "To Apply" },
  { key: "applied", label: "Applied" },
  { key: "interviewing", label: "Interviewing" },
  { key: "offer", label: "Offer" },
];
```

- [ ] **Step 2: Create Zustand store**

Create `src/stores/useApplicationStore.ts`:

```typescript
import { create } from "zustand";
import { Application, ApplicationStatus } from "@/lib/applicationTypes";

interface ApplicationStore {
  applications: Application[];
  loaded: boolean;
  addApplication: (app: Omit<Application, "id" | "createdAt" | "updatedAt">) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  moveApplication: (id: string, status: ApplicationStatus) => void;
  deleteApplication: (id: string) => void;
  getByStatus: (status: ApplicationStatus) => Application[];
  getStats: () => { reached: number; responseRate: number; offers: number };
  persist: () => void;
  load: () => void;
}

export const useApplicationStore = create<ApplicationStore>((set, get) => ({
  applications: [],
  loaded: false,

  addApplication: (app) => {
    const now = new Date().toISOString();
    const newApp: Application = {
      ...app,
      id: `app_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ applications: [...state.applications, newApp] }));
    get().persist();
  },

  updateApplication: (id, updates) => {
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, ...updates, updatedAt: new Date().toISOString() } : app
      ),
    }));
    get().persist();
  },

  moveApplication: (id, status) => {
    get().updateApplication(id, { status });
  },

  deleteApplication: (id) => {
    set((state) => ({
      applications: state.applications.filter((app) => app.id !== id),
    }));
    get().persist();
  },

  getByStatus: (status) => {
    return get().applications.filter((app) => app.status === status);
  },

  getStats: () => {
    const apps = get().applications;
    const reached = apps.filter((a) => a.status !== "to_apply").length;
    const withResponse = apps.filter(
      (a) => a.status === "interviewing" || a.status === "offer"
    ).length;
    const responseRate = reached > 0 ? Math.round((withResponse / reached) * 100) : 0;
    const offers = apps.filter((a) => a.status === "offer").length;
    return { reached, responseRate, offers };
  },

  persist: () => {
    const { applications } = get();
    localStorage.setItem("prepwise_applications", JSON.stringify(applications));
  },

  load: () => {
    try {
      const stored = localStorage.getItem("prepwise_applications");
      if (stored) {
        set({ applications: JSON.parse(stored), loaded: true });
      } else {
        set({ loaded: true });
      }
    } catch {
      set({ loaded: true });
    }
  },
}));
```

- [ ] **Step 3: Verify build compiles**

Run: `npm run build 2>&1 | tail -20`

- [ ] **Step 4: Commit**

```bash
git add src/lib/applicationTypes.ts src/stores/useApplicationStore.ts
git commit -m "feat: add Application types and Zustand store"
```

---

## Task 12: Application Tracker — UI Components

**Files:**
- Create: `src/components/tracker/ApplicationCard.tsx`
- Create: `src/components/tracker/AddApplicationModal.tsx`
- Create: `src/components/tracker/PipelineVelocity.tsx`
- Create: `src/components/tracker/KanbanBoard.tsx`

- [ ] **Step 1: Create ApplicationCard**

Create `src/components/tracker/ApplicationCard.tsx` — a monochrome card showing company, role, location, priority badge, timestamp. Interviewing cards get `border-l-4 border-black shadow-lg` and optional calendar block. All cards: `hover:shadow-xl active:scale-[0.97]`.

- [ ] **Step 2: Create AddApplicationModal**

Create `src/components/tracker/AddApplicationModal.tsx` — simple form with fields: company, role, location, priority (select), notes (textarea). Black "Add Application" submit button.

- [ ] **Step 3: Create PipelineVelocity**

Create `src/components/tracker/PipelineVelocity.tsx` — `bg-[#f2f4f3] rounded-xl` card with "Pipeline Velocity" heading, insight text, 3 stat boxes (Reached, Response %, Offers — last one inverted black).

- [ ] **Step 4: Create KanbanBoard**

Create `src/components/tracker/KanbanBoard.tsx` — 4-column grid using `STATUS_COLUMNS` from types. Each column: header with title + count badge + cards from store filtered by status. "Add Application" dashed button in first column. Empty "Offer" column: dashed border with trophy icon.

- [ ] **Step 5: Commit**

```bash
git add src/components/tracker/
git commit -m "feat: add Application Tracker UI components"
```

---

## Task 13: Application Tracker — Page & Route

**Files:**
- Create: `src/app/tracker/page.tsx`

- [ ] **Step 1: Create tracker page**

Create `src/app/tracker/page.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import KanbanBoard from "@/components/tracker/KanbanBoard";
import PipelineVelocity from "@/components/tracker/PipelineVelocity";
import { useApplicationStore } from "@/stores/useApplicationStore";

export default function TrackerPage() {
  const { load, loaded } = useApplicationStore();

  useEffect(() => {
    if (!loaded) load();
  }, [load, loaded]);

  return (
    <AppLayout>
      <div className="p-8 md:p-12 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <h1 className="font-[var(--font-display)] text-5xl font-black tracking-tighter mb-2">
              Application Pipeline
            </h1>
            <p className="text-[#474747] max-w-md">
              Orchestrating your career transition with architectural precision.
              Manage your high-impact opportunities.
            </p>
          </div>
          <button className="p-3 border border-[#c6c6c6]/15 rounded-xl hover:bg-[#f2f4f3] transition-all">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </header>

        {/* Kanban Board */}
        <KanbanBoard />

        {/* Pipeline Velocity */}
        <div className="mt-20">
          <PipelineVelocity />
        </div>
      </div>
    </AppLayout>
  );
}
```

- [ ] **Step 2: Verify tracker page renders**

Run dev server, navigate to `/tracker`.

- [ ] **Step 3: Commit**

```bash
git add src/app/tracker/page.tsx
git commit -m "feat: add Application Tracker page route"
```

---

## Task 14: Cleanup & Final Verification

**Files:**
- Delete references to: `Stats.tsx`, `EditorPreview.tsx`, `HowItWorks.tsx` (if not already removed in Task 6)
- Verify all pages render without errors

- [ ] **Step 1: Remove unused landing components**

If `Stats.tsx`, `EditorPreview.tsx`, `HowItWorks.tsx` are no longer imported anywhere, delete them. Check `page.tsx` first to confirm they're not referenced.

- [ ] **Step 2: Check for stale color references**

Run: `grep -rn "emerald\|cyan-glow\|blue-400\|green-500\|red-500\|amber-\|bg-primary-light\|text-primary\b" src/ --include="*.tsx" | head -30`

Fix any remaining old color references to monochrome equivalents.

- [ ] **Step 3: Full build verification**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Visual verification of all pages**

Use Playwright or manual browser check:
- `/` — Landing page (navbar, hero, features, pricing, footer)
- `/dashboard` — Dashboard (sidebar, tabs, upload, skills)
- `/plan` — Study Plan (sidebar, topic cards, right panel)
- `/resume-builder` — Resume Builder (sidebar, 3 tabs)
- `/tracker` — Application Tracker (sidebar, kanban, velocity)

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "design: complete monochrome redesign — cleanup and verification"
```
