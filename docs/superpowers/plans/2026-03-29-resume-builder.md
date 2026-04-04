# Resume Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/resume-builder` page with ATS score checking, AI-powered resume tailoring, and a resume library organized by role.

**Architecture:** Single-page tabbed layout (matching dashboard pattern) with a new Zustand store for resume state, local ATS scoring algorithms with optional AI enhancement, and client-side PDF/DOCX export using `jspdf` and `docx` packages.

**Tech Stack:** Next.js 16, React 19, Zustand, Tailwind CSS 4, Gemini API (optional), jspdf, docx

---

## File Structure

```
src/
  lib/
    resumeTypes.ts            # Type definitions for resume builder
    atsScorer.ts              # Local ATS scoring algorithms
    resumeGenerator.ts        # AI prompts for resume tailoring
    resumeExporter.ts         # PDF and DOCX generation
  stores/
    useResumeBuilderStore.ts  # Zustand store with persistence
  components/
    resume-builder/
      ScoreDisplay.tsx        # ATS score ring + breakdown cards
      ATSChecker.tsx          # Tab 1: resume upload + JD + scoring
      SectionEditor.tsx       # Editable section panel with regenerate
      ResumeGenerator.tsx     # Tab 2: mode toggle + editor/full doc
      ResumeCard.tsx          # Single resume card in library
      ResumeLibrary.tsx       # Tab 3: saved resumes list
  app/
    resume-builder/
      page.tsx                # Main page with header + tabs
```

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install jspdf and docx**

```bash
cd /Users/saishashankanchuri/Documents/Awfis/PrepWise && npm install jspdf docx
```

- [ ] **Step 2: Verify installation**

```bash
cd /Users/saishashankanchuri/Documents/Awfis/PrepWise && node -e "require('jspdf'); require('docx'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
cd /Users/saishashankanchuri/Documents/Awfis/PrepWise && git add package.json package-lock.json && git commit -m "chore: add jspdf and docx dependencies for resume builder"
```

---

### Task 2: Type Definitions

**Files:**
- Create: `src/lib/resumeTypes.ts`

- [ ] **Step 1: Create the type definitions file**

```typescript
// src/lib/resumeTypes.ts

export interface ATSScore {
  overall: number;
  keywordMatch: number;
  formatting: number;
  sectionStructure: number;
  actionVerbs: number;
  missingKeywords: string[];
  formattingIssues: string[];
}

export interface ResumeSection {
  id: string;
  type: "summary" | "skills" | "experience" | "education" | "projects";
  title: string;
  content: string;
}

export interface TailoredResume {
  id: string;
  roleTitle: string;
  company: string;
  jdText: string;
  sections: ResumeSection[];
  fullDocument: string;
  atsScore: number | null;
  createdAt: string;   // ISO string (serializable for localStorage/Firestore)
  updatedAt: string;
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/saishashankanchuri/Documents/Awfis/PrepWise && git add src/lib/resumeTypes.ts && git commit -m "feat: add type definitions for resume builder"
```

---

### Task 3: ATS Scoring Engine

**Files:**
- Create: `src/lib/atsScorer.ts`

- [ ] **Step 1: Create the local ATS scoring module**

```typescript
// src/lib/atsScorer.ts

import type { ATSScore } from "./resumeTypes";
import { extractSkillsFromText } from "./skillExtractor";
import { isAIConfigured, getAI } from "./ai";

// Standard resume sections that ATS systems look for
const STANDARD_SECTIONS = [
  { name: "summary", patterns: [/\b(summary|objective|profile|about)\b/i] },
  { name: "experience", patterns: [/\b(experience|employment|work history)\b/i] },
  { name: "education", patterns: [/\b(education|academic|degree|university)\b/i] },
  { name: "skills", patterns: [/\b(skills|technical skills|competencies)\b/i] },
];

// Strong action verbs for experience bullets
const ACTION_VERBS = [
  "achieved", "built", "created", "delivered", "designed", "developed",
  "drove", "enabled", "engineered", "established", "executed", "improved",
  "implemented", "increased", "launched", "led", "managed", "migrated",
  "optimized", "orchestrated", "reduced", "refactored", "resolved",
  "scaled", "shipped", "spearheaded", "streamlined", "transformed",
  "architected", "automated", "collaborated", "configured", "consolidated",
  "deployed", "diagnosed", "enhanced", "expanded", "facilitated",
  "formulated", "generated", "integrated", "maintained", "mentored",
  "modernized", "negotiated", "oversaw", "pioneered", "prioritized",
];

function scoreKeywordMatch(resumeText: string, jdText: string): { score: number; missing: string[] } {
  const jdKeywords = extractSkillsFromText(jdText);
  if (jdKeywords.length === 0) return { score: 100, missing: [] };

  const resumeLower = resumeText.toLowerCase();
  const missing: string[] = [];
  let matched = 0;

  for (const keyword of jdKeywords) {
    if (resumeLower.includes(keyword.toLowerCase())) {
      matched++;
    } else {
      missing.push(keyword);
    }
  }

  return {
    score: Math.round((matched / jdKeywords.length) * 100),
    missing,
  };
}

function scoreFormatting(resumeText: string): { score: number; issues: string[] } {
  const issues: string[] = [];
  let deductions = 0;

  // Check for table-like patterns (multiple consecutive whitespace blocks)
  const lines = resumeText.split("\n");
  const tableLines = lines.filter((l) => /\s{4,}\S+\s{4,}\S+/.test(l));
  if (tableLines.length > 3) {
    issues.push("Tables detected — most ATS systems can't parse them");
    deductions += 25;
  }

  // Check for excessively long lines (>150 chars without breaks)
  const longLines = lines.filter((l) => l.trim().length > 150);
  if (longLines.length > 5) {
    issues.push("Very long lines — may cause parsing issues");
    deductions += 10;
  }

  // Check for special characters that may confuse ATS
  if (/[│┃┤├┼─━┏┓┗┛]/.test(resumeText)) {
    issues.push("Special box-drawing characters detected — use plain text");
    deductions += 15;
  }

  // Check total length (too short or too long)
  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount < 100) {
    issues.push("Resume appears too short — aim for 300-600 words");
    deductions += 20;
  } else if (wordCount > 1200) {
    issues.push("Resume may be too long — consider trimming to 1-2 pages");
    deductions += 10;
  }

  return { score: Math.max(0, 100 - deductions), issues };
}

function scoreSectionStructure(resumeText: string): number {
  const textLower = resumeText.toLowerCase();
  let found = 0;

  for (const section of STANDARD_SECTIONS) {
    if (section.patterns.some((p) => p.test(textLower))) {
      found++;
    }
  }

  return Math.round((found / STANDARD_SECTIONS.length) * 100);
}

function scoreActionVerbs(resumeText: string): number {
  const textLower = resumeText.toLowerCase();
  const lines = textLower.split("\n").filter((l) => l.trim().length > 10);

  // Look at lines that look like bullet points (experience items)
  const bulletLines = lines.filter(
    (l) => /^\s*[-•*▸▹]/.test(l) || /^\s*\d+[.)]\s/.test(l) || /^\s{2,}[A-Z]/.test(l.charAt(0) === l.charAt(0).toUpperCase() ? l : ""),
  );

  // If no clear bullets, check all lines
  const linesToCheck = bulletLines.length > 3 ? bulletLines : lines;
  if (linesToCheck.length === 0) return 50;

  let verbCount = 0;
  for (const line of linesToCheck) {
    const firstWords = line.trim().split(/\s+/).slice(0, 3).join(" ");
    if (ACTION_VERBS.some((v) => firstWords.includes(v))) {
      verbCount++;
    }
  }

  return Math.min(100, Math.round((verbCount / Math.max(linesToCheck.length * 0.5, 1)) * 100));
}

export async function calculateATSScore(resumeText: string, jdText: string): Promise<ATSScore> {
  // Local scoring
  const { score: keywordScore, missing } = scoreKeywordMatch(resumeText, jdText);
  const { score: formatScore, issues } = scoreFormatting(resumeText);
  const sectionScore = scoreSectionStructure(resumeText);
  const verbScore = scoreActionVerbs(resumeText);

  let result: ATSScore = {
    keywordMatch: keywordScore,
    formatting: formatScore,
    sectionStructure: sectionScore,
    actionVerbs: verbScore,
    overall: Math.round(keywordScore * 0.4 + formatScore * 0.2 + sectionScore * 0.2 + verbScore * 0.2),
    missingKeywords: missing,
    formattingIssues: issues,
  };

  // AI enhancement if configured
  if (isAIConfigured()) {
    try {
      const ai = getAI();
      const prompt = `Analyze this resume against the job description. Return ONLY a JSON object with:
{
  "keywordMatchAdjustment": <number -20 to +20, adjust for semantic matches the keyword check missed>,
  "formattingIssues": [<array of string issues not caught by basic checks>],
  "actionVerbAdjustment": <number -20 to +20, adjust based on quality of achievement descriptions>
}

Resume (first 2000 chars):
${resumeText.slice(0, 2000)}

Job Description (first 1500 chars):
${jdText.slice(0, 1500)}`;

      const response = await ai.generate(prompt, "You are an ATS expert. Return only valid JSON, no markdown fences.");
      const cleaned = response.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      const adjustments = JSON.parse(cleaned);

      result.keywordMatch = Math.max(0, Math.min(100, result.keywordMatch + (adjustments.keywordMatchAdjustment || 0)));
      result.actionVerbs = Math.max(0, Math.min(100, result.actionVerbs + (adjustments.actionVerbAdjustment || 0)));

      if (Array.isArray(adjustments.formattingIssues)) {
        result.formattingIssues = [...result.formattingIssues, ...adjustments.formattingIssues];
      }

      // Recalculate overall
      result.overall = Math.round(
        result.keywordMatch * 0.4 + result.formatting * 0.2 + result.sectionStructure * 0.2 + result.actionVerbs * 0.2,
      );
    } catch {
      // AI failed — local scores are fine
    }
  }

  return result;
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/saishashankanchuri/Documents/Awfis/PrepWise && git add src/lib/atsScorer.ts && git commit -m "feat: add local ATS scoring engine with AI enhancement"
```

---

### Task 4: Resume Generation AI Prompts

**Files:**
- Create: `src/lib/resumeGenerator.ts`

- [ ] **Step 1: Create the AI resume generation module**

```typescript
// src/lib/resumeGenerator.ts

import type { ResumeSection } from "./resumeTypes";
import { getAI } from "./ai";

export async function generateTailoredSections(
  resumeText: string,
  jdText: string,
): Promise<ResumeSection[]> {
  const ai = getAI();

  const prompt = `You are a professional resume writer. Given the original resume and a target job description, create a tailored resume broken into sections.

Return ONLY a JSON array of sections:
[
  {"id": "summary", "type": "summary", "title": "Professional Summary", "content": "..."},
  {"id": "skills", "type": "skills", "title": "Technical Skills", "content": "Skill1, Skill2, ..."},
  {"id": "experience", "type": "experience", "title": "Professional Experience", "content": "**Company — Role** (dates)\\n- Achievement 1\\n- Achievement 2\\n..."},
  {"id": "education", "type": "education", "title": "Education", "content": "..."}
]

Rules:
- Rewrite the summary to align with the target role
- Prioritize skills mentioned in the JD
- Rewrite experience bullets with JD-relevant keywords and quantified achievements
- Keep all factual information from the original resume — do NOT fabricate experience
- Use strong action verbs to start each bullet point
- Include metrics where the original resume implies them

Original Resume:
${resumeText.slice(0, 3000)}

Target Job Description:
${jdText.slice(0, 2000)}`;

  const response = await ai.generate(
    prompt,
    "You are an expert resume writer and ATS optimization specialist. Return only valid JSON arrays, no markdown fences.",
  );

  const cleaned = response.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function generateFullDocument(
  resumeText: string,
  jdText: string,
): Promise<string> {
  const ai = getAI();

  const prompt = `You are a professional resume writer. Rewrite this resume to be optimized for the target job description.

Rules:
- Keep all factual information — do NOT fabricate
- Align the summary/objective with the target role
- Prioritize JD-relevant skills
- Use strong action verbs and quantified achievements
- Format cleanly: section headers in ALL CAPS, bullet points with dashes
- Keep it concise — 1-2 pages worth of content

Original Resume:
${resumeText.slice(0, 3000)}

Target Job Description:
${jdText.slice(0, 2000)}

Return the complete resume as plain text, ready to be placed in a document.`;

  return ai.generate(
    prompt,
    "You are an expert resume writer. Return only the resume text, no commentary.",
  );
}

export async function regenerateSection(
  section: ResumeSection,
  resumeText: string,
  jdText: string,
): Promise<string> {
  const ai = getAI();

  const prompt = `Rewrite this "${section.title}" section of a resume to better match the target job description.

Current content:
${section.content}

Full resume context (first 1500 chars):
${resumeText.slice(0, 1500)}

Target Job Description (first 1000 chars):
${jdText.slice(0, 1000)}

Return ONLY the rewritten section content as plain text. No JSON, no markdown fences, no commentary.`;

  return ai.generate(
    prompt,
    "You are an expert resume writer. Return only the section content.",
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/saishashankanchuri/Documents/Awfis/PrepWise && git add src/lib/resumeGenerator.ts && git commit -m "feat: add AI resume generation prompts"
```

---

### Task 5: PDF and DOCX Export

**Files:**
- Create: `src/lib/resumeExporter.ts`

- [ ] **Step 1: Create the export module**

```typescript
// src/lib/resumeExporter.ts

import type { ResumeSection } from "./resumeTypes";

export async function exportToPDF(sections: ResumeSection[], fileName: string): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });

  const margin = 50;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  function addPage() {
    doc.addPage();
    y = margin;
  }

  function checkPageBreak(needed: number) {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      addPage();
    }
  }

  for (const section of sections) {
    checkPageBreak(40);

    // Section title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text(section.title.toUpperCase(), margin, y);
    y += 6;

    // Underline
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + contentWidth, y);
    y += 14;

    // Section content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    const lines = doc.splitTextToSize(section.content, contentWidth);
    for (const line of lines) {
      checkPageBreak(14);
      doc.text(line, margin, y);
      y += 14;
    }

    y += 12;
  }

  doc.save(`${fileName}.pdf`);
}

export async function exportToDOCX(sections: ResumeSection[], fileName: string): Promise<void> {
  const docx = await import("docx");

  const children: docx.Paragraph[] = [];

  for (const section of sections) {
    // Section heading
    children.push(
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: section.title.toUpperCase(),
            bold: true,
            size: 24, // 12pt
            font: "Calibri",
          }),
        ],
        spacing: { before: 240, after: 80 },
        border: {
          bottom: { style: docx.BorderStyle.SINGLE, size: 1, color: "BBBBBB" },
        },
      }),
    );

    // Section content — split by newlines, handle bullet points
    const contentLines = section.content.split("\n");
    for (const line of contentLines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const isBullet = /^[-•*]\s/.test(trimmed);
      const cleanText = isBullet ? trimmed.replace(/^[-•*]\s*/, "") : trimmed;
      const isBoldLine = /^\*\*/.test(trimmed);
      const displayText = cleanText.replace(/\*\*/g, "");

      children.push(
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: displayText,
              bold: isBoldLine,
              size: 20, // 10pt
              font: "Calibri",
            }),
          ],
          bullet: isBullet ? { level: 0 } : undefined,
          spacing: { after: 40 },
        }),
      );
    }
  }

  const document = new docx.Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children,
      },
    ],
  });

  const blob = await docx.Packer.toBlob(document);
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement ? document.createElement("a") : globalThis.document.createElement("a"), {
    href: url,
    download: `${fileName}.docx`,
  });

  // Use the DOM to create a download link
  const link = globalThis.document.createElement("a");
  link.href = url;
  link.download = `${fileName}.docx`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportFullDocumentToPDF(text: string, fileName: string): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });

  const margin = 50;
  const contentWidth = doc.internal.pageSize.getWidth() - margin * 2;
  let y = margin;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);

  const lines = doc.splitTextToSize(text, contentWidth);
  for (const line of lines) {
    if (y + 14 > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += 14;
  }

  doc.save(`${fileName}.pdf`);
}

export async function exportFullDocumentToDOCX(text: string, fileName: string): Promise<void> {
  const docx = await import("docx");

  const paragraphs = text.split("\n").map(
    (line) =>
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: line,
            size: 20,
            font: "Calibri",
          }),
        ],
        spacing: { after: 40 },
      }),
  );

  const document = new docx.Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await docx.Packer.toBlob(document);
  const link = globalThis.document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.docx`;
  link.click();
  URL.revokeObjectURL(link.href);
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/saishashankanchuri/Documents/Awfis/PrepWise && git add src/lib/resumeExporter.ts && git commit -m "feat: add PDF and DOCX export for resumes"
```

---

### Task 6: Zustand Store with Persistence

**Files:**
- Create: `src/stores/useResumeBuilderStore.ts`
- Modify: `src/lib/firebase.ts` (add resume save/load functions)

- [ ] **Step 1: Add Firebase functions for resumes**

Add to the end of `src/lib/firebase.ts`:

```typescript
// --- Resumes ---

export async function saveResumes(
  sessionId: string,
  resumes: {
    id: string;
    roleTitle: string;
    company: string;
    jdText: string;
    sections: { id: string; type: string; title: string; content: string }[];
    fullDocument: string;
    atsScore: number | null;
    createdAt: string;
    updatedAt: string;
  }[],
) {
  if (!isFirebaseConfigured()) return;
  await setDoc(doc(db, "sessions", sessionId, "resumes", "all"), {
    resumes,
    updatedAt: serverTimestamp(),
  });
}

export async function getResumes(sessionId: string) {
  if (!isFirebaseConfigured()) return null;
  const snap = await getDoc(doc(db, "sessions", sessionId, "resumes", "all"));
  return snap.exists() ? snap.data().resumes : null;
}
```

- [ ] **Step 2: Create the Zustand store**

```typescript
// src/stores/useResumeBuilderStore.ts

import { create } from "zustand";
import type { TailoredResume, ATSScore } from "@/lib/resumeTypes";
import {
  getOrCreateSession,
  saveResumes,
  getResumes,
  isFirebaseConfigured,
} from "@/lib/firebase";

const STORAGE_KEY = "prepwise_resumes";

interface ResumeBuilderState {
  resumes: TailoredResume[];
  currentScore: ATSScore | null;
  generating: boolean;
  activeTab: "ats" | "generate" | "library";
  editingResume: TailoredResume | null;
  loaded: boolean;

  setActiveTab: (tab: "ats" | "generate" | "library") => void;
  setCurrentScore: (score: ATSScore | null) => void;
  setGenerating: (generating: boolean) => void;
  setEditingResume: (resume: TailoredResume | null) => void;
  addResume: (resume: TailoredResume) => void;
  updateResume: (id: string, updates: Partial<TailoredResume>) => void;
  deleteResume: (id: string) => void;
  persist: () => Promise<void>;
  load: () => Promise<void>;
}

function saveToLocalStorage(resumes: TailoredResume[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
  } catch {
    // localStorage full or unavailable
  }
}

function loadFromLocalStorage(): TailoredResume[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const useResumeBuilderStore = create<ResumeBuilderState>((set, get) => ({
  resumes: [],
  currentScore: null,
  generating: false,
  activeTab: "ats",
  editingResume: null,
  loaded: false,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setCurrentScore: (score) => set({ currentScore: score }),
  setGenerating: (generating) => set({ generating }),
  setEditingResume: (resume) => set({ editingResume: resume }),

  addResume: (resume) =>
    set((state) => ({ resumes: [resume, ...state.resumes] })),

  updateResume: (id, updates) =>
    set((state) => ({
      resumes: state.resumes.map((r) =>
        r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r,
      ),
    })),

  deleteResume: (id) =>
    set((state) => ({
      resumes: state.resumes.filter((r) => r.id !== id),
    })),

  persist: async () => {
    const { resumes } = get();
    saveToLocalStorage(resumes);

    if (isFirebaseConfigured()) {
      const sessionId = getOrCreateSession();
      if (sessionId) {
        await saveResumes(sessionId, resumes);
      }
    }
  },

  load: async () => {
    if (isFirebaseConfigured()) {
      const sessionId = getOrCreateSession();
      if (sessionId) {
        const data = await getResumes(sessionId);
        if (data) {
          set({ resumes: data, loaded: true });
          return;
        }
      }
    }

    const local = loadFromLocalStorage();
    set({ resumes: local || [], loaded: true });
  },
}));
```

- [ ] **Step 3: Commit**

```bash
cd /Users/saishashankanchuri/Documents/Awfis/PrepWise && git add src/stores/useResumeBuilderStore.ts src/lib/firebase.ts && git commit -m "feat: add resume builder Zustand store with localStorage + Firebase persistence"
```

---

### Task 7: ScoreDisplay Component

**Files:**
- Create: `src/components/resume-builder/ScoreDisplay.tsx`

- [ ] **Step 1: Create the score display component**

```tsx
// src/components/resume-builder/ScoreDisplay.tsx
"use client";

import type { ATSScore } from "@/lib/resumeTypes";

function scoreColor(score: number): string {
  if (score >= 80) return "emerald-glow";
  if (score >= 60) return "yellow-400";
  return "red-400";
}

function scoreBorderClass(score: number): string {
  if (score >= 80) return "border-emerald-glow/30";
  if (score >= 60) return "border-yellow-400/30";
  return "border-red-400/30";
}

export default function ScoreDisplay({ score }: { score: ATSScore }) {
  const ringColor = score.overall >= 80 ? "#00ff88" : score.overall >= 60 ? "#fbbf24" : "#f87171";

  return (
    <div className="space-y-4">
      {/* Score ring */}
      <div className="flex justify-center">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke={ringColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${score.overall * 2.64} 264`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-3xl font-bold"
              style={{ fontFamily: "var(--font-cabinet)", color: ringColor }}
            >
              {score.overall}
            </span>
            <span className="text-[10px] text-text-dim">out of 100</span>
          </div>
        </div>
      </div>

      {/* Sub-score cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Keyword Match", value: score.keywordMatch, color: "emerald" },
          { label: "Formatting", value: score.formatting, color: "yellow" },
          { label: "Sections", value: score.sectionStructure, color: "blue" },
          { label: "Action Verbs", value: score.actionVerbs, color: "red" },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-xl p-3 text-center ${
              item.value >= 70
                ? "bg-emerald-glow/[0.05] border border-emerald-glow/10"
                : item.value >= 50
                  ? "bg-yellow-400/[0.05] border border-yellow-400/10"
                  : "bg-red-400/[0.05] border border-red-400/10"
            }`}
          >
            <div
              className={`text-xl font-bold ${
                item.value >= 70 ? "text-emerald-glow" : item.value >= 50 ? "text-yellow-400" : "text-red-400"
              }`}
              style={{ fontFamily: "var(--font-cabinet)" }}
            >
              {item.value}%
            </div>
            <div className="text-xs text-text-muted mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Missing keywords */}
      {score.missingKeywords.length > 0 && (
        <div className="rounded-xl p-3 bg-emerald-glow/[0.03] border border-emerald-glow/10">
          <div className="text-xs font-semibold text-emerald-glow mb-2">Missing Keywords</div>
          <div className="flex flex-wrap gap-1.5">
            {score.missingKeywords.map((kw) => (
              <span key={kw} className="text-[11px] px-2.5 py-1 rounded-md bg-red-400/10 text-red-400">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Formatting issues */}
      {score.formattingIssues.length > 0 && (
        <div className="rounded-xl p-3 bg-blue-400/[0.03] border border-blue-400/10">
          <div className="text-xs font-semibold text-blue-400 mb-2">Formatting Issues</div>
          <div className="space-y-1.5">
            {score.formattingIssues.map((issue, i) => (
              <div key={i} className="flex items-start gap-2 text-[13px] text-text-muted">
                <svg className="w-3 h-3 mt-0.5 shrink-0 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                {issue}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/saishashankanchuri/Documents/Awfis/PrepWise && git add src/components/resume-builder/ScoreDisplay.tsx && git commit -m "feat: add ATS score display component with ring chart and breakdowns"
```

---

### Task 8: ATSChecker Component (Tab 1)

**Files:**
- Create: `src/components/resume-builder/ATSChecker.tsx`

- [ ] **Step 1: Create the ATS checker tab component**

```tsx
// src/components/resume-builder/ATSChecker.tsx
"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { parseResume } from "@/hooks/useResumeParser";
import { calculateATSScore } from "@/lib/atsScorer";
import { useResumeBuilderStore } from "@/stores/useResumeBuilderStore";
import { useProfileStore } from "@/stores/useProfileStore";
import ScoreDisplay from "./ScoreDisplay";

export default function ATSChecker() {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentScore, setCurrentScore } = useResumeBuilderStore();

  // Pre-fill from profile store if available
  const profileStore = useProfileStore();
  const prefillAvailable = !resumeText && profileStore.resumeText;

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setError(null);
    setParsing(true);
    try {
      const text = await parseResume(file);
      setResumeText(text);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to parse resume");
    } finally {
      setParsing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleCheck = async () => {
    if (!resumeText || !jdText) return;
    setChecking(true);
    setError(null);
    try {
      const score = await calculateATSScore(resumeText, jdText);
      setCurrentScore(score);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to calculate score");
    } finally {
      setChecking(false);
    }
  };

  const handlePrefill = () => {
    setResumeText(profileStore.resumeText);
    if (profileStore.jdText) setJdText(profileStore.jdText);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-cabinet)" }}>
          ATS Score Check
        </h1>
        <p className="text-sm text-text-muted">
          Upload your resume and paste a job description to see how well they match.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Inputs */}
        <div className="flex-1 space-y-6">
          {/* Prefill from dashboard */}
          {prefillAvailable && (
            <button
              onClick={handlePrefill}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium
                         text-cyan-glow bg-cyan-glow/10 border border-cyan-glow/20
                         hover:bg-cyan-glow/15 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Use resume & JD from Dashboard
            </button>
          )}

          {/* Resume upload */}
          <div>
            <div className="text-xs uppercase tracking-wider text-text-dim font-medium mb-2.5">Resume</div>
            {resumeText ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-glow/10 border border-emerald-glow/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-emerald-glow font-medium">Resume loaded</span>
                  </div>
                  <button
                    onClick={() => { setResumeText(""); setCurrentScore(null); }}
                    className="text-xs text-text-muted hover:text-foreground transition-colors"
                  >
                    Replace
                  </button>
                </div>
                <div className="max-h-32 overflow-y-auto rounded-xl bg-surface-elevated border border-border-subtle p-4 text-sm text-text-muted leading-relaxed">
                  {resumeText.slice(0, 500)}
                  {resumeText.length > 500 && <span className="text-text-dim">... ({resumeText.length} chars)</span>}
                </div>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300
                  ${isDragActive ? "border-emerald-glow/50 bg-emerald-glow/[0.03]" : "border-border-subtle hover:border-emerald-glow/20 hover:bg-surface-elevated/50"}
                  ${parsing ? "pointer-events-none opacity-60" : ""}`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-glow/10 border border-emerald-glow/20 flex items-center justify-center">
                    {parsing ? (
                      <svg className="w-5 h-5 text-emerald-glow animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-emerald-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground/80">
                      {parsing ? "Parsing resume..." : isDragActive ? "Drop your resume here" : "Drop your resume here, or click to browse"}
                    </p>
                    <p className="text-xs text-text-dim mt-1">PDF or DOCX</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border-glow to-transparent" />

          {/* JD Input */}
          <div>
            <div className="text-xs uppercase tracking-wider text-text-dim font-medium mb-2.5">Job Description</div>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the job description here..."
              rows={6}
              className="w-full rounded-xl bg-surface-elevated border border-border-subtle p-4 text-sm text-foreground/90
                         placeholder:text-text-dim resize-none focus:outline-none focus:border-emerald-glow/20 transition-colors"
            />
          </div>

          {/* Check button */}
          <button
            onClick={handleCheck}
            disabled={!resumeText || !jdText || checking}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium
                       bg-emerald-glow/10 text-emerald-glow border border-emerald-glow/20
                       hover:bg-emerald-glow/15 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {checking ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            )}
            {checking ? "Analyzing..." : "Check ATS Score"}
          </button>

          {error && <p className="text-xs text-red-400 px-1">{error}</p>}
        </div>

        {/* Right: Score Results */}
        <div className="flex-1">
          {currentScore ? (
            <div>
              <div className="text-xs uppercase tracking-wider text-text-dim font-medium mb-4">Score Breakdown</div>
              <ScoreDisplay score={currentScore} />
            </div>
          ) : (
            <div className="rounded-xl border border-border-subtle bg-surface-elevated/50 p-8 text-center h-full flex items-center justify-center">
              <p className="text-sm text-text-dim">
                Upload your resume and paste a job description to see your ATS score.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/saishashankanchuri/Documents/Awfis/PrepWise && git add src/components/resume-builder/ATSChecker.tsx && git commit -m "feat: add ATS checker component with resume upload, JD input, and scoring"
```

---

### Task 9: SectionEditor Component

**Files:**
- Create: `src/components/resume-builder/SectionEditor.tsx`

- [ ] **Step 1: Create the section editor component**

```tsx
// src/components/resume-builder/SectionEditor.tsx
"use client";

import { useState } from "react";
import type { ResumeSection } from "@/lib/resumeTypes";

interface Props {
  section: ResumeSection;
  onUpdate: (content: string) => void;
  onRegenerate: () => Promise<void>;
}

export default function SectionEditor({ section, onUpdate, onRegenerate }: Props) {
  const [editing, setEditing] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      await onRegenerate();
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="rounded-xl bg-surface-elevated border border-border-subtle p-4 transition-colors hover:border-emerald-glow/[0.12]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-semibold">{section.title}</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditing(!editing)}
            className="text-[11px] text-text-muted hover:text-foreground transition-colors"
          >
            {editing ? "Done" : "Edit"}
          </button>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="text-[11px] text-emerald-glow hover:opacity-70 transition-opacity disabled:opacity-40"
          >
            {regenerating ? "..." : "✦ Regenerate"}
          </button>
        </div>
      </div>

      {editing ? (
        <textarea
          value={section.content}
          onChange={(e) => onUpdate(e.target.value)}
          rows={6}
          className="w-full bg-surface border border-border-subtle rounded-lg p-3 text-[13px] text-foreground/80
                     resize-none focus:outline-none focus:border-emerald-glow/20 transition-colors leading-relaxed"
        />
      ) : (
        <div className="text-[13px] text-text-muted leading-relaxed whitespace-pre-wrap">
          {section.content}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/saishashankanchuri/Documents/Awfis/PrepWise && git add src/components/resume-builder/SectionEditor.tsx && git commit -m "feat: add editable section panel with inline editing and regenerate"
```

---

### Task 10: ResumeGenerator Component (Tab 2)

**Files:**
- Create: `src/components/resume-builder/ResumeGenerator.tsx`

- [ ] **Step 1: Create the resume generator tab component**

```tsx
// src/components/resume-builder/ResumeGenerator.tsx
"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { parseResume } from "@/hooks/useResumeParser";
import { isAIConfigured } from "@/lib/ai";
import { generateTailoredSections, generateFullDocument, regenerateSection } from "@/lib/resumeGenerator";
import { exportToPDF, exportToDOCX, exportFullDocumentToPDF, exportFullDocumentToDOCX } from "@/lib/resumeExporter";
import { useResumeBuilderStore } from "@/stores/useResumeBuilderStore";
import { useProfileStore } from "@/stores/useProfileStore";
import type { ResumeSection, TailoredResume } from "@/lib/resumeTypes";
import SectionEditor from "./SectionEditor";

type Mode = "sections" | "full";

export default function ResumeGenerator() {
  const [mode, setMode] = useState<Mode>("sections");
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [company, setCompany] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [fullText, setFullText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { generating, setGenerating, addResume, editingResume, setEditingResume, persist } = useResumeBuilderStore();
  const profileStore = useProfileStore();
  const prefillAvailable = !resumeText && profileStore.resumeText;
  const hasGenerated = sections.length > 0 || fullText.length > 0;

  // Load editing resume on mount
  useState(() => {
    if (editingResume) {
      setResumeText("(loaded from saved resume)");
      setJdText(editingResume.jdText);
      setCompany(editingResume.company);
      setRoleTitle(editingResume.roleTitle);
      setSections(editingResume.sections);
      setFullText(editingResume.fullDocument);
    }
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setError(null);
    setParsing(true);
    try {
      const text = await parseResume(file);
      setResumeText(text);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to parse resume");
    } finally {
      setParsing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleGenerate = async () => {
    if (!resumeText || !jdText) return;
    setGenerating(true);
    setError(null);
    try {
      if (mode === "sections") {
        const result = await generateTailoredSections(resumeText, jdText);
        setSections(result);
      } else {
        const result = await generateFullDocument(resumeText, jdText);
        setFullText(result);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Generation failed. Check your API key.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    const resume: TailoredResume = {
      id: editingResume?.id || crypto.randomUUID(),
      roleTitle: roleTitle || "Untitled Role",
      company: company || "Unknown Company",
      jdText,
      sections,
      fullDocument: fullText,
      atsScore: null,
      createdAt: editingResume?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addResume(resume);
    await persist();
    setEditingResume(null);
  };

  const handleDownloadPDF = async () => {
    const fileName = `${roleTitle || "resume"}-${company || "tailored"}`.replace(/\s+/g, "-").toLowerCase();
    if (mode === "sections" && sections.length > 0) {
      await exportToPDF(sections, fileName);
    } else if (fullText) {
      await exportFullDocumentToPDF(fullText, fileName);
    }
  };

  const handleDownloadDOCX = async () => {
    const fileName = `${roleTitle || "resume"}-${company || "tailored"}`.replace(/\s+/g, "-").toLowerCase();
    if (mode === "sections" && sections.length > 0) {
      await exportToDOCX(sections, fileName);
    } else if (fullText) {
      await exportFullDocumentToDOCX(fullText, fileName);
    }
  };

  if (!isAIConfigured()) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-cabinet)" }}>
            Generate Tailored Resume
          </h1>
          <p className="text-sm text-text-muted">
            Create a resume optimized for a specific role using AI.
          </p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-surface-elevated/50 p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-sm text-text-muted mb-2">AI resume generation requires a Gemini API key.</p>
          <p className="text-xs text-text-dim">
            Set <code className="text-emerald-glow bg-surface px-1.5 py-0.5 rounded text-[11px]">NEXT_PUBLIC_GEMINI_API_KEY</code> in your environment to enable this feature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-cabinet)" }}>
          Generate Tailored Resume
        </h1>
        <p className="text-sm text-text-muted">
          Create a resume optimized for a specific role using your existing resume and the job description.
        </p>
      </div>

      {/* Role info */}
      <div className="flex gap-3">
        <input
          value={roleTitle}
          onChange={(e) => setRoleTitle(e.target.value)}
          placeholder="Role title (e.g. Senior Frontend Engineer)"
          className="flex-1 rounded-xl bg-surface-elevated border border-border-subtle px-4 py-2.5 text-sm
                     placeholder:text-text-dim focus:outline-none focus:border-emerald-glow/20 transition-colors"
        />
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company"
          className="w-48 rounded-xl bg-surface-elevated border border-border-subtle px-4 py-2.5 text-sm
                     placeholder:text-text-dim focus:outline-none focus:border-emerald-glow/20 transition-colors"
        />
      </div>

      {!hasGenerated && (
        <>
          {/* Prefill */}
          {prefillAvailable && (
            <button
              onClick={() => {
                setResumeText(profileStore.resumeText);
                if (profileStore.jdText) setJdText(profileStore.jdText);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium
                         text-cyan-glow bg-cyan-glow/10 border border-cyan-glow/20 hover:bg-cyan-glow/15 transition-colors"
            >
              Use resume & JD from Dashboard
            </button>
          )}

          {/* Resume upload */}
          <div>
            <div className="text-xs uppercase tracking-wider text-text-dim font-medium mb-2.5">Resume</div>
            {resumeText ? (
              <div className="flex items-center justify-between rounded-xl bg-surface-elevated border border-border-subtle p-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-glow/10 flex items-center justify-center">
                    <svg className="w-3 h-3 text-emerald-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-emerald-glow">Resume loaded</span>
                </div>
                <button onClick={() => setResumeText("")} className="text-xs text-text-muted hover:text-foreground transition-colors">
                  Replace
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all
                  ${isDragActive ? "border-emerald-glow/50 bg-emerald-glow/[0.03]" : "border-border-subtle hover:border-emerald-glow/20"}
                  ${parsing ? "pointer-events-none opacity-60" : ""}`}
              >
                <input {...getInputProps()} />
                <p className="text-sm text-foreground/80">
                  {parsing ? "Parsing..." : "Drop resume or click to upload"}
                </p>
                <p className="text-xs text-text-dim mt-1">PDF or DOCX</p>
              </div>
            )}
          </div>

          {/* JD */}
          <div>
            <div className="text-xs uppercase tracking-wider text-text-dim font-medium mb-2.5">Job Description</div>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the job description here..."
              rows={5}
              className="w-full rounded-xl bg-surface-elevated border border-border-subtle p-4 text-sm
                         placeholder:text-text-dim resize-none focus:outline-none focus:border-emerald-glow/20 transition-colors"
            />
          </div>
        </>
      )}

      {/* Mode toggle */}
      <div className="flex gap-3">
        {(["sections", "full"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 p-3.5 rounded-xl transition-all text-left ${
              mode === m
                ? "bg-emerald-glow/[0.08] border border-emerald-glow/25"
                : "bg-surface-elevated border border-border-subtle"
            }`}
          >
            <div className={`text-sm font-semibold ${mode === m ? "text-emerald-glow" : ""}`}>
              {m === "sections" ? "Section Editor" : "Full Document"}
            </div>
            <div className="text-xs text-text-dim mt-1">
              {m === "sections" ? "Edit each section individually" : "Generate complete resume at once"}
            </div>
          </button>
        ))}
      </div>

      {/* Generate button */}
      {!hasGenerated && (
        <button
          onClick={handleGenerate}
          disabled={!resumeText || !jdText || generating}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium
                     bg-emerald-glow/10 text-emerald-glow border border-emerald-glow/20
                     hover:bg-emerald-glow/15 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {generating ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Generate Tailored Resume
            </>
          )}
        </button>
      )}

      {error && <p className="text-xs text-red-400 px-1">{error}</p>}

      {/* Section editor */}
      {mode === "sections" && sections.length > 0 && (
        <div className="space-y-3">
          {sections.map((section, i) => (
            <SectionEditor
              key={section.id}
              section={section}
              onUpdate={(content) => {
                const updated = [...sections];
                updated[i] = { ...section, content };
                setSections(updated);
              }}
              onRegenerate={async () => {
                const newContent = await regenerateSection(section, resumeText, jdText);
                const updated = [...sections];
                updated[i] = { ...section, content: newContent };
                setSections(updated);
              }}
            />
          ))}
        </div>
      )}

      {/* Full document editor */}
      {mode === "full" && fullText && (
        <div className="rounded-xl bg-surface-elevated border border-border-subtle p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold">Full Resume</span>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="text-[11px] text-emerald-glow hover:opacity-70 disabled:opacity-40"
            >
              {generating ? "..." : "✦ Regenerate"}
            </button>
          </div>
          <textarea
            value={fullText}
            onChange={(e) => setFullText(e.target.value)}
            rows={20}
            className="w-full bg-surface border border-border-subtle rounded-lg p-3 text-[13px] text-foreground/80
                       resize-y focus:outline-none focus:border-emerald-glow/20 transition-colors leading-relaxed font-mono"
          />
        </div>
      )}

      {/* Action bar */}
      {hasGenerated && (
        <div className="flex gap-2.5">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium
                       bg-emerald-glow/10 text-emerald-glow border border-emerald-glow/20 hover:bg-emerald-glow/15 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download PDF
          </button>
          <button
            onClick={handleDownloadDOCX}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium
                       text-text-muted border border-border-subtle hover:text-foreground hover:border-emerald-glow/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download DOCX
          </button>
          <button
            onClick={handleSave}
            className="px-6 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium
                       text-text-muted border border-border-subtle hover:text-foreground hover:border-emerald-glow/20 transition-colors"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/saishashankanchuri/Documents/Awfis/PrepWise && git add src/components/resume-builder/ResumeGenerator.tsx && git commit -m "feat: add resume generator with section editor and full document modes"
```

---

### Task 11: ResumeCard and ResumeLibrary Components (Tab 3)

**Files:**
- Create: `src/components/resume-builder/ResumeCard.tsx`
- Create: `src/components/resume-builder/ResumeLibrary.tsx`

- [ ] **Step 1: Create the resume card component**

```tsx
// src/components/resume-builder/ResumeCard.tsx
"use client";

import { useState } from "react";
import type { TailoredResume } from "@/lib/resumeTypes";
import { exportToPDF, exportToDOCX } from "@/lib/resumeExporter";

interface Props {
  resume: TailoredResume;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ResumeCard({ resume, onEdit, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fileName = `${resume.roleTitle}-${resume.company}`.replace(/\s+/g, "-").toLowerCase();
  const date = new Date(resume.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const scoreBadge = resume.atsScore !== null ? (
    <span
      className={`text-[11px] font-semibold px-3 py-1 rounded-md ${
        resume.atsScore >= 80
          ? "bg-emerald-glow/10 text-emerald-glow"
          : resume.atsScore >= 60
            ? "bg-yellow-400/10 text-yellow-400"
            : "bg-red-400/10 text-red-400"
      }`}
    >
      ATS: {resume.atsScore}
    </span>
  ) : null;

  return (
    <div className="rounded-xl bg-surface-elevated border border-border-subtle p-4 transition-colors hover:border-emerald-glow/[0.12]">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-sm font-semibold">{resume.roleTitle}</div>
          <div className="text-xs text-text-dim mt-0.5">{resume.company} — {date}</div>
        </div>
        {scoreBadge}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => exportToPDF(resume.sections, fileName)}
          className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-border-subtle text-xs text-text-muted
                     hover:text-foreground hover:border-emerald-glow/20 transition-all"
        >
          PDF ↓
        </button>
        <button
          onClick={() => exportToDOCX(resume.sections, fileName)}
          className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-border-subtle text-xs text-text-muted
                     hover:text-foreground hover:border-emerald-glow/20 transition-all"
        >
          DOCX ↓
        </button>
        <button
          onClick={onEdit}
          className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-border-subtle text-xs text-text-dim
                     hover:text-foreground hover:border-emerald-glow/20 transition-all"
        >
          Edit
        </button>
        {confirmDelete ? (
          <button
            onClick={() => { onDelete(); setConfirmDelete(false); }}
            className="px-3.5 py-1.5 rounded-lg bg-red-400/10 border border-red-400/20 text-xs text-red-400"
          >
            Confirm
          </button>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-border-subtle text-xs text-red-400/60
                       hover:text-red-400 hover:border-red-400/20 transition-all"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the resume library component**

```tsx
// src/components/resume-builder/ResumeLibrary.tsx
"use client";

import { useResumeBuilderStore } from "@/stores/useResumeBuilderStore";
import ResumeCard from "./ResumeCard";

export default function ResumeLibrary() {
  const { resumes, deleteResume, setEditingResume, setActiveTab, persist } = useResumeBuilderStore();

  const handleEdit = (resume: typeof resumes[0]) => {
    setEditingResume(resume);
    setActiveTab("generate");
  };

  const handleDelete = async (id: string) => {
    deleteResume(id);
    await persist();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-cabinet)" }}>
          My Resumes
        </h1>
        <p className="text-sm text-text-muted">
          All your tailored resumes, organized by role.
        </p>
      </div>

      {resumes.length === 0 ? (
        <div className="rounded-xl border border-border-subtle bg-surface-elevated/50 p-8 text-center">
          <p className="text-sm text-text-dim">
            No resumes yet. Generate a tailored resume from the Generate tab to see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onEdit={() => handleEdit(resume)}
              onDelete={() => handleDelete(resume.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/saishashankanchuri/Documents/Awfis/PrepWise && git add src/components/resume-builder/ResumeCard.tsx src/components/resume-builder/ResumeLibrary.tsx && git commit -m "feat: add resume library with cards, download, edit, and delete actions"
```

---

### Task 12: Main Page with Tabs

**Files:**
- Create: `src/app/resume-builder/page.tsx`

- [ ] **Step 1: Create the resume builder page**

```tsx
// src/app/resume-builder/page.tsx
"use client";

import { useEffect } from "react";
import { useResumeBuilderStore } from "@/stores/useResumeBuilderStore";
import { useProfileStore } from "@/stores/useProfileStore";
import ATSChecker from "@/components/resume-builder/ATSChecker";
import ResumeGenerator from "@/components/resume-builder/ResumeGenerator";
import ResumeLibrary from "@/components/resume-builder/ResumeLibrary";

type Tab = "ats" | "generate" | "library";

export default function ResumeBuilderPage() {
  const { activeTab, setActiveTab, resumes, load, loaded } = useResumeBuilderStore();
  const profileStore = useProfileStore();

  useEffect(() => {
    load();
    profileStore.load();
  }, [load, profileStore.load]);

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "ats", label: "ATS Score Check" },
    { id: "generate", label: "Generate Resume" },
    { id: "library", label: "My Resumes", count: resumes.length },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-emerald-glow/20 rounded-lg blur-md" />
              <div className="relative w-full h-full bg-surface-elevated rounded-lg border border-emerald-glow/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-emerald-glow">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
                </svg>
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "var(--font-cabinet)" }}>
              Prep<span className="text-emerald-glow">Wise</span>
            </span>
          </a>

          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto">
            <div className="flex items-center gap-1 bg-surface-elevated rounded-xl border border-border-subtle p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-emerald-glow/10 text-emerald-glow border border-emerald-glow/20"
                      : "text-text-muted hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="ml-1.5 text-[10px] bg-emerald-glow/20 text-emerald-glow px-1.5 py-0.5 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <a
              href="/dashboard"
              className="px-3 py-2 rounded-lg text-xs font-medium text-cyan-glow bg-cyan-glow/10
                         border border-cyan-glow/20 hover:bg-cyan-glow/15 transition-colors"
            >
              Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {activeTab === "ats" && <ATSChecker />}
        {activeTab === "generate" && <ResumeGenerator />}
        {activeTab === "library" && <ResumeLibrary />}
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/saishashankanchuri/Documents/Awfis/PrepWise && git add src/app/resume-builder/page.tsx && git commit -m "feat: add resume builder page with tabbed layout"
```

---

### Task 13: Navigation Links

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Modify: `src/components/landing/Navbar.tsx`

- [ ] **Step 1: Add Resume Builder link to dashboard header**

In `src/app/dashboard/page.tsx`, after the Study Plan link (line 81), add a Resume Builder link:

Find:
```tsx
          <a
            href="/plan"
            className="px-3 py-2 rounded-lg text-xs font-medium text-cyan-glow bg-cyan-glow/10
                       border border-cyan-glow/20 hover:bg-cyan-glow/15 transition-colors"
          >
            Study Plan
          </a>
```

Replace with:
```tsx
          <a
            href="/plan"
            className="px-3 py-2 rounded-lg text-xs font-medium text-cyan-glow bg-cyan-glow/10
                       border border-cyan-glow/20 hover:bg-cyan-glow/15 transition-colors"
          >
            Study Plan
          </a>
          <a
            href="/resume-builder"
            className="px-3 py-2 rounded-lg text-xs font-medium text-emerald-glow/70 bg-emerald-glow/[0.05]
                       border border-emerald-glow/10 hover:bg-emerald-glow/10 transition-colors"
          >
            Resume Builder
          </a>
```

- [ ] **Step 2: Add Resume Builder to landing page navbar**

In `src/components/landing/Navbar.tsx`, add to the `navLinks` array:

Find:
```typescript
const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Editor", href: "#editor" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];
```

Replace with:
```typescript
const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Editor", href: "#editor" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Resume Builder", href: "/resume-builder" },
];
```

- [ ] **Step 3: Commit**

```bash
cd /Users/saishashankanchuri/Documents/Awfis/PrepWise && git add src/app/dashboard/page.tsx src/components/landing/Navbar.tsx && git commit -m "feat: add resume builder navigation links to dashboard and landing page"
```

---

### Task 14: Build Verification

- [ ] **Step 1: Run the build**

```bash
cd /Users/saishashankanchuri/Documents/Awfis/PrepWise && npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Fix any type errors or build issues**

If the build fails, read the error messages and fix the issues in the relevant files.

- [ ] **Step 3: Test locally**

```bash
cd /Users/saishashankanchuri/Documents/Awfis/PrepWise && npm run dev
```

Open `http://localhost:3000/resume-builder` and verify:
- All three tabs render
- Tab switching works
- Resume upload works (drop a PDF)
- ATS check button triggers scoring
- Navigate to dashboard, verify Resume Builder link exists

- [ ] **Step 4: Final commit**

```bash
cd /Users/saishashankanchuri/Documents/Awfis/PrepWise && git add -A && git commit -m "fix: resolve build issues for resume builder feature"
```

(Only if there were fixes needed in step 2.)
