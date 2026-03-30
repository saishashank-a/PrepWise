# PrepWise Monochrome Redesign — Design Spec

**Date:** 2026-03-30
**Status:** Approved
**Approach:** Pixel-perfect Stitch translation into existing React/Tailwind v4 codebase

---

## 1. Decisions

- **Pure monochrome** — black/white/grey only, no color accents anywhere
- **Sidebar navigation** for all inner app pages; top navbar only for landing page
- **Epilogue + Manrope** fonts replacing Syne + Outfit (JetBrains Mono stays for code)
- **Full scope** — restyle all existing pages + build Application Tracker
- **Pro tier stays "Coming Soon"** with disabled monochrome styling

---

## 2. Design System: The Monochrome Blueprint

### 2.1 Color Palette

| Token | Hex | CSS Variable | Role |
|-------|-----|-------------|------|
| `primary` | `#000000` | `--color-primary` | CTAs, active nav, filled buttons, progress bars |
| `on-primary` | `#e2e2e2` | `--color-on-primary` | Text on black backgrounds |
| `surface` | `#f8faf9` | `--color-surface` | Page background |
| `surface-container-lowest` | `#ffffff` | `--color-surface-lowest` | Elevated cards, inputs |
| `surface-container-low` | `#f2f4f3` | `--color-surface-low` | Section backgrounds, sidebar |
| `surface-container` | `#eceeed` | `--color-surface-container` | Badges, dropdowns |
| `surface-container-high` | `#e6e9e8` | `--color-surface-high` | Utility bars, type badges |
| `surface-container-highest` | `#e1e3e2` | `--color-surface-highest` | Progress bar tracks |
| `on-surface` | `#191c1c` | `--color-on-surface` | Primary text |
| `on-surface-variant` | `#474747` | `--color-on-surface-variant` | Secondary text, descriptions |
| `outline` | `#777777` | `--color-outline` | Tertiary text, icons |
| `outline-variant` | `#c6c6c6` | `--color-outline-variant` | Ghost borders (at 10-15% opacity) |

### 2.2 Typography

| Role | Font | Weights | Tracking |
|------|------|---------|----------|
| Headlines/Display | Epilogue | 700, 800, 900 | tight (-0.02em) |
| Body/UI | Manrope | 400, 500, 600, 700 | normal |
| Labels | Manrope | 600, 700 | wide (+0.05em to +0.2em), uppercase |
| Code | JetBrains Mono | 400, 500, 600 | normal |

### 2.3 Design Rules

- **No-Line Rule**: No solid 1px borders for sectioning. Use background color shifts (`surface` → `surface-container-low`).
- **Ghost Borders**: Only at 10-15% opacity (`border-outline-variant/10`). Never 100% opaque decorative borders.
- **Glassmorphism**: `bg-white/70 backdrop-blur-md` for landing page sticky navbar.
- **Corners**: All containers use `rounded-xl` (1.5rem).
- **Depth**: Ambient shadows (`shadow-2xl shadow-black/5`), never solid drop shadows. Blur 40-60px, opacity 4-6%.
- **Buttons**: `active:scale-[0.95]` or `active:scale-[0.97]` on all pressable elements, 200ms duration.
- **Progress Bars**: Architectural cut (no rounded ends). Track: `surface-container-highest`. Fill: `primary`.
- **Icons**: Material Symbols Outlined throughout (replacing lucide-react or custom SVGs).

### 2.4 Component Patterns

**Primary Button**: `bg-black text-white px-6-10 py-2-4 rounded-xl font-bold active:scale-95 duration-200`
**Secondary Button**: `border border-outline-variant px-6-10 py-2-4 rounded-xl font-bold hover:bg-surface-container-low`
**Ghost Button**: Text-only with 2px underline using `primary-fixed-dim`
**Cards**: `bg-surface-container-lowest rounded-xl` with optional `border border-outline-variant/10`, hover: `shadow-2xl shadow-black/5`
**Inverted Card**: `bg-black text-white rounded-xl` (for feature highlights, Smart Scheduling)
**Skill Badges**: `bg-surface-container-lowest border border-outline-variant/10 p-4 rounded-xl`, hover inverts to `bg-black text-white`
**Input Fields**: `bg-surface-container-lowest rounded-xl`, focus: `border-primary ring-1 ring-primary`
**Dropzones**: Custom SVG dashed border (not CSS border-dashed), hover effects
**Nav Links (sidebar)**: Active = `bg-black text-white rounded-xl`, inactive = `text-gray-600 hover:bg-gray-100 rounded-xl`

### 2.5 Navigation

**Landing Page**: Top navbar only
- `fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-black/10 shadow-sm`
- "PrepWise" wordmark (Epilogue black) | nav links | Sign In + Get Started

**Inner Pages** (Dashboard, Study Plan, Resume Builder, Application Tracker): Left sidebar
- `w-64 h-screen fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant/15`
- Logo + subtitle at top
- Nav links with Material Symbols icons
- Active link: `bg-primary text-on-primary rounded-xl`
- "+ New Application" or "+ New Project" black CTA button
- Settings + Logout at bottom
- User avatar + name + plan badge at very bottom

---

## 3. Page Specs

### 3.1 Landing Page (`/`)

**Sections (5 total, down from current 7):**

**Navbar** (sticky glassmorphism):
- Left: "PrepWise" wordmark (Epilogue, font-black, tracking-tighter)
- Center: Features, Editor, Pricing (Epilogue bold, active = border-b-2 border-black)
- Right: "Sign In" text button + "Get Started" black filled button

**Hero**:
- Badge pill: "YOUR JOB SEARCH COMPANION" (uppercase, tracking-widest, green dot indicator)
- Headline: "Land Your Next Role, Faster." (Epilogue 900, text-6xl md:text-8xl, tracking-tighter)
- Subtitle: Manrope, text-on-surface-variant, max-w-2xl
- CTAs: "Get Started Free" (black filled, px-10 py-4) + "See How It Works" (ghost border)
- Below CTAs: Full-width grayscale hero image, rounded-xl, shadow-2xl, gradient overlay from bottom
- **Removed**: WebGL particle field, tech stack pills, scroll indicator, animated counters

**Features (Bento Grid)** on `bg-surface-container-low`:
- Label: "The Architecture" (uppercase, tracked, gray-500)
- Heading: "Precision-Engineered Tools." (Epilogue, 4xl, font-black)
- Asymmetric bento layout:
  - Large card (md:col-span-2): "AI Resume Builder" — icon, heading, description, grayscale image below divider
  - Black inverted card (1-col): "Study Plan" — bg-black text-white
  - White card (1-col): "Dashboard" — ghost border
  - Wide card (md:col-span-2): "Mock Interviews" — text left, grayscale image right
- **Removed**: Uniform 3x2 grid, color-coded icon circles, individual feature descriptions

**Pricing**:
- Heading: "The Blueprint for Success." (Epilogue, 5xl)
- Two cards side by side (max-w-4xl centered):
  - Basic ($0/mo): `bg-surface-container-low`, ghost border CTA "Start Building"
  - Pro ($?/mo): `bg-black text-white`, "COMING SOON" badge (replaces "MOST POPULAR"), disabled CTA
- **Changed**: Pro tier CTA disabled, badge says "COMING SOON"

**CTA + Footer**:
- CTA section: `bg-white border-y border-black/5`, "Ready to Build Your Career?" heading + "Get Started Now" button
- Footer: `bg-white border-t border-black/10`, 4-col grid (Product, Resources, Company), PrepWise wordmark, copyright
- **Removed**: How It Works section, Editor Preview section, detailed feature lists in footer

**Removed from current landing page:**
- WebGL Three.js particle field background
- Animated stat counters
- Editor preview with code mockup
- "How It Works" 4-step section with visuals
- Tech stack pills

### 3.2 Dashboard (`/dashboard`)

**Layout**: Sidebar (shared component) + Main content

**Sidebar**: PrepWise wordmark + "Career Architect" subtitle, Dashboard active (bg-black text-white), Resume Builder, Study Plan, Application Tracker links. Bottom: "+ New Project" button, user profile.

**Header**:
- Label: "WORKSPACE" (uppercase, tracked, on-surface-variant)
- Title: "Dashboard" (Epilogue, 5xl, font-black, tracking-tighter)
- Right: Tab pills — "Resume & Skills" | "Job Description" | "Gap Analysis" in `bg-surface-container-low` container, active tab has `bg-white shadow-sm`

**Content (Resume & Skills tab) — Bento Grid**:
- **Upload Dropzone** (lg:col-span-8): SVG dashed border, `bg-surface-container-lowest`, cloud_upload icon in circle with hover scale, "Architect Your Future" heading, "Upload PDF" black button + "Import LinkedIn" ghost button, supported formats note
- **Readiness Score** (lg:col-span-4): `bg-surface-container-low`, monitoring icon placeholder, progress bar track at bottom. Populated: shows career readiness score.

**Extracted Skills section**:
- Heading: "Extracted Skills" (Epilogue, 3xl, font-black)
- "Edit Master List" tertiary link (uppercase tracked, border-b-2)
- 6-col grid of skill badges (white bg, ghost border, hover → bg-black text-white with close icon)
- Last badge: "+ Add New" dashed border card

**Recent Blueprints section**:
- Heading: "Recent Blueprints" (Epilogue, 3xl)
- Grid of project cards: grayscale image, "Active" badge, role title, company + date, match percentage, arrow icon
- Empty state: dashed border card with post_add icon

**Footer**: Same shared footer component

### 3.3 Study Plan (`/plan`)

**Layout**: Sidebar (Study Plan active) + Main content (8-col) + Right aside (4-col)

**Header**:
- Title: "STUDY PLAN" (Epilogue, 5xl, font-black, uppercase) + "ACTIVE" black pill badge
- Subtitle: roadmap description
- Right: Progress — "3 of 10 topics completed" label + "30%" large number + tonal progress bar (no rounded ends)

**Topic List (lg:col-span-8)**:
- **Topic Cards**: `bg-surface-container-lowest rounded-2xl border border-outline-variant/10`, containing:
  - Left: Up/down reorder arrows (expand_less/expand_more icons)
  - Center: Type badge ("CODING"/"SQL" in `bg-surface-container-high`) + Difficulty badge (Easy/Medium/Hard — all monochrome: `bg-surface-container` text, differentiated by label text only) + Topic title (Epilogue bold)
  - Right: Status dropdown (`<select>`) + Status icon (check_circle/pending/radio_button_unchecked)
  - Interactions: `hover:shadow-2xl hover:shadow-primary/5`, `active:scale-[0.97]`
- **Add Topic button**: `border-2 border-dashed border-outline-variant rounded-2xl`, full-width, "Add Topic to Plan" with add_circle icon

**Right Sidebar (lg:col-span-4)**:
- **Smart Scheduling card**: `bg-primary text-on-primary rounded-2xl`, auto_awesome icon, "Optimize My Plan" white button, decorative blur circle
- **Privacy Safe card**: `bg-surface-container-low rounded-2xl border border-outline-variant/20`, verified_user icon, security copy, lock badge
- **Quick Stats**: 2-col grid — Streak (days) + Points (XP) in white cards with ghost borders

### 3.4 Resume Builder (`/resume-builder`)

**Layout**: Sidebar (Resume Builder active) + Main content

**Header**: Same pattern — label, title "Resume Builder", tab pills for 3 tabs

**ATS Score Check tab**: Same 2-column layout, restyled monochrome
- Left: Resume dropzone (SVG dashed border) + JD textarea + "Check ATS Score" black button
- Right: Score display with tonal progress bars (black fill) or empty state

**Generate Resume tab**: Same layout, monochrome buttons and inputs

**My Resumes tab**: Grid of resume cards in monochrome style
- Role title + company, match percentage, action icons
- Empty state: dashed border + icon

### 3.5 Application Tracker (`/tracker`) — NEW

**Layout**: Sidebar (Application Tracker active) + Full-width main content

**Header**:
- Title: "Application Pipeline" (Epilogue, 5xl, font-black)
- Subtitle: description
- Right: Avatar stack + filter button

**Kanban Board** (4-column grid):
- **Columns**: To Apply | Applied | Interviewing | Offer
- **Column headers**: Title (Epilogue bold) + count badge (`bg-surface-container-high`) + more_horiz menu

- **Application Cards**: `bg-surface-container-lowest p-5 rounded-xl`, containing:
  - Company logo (grayscale, in rounded-lg container)
  - Role title (font-bold)
  - Company + location (on-surface-variant, text-xs)
  - Status/priority badge (uppercase, tracked)
  - Timestamp or action icons
  - `hover:border-primary/10 hover:shadow-xl`, `active:scale-[0.97]`

- **Interviewing cards** get special treatment:
  - `border-l-4 border-primary shadow-lg` for active interview
  - "NEXT UP" badge (absolute positioned, bg-primary)
  - Calendar block: `bg-surface-container-low rounded-lg` with date/time + zoom link
  - Interviewer avatar stack

- **Offer column empty state**: `border-2 border-dashed`, trophy icon, "The Goal" heading, `grayscale opacity-40`

- **Add Application button** (in To Apply column): Dashed border, "Add Application" with add_circle icon

**Pipeline Velocity section** (below Kanban):
- Full-width `bg-surface-container-low rounded-xl` card
- Left: "PERFORMANCE AUDIT" label, "Pipeline Velocity" heading, insight text with highlighted stat, "View Detailed Insights →" link
- Right: 3 stat cards — Reached (count), Response (%), Offers (count in black inverted card)

**New Data Model** — `useApplicationStore` (Zustand):
```typescript
interface Application {
  id: string;
  company: string;
  role: string;
  location: string;
  status: 'to_apply' | 'applied' | 'interviewing' | 'offer' | 'rejected';
  priority: 'high' | 'medium' | 'low' | null;
  appliedDate: string | null;
  interviewDate: string | null;
  interviewLink: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
```
Persistence: localStorage + optional Firebase (same pattern as other stores).

---

## 4. Shared Components

### 4.1 Sidebar (`AppSidebar`)
- Used by: Dashboard, Study Plan, Resume Builder, Application Tracker
- Fixed left, w-64, h-screen, bg-surface-container-low
- Contains: Logo, nav links, CTA button, settings, user profile
- Active link determined by current route

### 4.2 AppLayout
- Wraps all inner pages: `<AppSidebar />` + `<main class="ml-64 min-h-screen bg-surface">`
- Landing page does NOT use this layout

### 4.3 Footer
- Used by all pages (inner pages offset by ml-64)
- 4-column grid, PrepWise wordmark, uppercase tracked links, copyright

---

## 5. Migration Notes

### Files to Create
- `src/components/layout/AppSidebar.tsx` — shared sidebar
- `src/components/layout/AppLayout.tsx` — sidebar + main wrapper
- `src/app/tracker/page.tsx` — Application Tracker page
- `src/components/tracker/KanbanBoard.tsx` — Kanban board
- `src/components/tracker/ApplicationCard.tsx` — individual card
- `src/components/tracker/PipelineVelocity.tsx` — analytics section
- `src/stores/applicationStore.ts` — Zustand store
- `src/lib/applicationTypes.ts` — TypeScript interfaces

### Files to Modify
- `src/app/globals.css` — replace all color/font tokens
- `src/app/layout.tsx` — swap fonts (Epilogue + Manrope for Syne + Outfit)
- `src/app/page.tsx` — landing page (restructure sections)
- `src/app/dashboard/page.tsx` — add sidebar layout, restyle
- `src/app/plan/page.tsx` — add sidebar layout, restyle
- `src/app/resume-builder/page.tsx` — add sidebar layout, restyle
- All `src/components/landing/*` — monochrome restyle
- All `src/components/dashboard/*` — monochrome restyle + bento layout
- All `src/components/resume-builder/*` — monochrome restyle

### Files to Remove (or deprecate)
- `src/components/landing/Hero.tsx` — WebGL particle field no longer needed
- Three.js dependency may become unused

### Dependencies
- Add: `material-symbols` font (via Google Fonts link in layout.tsx)
- Remove: Three.js / @react-three/fiber (if only used for landing hero particles)
- Keep: Framer Motion (still useful for scroll animations, though reduced)
