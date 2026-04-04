# Resume Builder — Design Spec

## Overview

A new top-level route (`/resume-builder`) in PrepWise that provides three features: ATS score checking, AI-powered resume tailoring for specific job descriptions, and a resume library organized by role. This is a standalone page independent from the existing dashboard/gap-analysis flow, serving the "apply first, prep later" use case.

## Architecture

### Page Structure

Single page at `/resume-builder` with three tabs (matching the dashboard's tab-bar pattern):

1. **ATS Score Check** — Upload resume + paste JD, get a score breakdown
2. **Generate Resume** — Tailor a resume for a specific JD, with section editor or full document mode
3. **My Resumes** — Library of all generated resumes, organized by role/company

### State Management

New Zustand store: `useResumeBuilderStore`. Holds:

- `resumes: TailoredResume[]` — all generated resumes
- `currentScore: ATSScore | null` — latest ATS check result
- `generating: boolean` — loading state for resume generation
- `activeTab: "ats" | "generate" | "library"` — current tab

Persistence follows the existing pattern: localStorage as default, Firebase sync when configured. Uses the same `getOrCreateSession()` and Firestore collection pattern as `useProfileStore`.

### Data Types

```typescript
interface ATSScore {
  overall: number;           // 0-100
  keywordMatch: number;      // 0-100
  formatting: number;        // 0-100
  sectionStructure: number;  // 0-100
  actionVerbs: number;       // 0-100
  missingKeywords: string[];
  formattingIssues: string[];
}

interface ResumeSection {
  id: string;
  type: "summary" | "skills" | "experience" | "education" | "projects";
  title: string;
  content: string;         // markdown or plain text
}

interface TailoredResume {
  id: string;
  roleTitle: string;        // e.g. "Senior Frontend Engineer"
  company: string;          // e.g. "Google"
  jdText: string;           // the JD it was tailored for
  sections: ResumeSection[];
  fullDocument: string;     // complete resume as single text
  atsScore: number | null;  // score at time of generation
  createdAt: Date;
  updatedAt: Date;
}
```

## Feature Details

### Tab 1: ATS Score Check

**Inputs:**
- Resume upload (reuse existing `react-dropzone` pattern from `ResumeUpload.tsx`, accept PDF/DOCX)
- Job description text area (reuse pattern from `JDInput.tsx`)

**Processing (hybrid approach):**

Local baseline (no API key needed):
- **Keyword match**: Extract keywords from JD, check which appear in resume text. Score = matched/total keywords as percentage.
- **Formatting checks**: Detect ATS-unfriendly patterns in the parsed text — tables (inconsistent whitespace columns), missing standard sections (Summary, Experience, Education, Skills), excessively long lines.
- **Section structure**: Check for presence and ordering of standard resume sections.
- **Action verbs**: Check experience bullet points for strong action verbs vs. passive/weak phrasing. Compare against a local list of ~50 common action verbs.

AI enhancement (when Gemini configured):
- Send resume text + JD to Gemini for nuanced keyword matching (semantic similarity, not just exact match).
- AI provides richer formatting feedback (e.g., "your experience bullets lack quantified impact").
- AI adjusts scores with contextual understanding.

**Output:**
- Overall score (0-100, weighted: keyword match 40%, formatting 20%, sections 20%, action verbs 20%)
- Four sub-score cards: Keyword Match, Formatting, Sections, Action Verbs
- Missing keywords list (tags)
- Formatting issues list (with icons)

### Tab 2: Generate Resume

**Inputs:**
- Resume text (either uploaded in ATS tab, or from the profile store if already uploaded on dashboard, or fresh upload)
- Job description text
- Mode selection: Section Editor or Full Document

**Generation:**

AI required for this feature (Gemini). The generation uses the resume text and JD to:
1. Rewrite the professional summary to align with the role
2. Reorder and rephrase skills to prioritize JD-required skills
3. Rewrite experience bullet points with JD-relevant keywords and quantified achievements
4. Highlight relevant education/coursework

If AI is not configured, show a message explaining that an API key is needed for resume generation, with a link to the setup instructions.

**Section Editor mode:**
- Displays each section (Summary, Skills, Experience, Education) as an editable panel
- Each section has a "Regenerate" button to re-generate just that section
- Skills section shows matched keywords (green) and added JD keywords (yellow)
- User can edit content inline before downloading

**Full Document mode:**
- Shows the complete resume as a single editable text block
- One "Regenerate" button for the whole document

**Download:**
- PDF generation: Use a client-side library (e.g., `jspdf` or `@react-pdf/renderer`) to render the resume with clean, ATS-friendly formatting
- DOCX generation: Use `docx` npm package to create a properly structured Word document
- Both formats use a clean, single-column, ATS-friendly template (no tables, no columns, standard fonts)

**Save:**
- "Save to Library" persists the resume to the store (localStorage + Firebase)

### Tab 3: My Resumes

**Display:**
- Cards grouped by role, showing: role title, company, generation date, ATS score badge
- Score badge color-coded: green (80+), yellow (60-79), red (<60)

**Actions per resume:**
- Download PDF
- Download DOCX
- Edit (switches to Generate tab with that resume loaded)
- Delete (with confirmation)

## Navigation

- Add "Resume Builder" link to the dashboard header nav (alongside Study Plan)
- Add "Dashboard" link to the resume builder header nav
- The landing page navbar should include a link to Resume Builder

## Shared State with Dashboard

The resume builder can optionally pull resume text and JD text from `useProfileStore` if the user has already uploaded them on the dashboard. This avoids re-uploading. The resume builder page checks the profile store on mount and pre-fills inputs if data exists.

## New Dependencies

- `jspdf` — PDF generation (client-side, ~300KB)
- `docx` — DOCX generation (client-side, ~200KB)

No server-side dependencies needed. Everything runs in the browser.

## File Structure

```
src/
  app/
    resume-builder/
      page.tsx              # Main page with tab management
  components/
    resume-builder/
      ATSChecker.tsx        # Tab 1: ATS score checking UI
      ResumeGenerator.tsx   # Tab 2: Generation + editor UI
      SectionEditor.tsx     # Editable section panel component
      ResumeLibrary.tsx     # Tab 3: Saved resumes list
      ResumeCard.tsx        # Individual resume card in library
      ScoreDisplay.tsx      # ATS score ring + breakdown
  lib/
    atsScorer.ts            # Local ATS scoring algorithms
    resumeGenerator.ts      # AI prompts for resume generation
    resumeExporter.ts       # PDF and DOCX generation
  stores/
    useResumeBuilderStore.ts  # Zustand store
```

## Error Handling

- Resume parsing failure: Show inline error below dropzone (same pattern as existing `ResumeUpload`)
- AI generation failure: Show error state with retry button, suggest checking API key
- Download failure: Show toast/inline error
- No AI configured (Generate tab): Show informational card explaining API key setup, with the ATS checker still fully functional locally

## Design Reference

Mockup: `.superpowers/brainstorm/32035-1774786899/content/page-layout-v2.html`

All UI follows PrepWise's existing design system:
- Glass morphism header
- Emerald-glow accent color (#00ff88)
- Surface/surface-elevated backgrounds
- Border-subtle dividers
- Pill-style tab bar
- Card-based layouts with hover border glow
- Skill tags with color coding (green=match, yellow=added, red=missing)
