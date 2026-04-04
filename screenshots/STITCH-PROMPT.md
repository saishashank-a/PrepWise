# PrepWise — Google Stitch Design Brief

> **Screenshots to upload (5):** `00-landing-hero.png`, `02-dashboard.png`, `03-study-plan.png`, `04-resume-builder-ats.png`, `06-resume-builder-library.png`

---

## What is PrepWise?

PrepWise is a **free, browser-based job search companion** for unemployed professionals actively searching for their next role. It covers the entire job search lifecycle:

1. **Build** ATS-optimized resumes
2. **Score** them against job descriptions
3. **Tailor** resumes per role with AI
4. **Track** applications (Kanban board — coming soon)
5. **Prepare** for technical interviews with an in-browser code editor

Everything runs client-side — no data leaves the user's machine. The product is 100% free.

**Live URL:** https://prep-wise-tawny-ten.vercel.app
**Stack:** Next.js 16, React, Tailwind CSS v4, TypeScript, Zustand, Firebase (optional persistence), Pyodide (Python WASM), PGlite (Postgres WASM), Monaco Editor, Framer Motion

---

## Design System & Rules

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| **Primary (Ocean Blue)** | `#2563eb` | CTAs, active tabs, links, primary buttons, focus rings |
| **Primary Hover** | `#1d4ed8` | Button hover states |
| **Primary Light** | `#eff6ff` | Selected tab backgrounds, active card backgrounds, light badges |
| **Success (Emerald)** | `#10b981` | Pass indicators, completed states, success badges |
| **Success Light** | `#ecfdf5` | Success card backgrounds |
| **Accent (Coral Red)** | `#f43f5e` | Error states, failed tests, gap indicators, delete actions |
| **Accent Light** | `#fff1f2` | Error card backgrounds |
| **Warning (Amber)** | `#f59e0b` | Medium difficulty badges, warning states |
| **Background** | `#ffffff` | Page background |
| **Surface** | `#f8fafc` | Card backgrounds, section backgrounds, empty states |
| **Foreground** | `#0f172a` | Primary text (slate-900) |
| **Text Secondary** | `#475569` | Descriptions, subtitles (slate-600) |
| **Text Muted** | `#94a3b8` | Placeholders, hints (slate-400) |
| **Border Default** | `#e2e8f0` | Card borders, input borders, dividers |

### Typography
| Role | Font | Weights |
|------|------|---------|
| **Headlines / Display** | Syne (Google Fonts) | 700, 800 |
| **Body / UI** | Outfit (Google Fonts) | 300–800 |
| **Code / Monospace** | JetBrains Mono (Google Fonts) | 400, 500, 600 |

### Component Patterns
- **Cards**: `rounded-xl`, `border border-[#e2e8f0]`, `bg-white` or `bg-[#f8fafc]`, subtle shadow on hover
- **Buttons (Primary)**: `bg-[#2563eb] text-white rounded-xl px-6 py-3`, hover darkens to `#1d4ed8`
- **Buttons (Secondary)**: `border border-[#e2e8f0] bg-white text-[#0f172a] rounded-xl`, hover adds shadow
- **Tabs**: Horizontal pill-style tabs in a rounded container with `bg-[#f8fafc]` background; active tab gets `bg-white shadow-sm border`
- **Input Fields**: `rounded-xl border-[#e2e8f0]`, on focus: `border-[#2563eb]` with blue ring
- **Dropzones**: `border-2 border-dashed border-[#e2e8f0] rounded-xl`, hover: `border-[#2563eb] bg-[#eff6ff]`
- **Badges**: `inline-flex rounded-full px-3 py-1 text-xs font-medium`, color-coded per category
- **Empty States**: Centered icon + heading + description + CTA button, all within a `bg-[#f8fafc] rounded-2xl` container

---

## Design Engineering Rules (MUST FOLLOW)

These rules define how every interaction, animation, and micro-detail should behave across PrepWise. They are non-negotiable.

### Core Philosophy
- **Unseen details compound.** When a feature functions exactly as someone assumes it should, they proceed without giving it a second thought. That is the goal. Every invisible detail combines to produce something that feels right.
- **Beauty is leverage.** People select tools based on the overall experience. Good defaults and good animations are real differentiators.
- **Taste is trained.** Don't just make it work — study why the best interfaces feel the way they do.

### Animation Decision Framework

**Step 1 — Should this animate at all?**
| Frequency | Decision |
|-----------|----------|
| 100+ times/day (keyboard shortcuts, command palette) | No animation. Ever. |
| Tens of times/day (hover effects, tab switching) | Remove or drastically reduce |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare/first-time (onboarding, celebrations) | Can add delight |

**Step 2 — What easing?**
- Element entering or exiting → `ease-out`
- Moving/morphing on screen → `ease-in-out`
- Hover/color change → `ease`
- Constant motion (progress bars) → `linear`
- **NEVER use `ease-in` for UI animations** — it starts slow and feels sluggish

**Use these custom curves (not CSS defaults — they're too weak):**
```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);      /* UI interactions */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);   /* On-screen movement */
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);    /* Drawer/sheet animations */
```

**Step 3 — How fast?**
| Element | Duration |
|---------|----------|
| Button press feedback | 100–160ms |
| Tooltips, small popovers | 125–200ms |
| Dropdowns, selects, tabs | 150–250ms |
| Modals, drawers | 200–500ms |
| **Rule: UI animations must stay under 300ms** | |

### Mandatory Component Behaviors

**Buttons must feel responsive:**
- Add `transform: scale(0.97)` on `:active` with 160ms ease-out transition
- Every pressable element needs this — it confirms the UI heard the user

**Never animate from scale(0):**
- Nothing in the real world appears from nothing
- Start from `scale(0.95)` + `opacity: 0` minimum

**Popovers must be origin-aware:**
- Popovers scale from their trigger, not from center
- Exception: modals stay `transform-origin: center` (they're not anchored to a trigger)

**Tooltips must skip delay on subsequent hovers:**
- First tooltip: delay before appearing
- Adjacent tooltips while one is open: instant, no animation

**Stagger animations for lists:**
- When multiple elements enter together, stagger with 30–80ms delay between items
- Never block interaction during stagger playback

**Asymmetric enter/exit timing:**
- Slow where the user is deciding (e.g., hold-to-delete: 2s linear)
- Fast where the system is responding (e.g., release/dismiss: 200ms ease-out)

### Performance Rules
- **Only animate `transform` and `opacity`** — these skip layout and paint, run on GPU
- Never animate `padding`, `margin`, `height`, `width`
- Prefer CSS transitions over keyframes for interruptible UI (toasts, toggles)
- Use CSS animations for predetermined sequences (they run off main thread, smooth under load)

### Accessibility
- Respect `prefers-reduced-motion`: keep opacity/color transitions, remove movement
- Gate hover animations behind `@media (hover: hover) and (pointer: fine)` — touch devices trigger hover on tap

### Review Checklist (apply to every component)
| Issue | Fix |
|-------|-----|
| `transition: all` | Specify exact properties: `transition: transform 200ms ease-out` |
| `scale(0)` entry | Start from `scale(0.95)` with `opacity: 0` |
| `ease-in` on UI element | Switch to `ease-out` or custom curve |
| `transform-origin: center` on popover | Set to trigger location (modals exempt) |
| Animation on keyboard action | Remove animation entirely |
| Duration > 300ms on UI element | Reduce to 150–250ms |
| Hover without media query | Add `@media (hover: hover) and (pointer: fine)` |
| Elements all appearing at once | Add stagger delay (30–80ms between items) |
| No `:active` state on button | Add `transform: scale(0.97)` |
| Same enter/exit speed | Make exit faster than enter |

---

## Page-by-Page Layout & Functionality

### SCREENSHOT 1: Landing Page Hero (`00-landing-hero.png`)

**Full scrollable landing page with 7 sections. The screenshot shows the hero viewport.**

**1.1 — Navbar (sticky)**
- Left: Lightning bolt icon + "PrepWise" wordmark (Syne font)
- Center: Links — Features, Editor, How It Works, Pricing, Resume Builder
- Right: "Sign In" text link + "Get Started" primary button (filled blue)
- On scroll: Adds white background + `backdrop-blur` + subtle bottom shadow
- Mobile: Hamburger menu with animated open/close

**1.2 — Hero Section**
- Background: WebGL particle field (Three.js) with floating geometric shapes + radial gradient overlay
- Animated badge pill: "YOUR JOB SEARCH COMPANION" with green pulse dot
- Giant display headline (Syne 800): "Land Your Next" (dark, #0f172a) + "Role, Faster" (gradient blue→teal)
- Subtitle (Outfit 400, slate-600): "Build ATS-optimized resumes, track your applications, and prepare for interviews — all in one place. **Free, private, runs in your browser.**"
- Two CTAs side by side:
  - "Get Started Free →" — filled blue button with arrow icon
  - "See How It Works" — outlined secondary button
- Tech stack pills row: Pyodide (Python), PGlite (PostgreSQL), Monaco Editor, WebAssembly, Next.js, Firebase — monospace font, bordered pills
- Scroll indicator at bottom (bouncing chevron)

**1.3 — Stats Bar** (below fold)
- 4 animated counters in a horizontal row, scroll-triggered count-up:
  - "2" Resume Formats / "PDF & DOCX export"
  - "$0" Monthly Cost / "100% free, forever"
  - "100%" ATS Score Check / "Instant feedback"
  - "50+" Practice Problems / "Resume to interview"
- Stagger the counter animations (50ms between each)

**1.4 — Features Grid**
- Section label badge: "Features"
- Heading (Syne): "Everything You Need to Get Hired"
- Subtitle: "From ATS-optimized resumes to in-browser interview practice — a complete job search workflow that runs entirely in your browser."
- 6 cards in 3×2 responsive grid (1 col mobile → 2 tablet → 3 desktop):
  1. **ATS Resume Scanner** — scan icon, blue accent bg
  2. **Gap Analysis** — search icon, green accent bg
  3. **AI Resume Tailoring** — sparkle icon, purple accent bg
  4. **Application Tracker** — kanban icon, orange accent bg + "Coming Soon" badge
  5. **In-Browser Code Practice** — code brackets icon, teal accent bg
  6. **AI-Powered Prep** — brain icon, pink accent bg
- Each card: Colored icon circle → bold title → description paragraph
- Hover: Subtle shadow + border highlight (200ms ease-out)
- Cards should stagger on scroll entry (50ms delay each)

**1.5 — Editor Preview**
- Section label badge: "Code Editor"
- Heading: "Practice Makes Perfect."
- Subtitle: description of in-browser execution
- Interactive-looking code editor mockup:
  - Top bar: File tab "two_sum.py" + language badge "Python" + green "Run" button
  - Code area: 12 lines of Python with line numbers (JetBrains Mono)
  - Output panel below: `$ python two_sum.py` → `[0, 1]` → "Executed in 0.003s via Pyodide (WebAssembly)"
- The editor mock should have `rounded-xl border shadow-lg` treatment

**1.6 — How It Works (4 steps)**
- Heading: "Four Steps to Your Next Role"
- Alternating layout (text left/visual right, then swap):
  - **01 Upload Your Resume** — Visual: file card with "resume_2024.pdf 245 KB" + skill pills (Python, React, SQL, AWS)
  - **02 Check Your ATS Score** — Visual: JD card "Senior Software Engineer" + "4 match · 3 gaps" badge
  - **03 Tailor & Apply** — Visual: "AI-Tailored Resume" card + Keyword match 92% + ATS score 88% + PDF/DOCX buttons
  - **04 Prepare & Practice** — Visual: Test results card "4/4 passed" with 4 green checkmarks
- Vertical gradient connecting line between steps (desktop only)
- Steps should stagger on scroll (80ms delay each)

**1.7 — Pricing**
- Heading: "Completely Free"
- Subtitle: "No credit card. No trial. No catch."
- Two cards side by side:
  - **Free Forever ($0/mo)** — 9 feature rows with blue checkmarks → "Get Started Free" primary CTA
  - **Pro (Coming Soon, $?/mo)** — 7 feature rows → disabled "Coming Soon" button (muted styling)

**1.8 — Footer**
- CTA band: "Ready to Land Your Next Role?" + description + "Start Free →" button
- 4-column link grid: Product, Resources, Community, Legal
- Bottom bar: PrepWise logo + "Built with Next.js, Three.js, and WebAssembly. Open source & free forever."

---

### SCREENSHOT 2: Dashboard (`02-dashboard.png`)

**The main workspace — a tabbed interface for resume analysis and gap identification.**

**2.1 — Header**
- Left: PrepWise logo (links home)
- Center: 3-tab pill switcher — "Resume & Skills" | "Job Description" | "Gap Analysis"
  - Active tab: white bg, shadow, border
  - Inactive: transparent, hover shows surface bg
  - Tab switching should animate at 150–200ms ease-out
- Right: "Study Plan" outlined badge link + "Resume Builder" outlined badge link

**2.2 — Tab: Resume & Skills (shown in screenshot)**
- **Heading** (Syne 700): "Upload Your Resume"
- **Subtitle** (slate-600): "Drop your PDF or DOCX file. Everything is parsed in your browser — no data leaves your machine."
- **Upload Dropzone**:
  - Dashed border container, rounded-xl
  - Centered: Upload icon (in light circle) → "Drop your resume here, or click to browse" → "PDF or DOCX — skills auto-extracted" (muted)
  - Hover: border turns blue, bg turns primary-light
  - Drag active: stronger blue border, scale(1.01) subtle
- **After upload state** (not shown): Checkmark replaces icon, file preview (first 800 chars), skill count badge, "Replace" button
- **Skills Section** (below thin divider):
  - Header row: "Your Skills" (bold) + "+ Add manually" button (right-aligned, primary text color)
  - Empty: "Upload your resume above to auto-extract skills, or add them manually." (muted text)
  - Populated: Grid of pill badges — each shows skill name + level indicator (beginner/intermediate/advanced) + × remove button
  - Skills should stagger in when extracted (40ms delay each)

**2.3 — Tab: Job Description** (not shown)
- Heading: "Paste Job Description"
- Large textarea with placeholder: "Paste the full job description here..."
- "Extract Skills" primary button
- Below: grid of extracted JD skill badges (required vs. nice-to-have, color-coded)

**2.4 — Tab: Gap Analysis** (not shown)
- **3 summary metric cards** in a row:
  - Matches (green bg) — count of overlapping skills
  - Gaps (red bg) — skills in JD missing from resume
  - Extra Skills (blue bg) — skills in resume not in JD
- **Detailed comparison table**: Skill name | Your Resume (✓/✗) | Job Requires (✓/✗)
- **Action buttons**: "Generate Study Plan" (AI, primary) + "Build Manually" link to /plan

---

### SCREENSHOT 3: Study Plan (`03-study-plan.png`)

**A topic-based study plan builder and progress tracker.**

**3.1 — Header**
- Left: PrepWise logo
- Right: "Dashboard" link + "Study Plan" active badge

**3.2 — Empty State (shown in screenshot)**
- Centered within a `bg-[#f8fafc] rounded-2xl` card, generous padding
- Plus icon in a light blue circle
- "No study plan yet" (bold, dark)
- "Create a plan to organize your interview preparation" (muted)
- "Create Study Plan" outlined primary button
- This empty state should fade in with `opacity 0→1` + `translateY(8px→0)` at 300ms ease-out

**3.3 — Populated State (not shown, needs design)**
- **Progress bar**: Horizontal fill bar showing completion % — "X of Y topics completed"
- **Topic list**: Vertical stack of TopicCard components:
  - Topic title (bold, left-aligned)
  - **Type badge** (color-coded): coding=blue, sql=teal, conceptual=purple, system-design=orange, behavioral=pink
  - **Difficulty badge**: easy=green, medium=amber, hard=red
  - **Status dropdown**: not started (gray) / in progress (blue) / completed (green)
  - Reorder arrows (up/down) + remove button (right side)
  - Click navigates to /learn/[topicId]
  - Cards should have `:active scale(0.98)` and hover border highlight
- **Add Topic**: "Add Topic" button at bottom → reveals inline form (title, type selector, difficulty selector)
- **Template dropdown**: "Use Template" with pre-built plans (Frontend, Backend, Data Structures)
- Topic cards should stagger on initial load (50ms delay)

---

### SCREENSHOT 4: Resume Builder — ATS Score Check (`04-resume-builder-ats.png`)

**ATS compatibility scoring tool — the primary entry point to resume builder.**

**4.1 — Header**
- Left: PrepWise logo
- Center: 3-tab pill switcher — "ATS Score Check" (active) | "Generate Resume" | "My Resumes"
- Right: "Dashboard" link

**4.2 — Two-column layout** (stacks on mobile)
- **Left column — Input Panel**:
  - **Resume section**:
    - Label: "RESUME" (uppercase, letter-spaced, muted)
    - Dropzone: Dashed border, upload icon, "Drop your resume here, or click to browse", "PDF or DOCX"
  - **Job Description section**:
    - Label: "JOB DESCRIPTION" (uppercase, letter-spaced, muted)
    - Large textarea: "Paste the job description here..."
  - **CTA**: "✦ Check ATS Score" full-width button — disabled (muted) until both fields have content, then primary blue
  - Button should have `:active scale(0.97)` and 160ms ease-out transition

- **Right column — Results Panel**:
  - **Empty state**: "Upload your resume and paste a job description to see your ATS score." (centered, muted)
  - **With score** (not shown, needs design):
    - Large circular score gauge (0–100) — color: red (<50), amber (50–75), green (>75)
    - Score should animate in with a count-up + circular fill animation (500ms ease-out)
    - **Breakdown sections** (staggered entry, 50ms each):
      - Keyword Match — score bar + percentage
      - Formatting — score bar + percentage
      - Section Structure — score bar + percentage
      - Action Verbs — score bar + percentage
      - Quantifiable Results — score bar + percentage
    - **Missing keywords**: List of red-highlighted skill pills
    - **Recommendations**: Numbered list of actionable improvements

---

### SCREENSHOT 5: Resume Builder — My Resumes (`06-resume-builder-library.png`)

**Saved resume library — where tailored resumes live.**

**5.1 — Header** (same as Screenshot 4)

**5.2 — Empty State (shown in screenshot)**
- Heading (Syne 700): "My Resumes"
- Subtitle: "All your tailored resumes, organized by role."
- Within a `bg-[#f8fafc] rounded-2xl` card: "No resumes yet. Generate a tailored resume from the Generate tab to see it here."
- This needs more personality — consider adding an illustration or icon

**5.3 — Populated State (not shown, needs design)**
- Grid of ResumeCard components (2 columns desktop, 1 mobile):
  - Role title (bold) + Company name (secondary text)
  - ATS score badge (color-coded: red/amber/green)
  - Created date (muted)
  - Action row: Edit (icon button) | Export PDF | Export DOCX | Delete (red, with hold-to-delete pattern)
- Cards should have hover shadow + border highlight
- `:active scale(0.98)` on card click
- Delete should use hold-to-confirm pattern: `clip-path inset` overlay fills over 2s on press, snaps back 200ms on release

---

## Pages NOT Shown (exist in codebase, need design alignment)

### Learn Topic Page (`/learn/[topicId]`)
- Topic header: title + type badge + difficulty badge + status toggle
- **Theory Panel**: Rendered markdown content (Outfit body text)
- **Code Examples**: Syntax-highlighted blocks with language tabs (JetBrains Mono)
- **AI Chat** (collapsible sidebar):
  - Collapsed: "Ask AI about [Topic]" button
  - Expanded: Chat bubbles (user = right-aligned blue-light bg, assistant = left-aligned white bg)
  - Message entry animation: slide-up + fade-in (200ms ease-out)
  - Loading: animated dots
- **Practice Assignments**: List of linked assignment cards with completion indicators

### Practice Editor Page (`/practice/[questionId]`)
- **Split-panel layout** (desktop): Left = problem description, Right = Monaco code editor
- **Language selector** dropdown (Python, JavaScript, SQL, Java)
- **Run button** (green) + **Submit button** (blue) — both need `:active scale(0.97)`
- **Output panel**: stdout/stderr display
- **Test Results**: Pass ✓ (green) / Fail ✗ (red) per test case with expected vs actual
- **AI Feedback**: Appears below test results after submission

### Resume Generator Tab (`/resume-builder` → Generate Resume tab)
- Resume upload + JD textarea + Company name + Role title inputs
- Two mode buttons: "Sections" (structured) vs "Full" (narrative)
- Generated resume: Section-by-section with inline edit capability
- Export buttons per section + full document (PDF / DOCX)
- "Save to Library" button

### Application Tracker (NEW — needs full design)
- **Kanban board** with columns: Wishlist → Applied → Interviewing → Offered → Rejected
- Each card: Company + Role + Date applied + ATS score + status
- Drag-and-drop between columns (use spring animations for drag momentum)
- Add new application form (company, role, JD link, notes)
- This is the biggest missing piece — needs full design from scratch

---

## Key User Flows

1. **Resume → Score → Tailor → Apply**: Upload resume → paste JD → see ATS score → generate tailored resume → export PDF/DOCX → track in Application Tracker
2. **Gap → Study → Practice**: Upload resume + JD → see skill gaps → auto-generate study plan → learn topics → practice coding problems → submit solutions
3. **Direct Resume Building**: /resume-builder → upload existing resume → paste target JD → generate tailored version → export and save to library

---

## What I Need From This Project

### Priority 1: Visual Consistency & Polish
- Make all pages feel like they belong to the same product
- Apply the animation rules above: custom easing curves, stagger lists, `:active` scale on all pressable elements, origin-aware popovers
- Every transition under 300ms, every ease should be `ease-out` or custom curve — never `ease-in`

### Priority 2: Empty States
- Dashboard, Study Plan, and Resume Library empty states need more personality
- Consider illustrations, subtle animations, or visual hints at what the populated state looks like

### Priority 3: Information Density
- Dashboard and Resume Builder feel sparse — better use of whitespace
- Consider sidebar layouts, progressive disclosure, or inline previews

### Priority 4: Application Tracker (New Feature)
- Full Kanban board design from scratch
- Columns: Wishlist, Applied, Interviewing, Offered, Rejected
- Drag-and-drop cards with spring-based momentum on gesture
- Card design: company, role, date, ATS score badge, quick actions

### Priority 5: Mobile Responsiveness
- All layouts must degrade gracefully
- Tabs should horizontally scroll on mobile
- Two-column layouts stack to single column
- Touch targets minimum 44×44px
- Hover animations gated behind `@media (hover: hover) and (pointer: fine)`
