---
title: "feat: PrepWise — AI-Powered Interview Preparation Platform"
type: feat
status: active
date: 2026-03-26
deepened: 2026-03-27
revised: 2026-03-27
revision: "Zero-cost architecture — no backend, no API costs"
---

# PrepWise — AI-Powered Interview Preparation Platform

## Architecture: Zero-Cost, Browser-First

**Total monthly cost: $0**

Everything runs in the browser or on free-tier services. No backend server. No Docker. No API costs.

| Layer | Solution | Cost |
|-------|----------|------|
| Frontend + Hosting | Next.js on Vercel free tier | $0 |
| Database | Firebase Firestore free tier (1GB, 50K reads/day) | $0 |
| Auth | Firebase Auth (add when needed) | $0 |
| Python execution | Pyodide (CPython in WebAssembly, runs in browser) | $0 |
| SQL practice | PGlite (PostgreSQL in WebAssembly, runs in browser) | $0 |
| JavaScript execution | Sandboxed iframe with eval | $0 |
| Java execution | JDoodle free API (200 requests/day) | $0 |
| Resume parsing | pdf.js (PDF) + mammoth.js (DOCX) — in browser | $0 |
| AI features | Deferred — plug in any LLM API later | $0 |

---

## Overview

PrepWise helps job seekers prepare for interviews by analyzing their resume against job descriptions, identifying skill gaps, and providing structured learning with hands-on coding practice.

**MVP (zero-cost) features:**
1. Upload resume (PDF/DOCX) — parsed in browser, user tags skills
2. Paste job description — user identifies required skills
3. Manual gap analysis — side-by-side comparison of resume skills vs JD requirements
4. Create study plan — user builds their own plan with topics, priorities
5. Learning modules — curated theory content per topic (manually authored or linked)
6. Code editor — Monaco Editor with in-browser execution (Python, JS, SQL, Java)
7. Practice assignments — questions with test cases, auto-graded by running code
8. Progress tracking — Firebase Firestore stores all progress

**Future (when adding AI):**
- AI-powered resume parsing, gap analysis, plan generation
- AI theory generation, code evaluation, re-explanation loop
- Plug in Gemini Flash (free tier), Claude API, or any LLM

---

## Problem Statement

Graduate and professional students face a common challenge: given a job description, they don't know how to prepare systematically. Current options are fragmented:
- LeetCode/HackerRank — coding only, no personalization to the JD
- YouTube/blogs — unstructured, no feedback loop
- Mock interview services — expensive, no self-paced option
- ChatGPT conversations — no persistence, no structured plan, no code execution

PrepWise solves this by creating a personalized, structured, interactive learning experience that adapts to the gap between what you know (resume) and what you need (JD).

---

## High-Level Architecture

```
Browser (Everything runs here)
├── Next.js App (Vercel free tier)
│   ├── Resume Parser (pdf.js + mammoth.js)
│   ├── Monaco Code Editor
│   ├── Pyodide (Python in WebAssembly)
│   ├── PGlite (PostgreSQL in WebAssembly)
│   ├── JS Sandbox (iframe)
│   └── React UI (Tailwind + Zustand)
│
├── Firebase (free tier)
│   ├── Firestore (user data, plans, progress, submissions)
│   └── Auth (optional, add later)
│
└── External APIs (free tier, optional)
    └── JDoodle API (Java execution, 200 req/day)
```

No backend server. No Docker. No Piston. The browser does all the heavy lifting.

---

## Technical Approach

### Frontend — Next.js (App Router)

```
PrepWise/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing / upload page
│   │   ├── layout.tsx                  # Root layout with Navbar
│   │   ├── plan/
│   │   │   └── page.tsx                # Study plan builder + dashboard
│   │   ├── learn/
│   │   │   └── [topicId]/
│   │   │       └── page.tsx            # Theory + examples + assignments
│   │   └── practice/
│   │       └── [questionId]/
│   │           └── page.tsx            # Code editor + execution + feedback
│   ├── components/
│   │   ├── upload/
│   │   │   ├── ResumeUpload.tsx        # Drag-and-drop PDF/DOCX
│   │   │   ├── ResumeViewer.tsx        # Show parsed text, tag skills
│   │   │   └── JDInput.tsx             # Paste or upload job description
│   │   ├── plan/
│   │   │   ├── PlanBuilder.tsx         # Add/remove/reorder topics
│   │   │   ├── TopicCard.tsx           # Topic with status + priority
│   │   │   ├── GapView.tsx             # Side-by-side resume vs JD skills
│   │   │   └── ProgressBar.tsx         # Overall completion
│   │   ├── learning/
│   │   │   ├── TheoryPanel.tsx         # Markdown content display
│   │   │   ├── ExampleViewer.tsx       # Code examples with highlighting
│   │   │   └── AssignmentCard.tsx      # Question + test cases
│   │   ├── editor/
│   │   │   ├── CodeEditor.tsx          # Monaco (lazy loaded)
│   │   │   ├── OutputPanel.tsx         # Execution output
│   │   │   ├── LanguageSelector.tsx    # Python, JS, SQL, Java
│   │   │   ├── RunButton.tsx           # Execute code
│   │   │   └── TestResults.tsx         # Pass/fail per test case
│   │   └── common/
│   │       ├── Navbar.tsx
│   │       ├── SkillTag.tsx            # Editable skill badge
│   │       └── LoadingState.tsx
│   ├── stores/
│   │   ├── useProfileStore.ts          # Resume data, tagged skills
│   │   ├── usePlanStore.ts             # Topics, progress, assignments
│   │   └── useEditorStore.ts           # Current code, language, output (ephemeral)
│   ├── hooks/
│   │   ├── usePyodide.ts              # Python execution via WebAssembly
│   │   ├── usePGlite.ts               # SQL execution via WebAssembly
│   │   ├── useJavaExecution.ts         # JDoodle API for Java
│   │   └── useResumeParser.ts          # pdf.js + mammoth.js
│   ├── lib/
│   │   ├── firebase.ts                 # Firebase config + Firestore helpers
│   │   ├── executors.ts                # Code execution router (language -> executor)
│   │   ├── testRunner.ts               # Run test cases against user code output
│   │   └── types.ts                    # TypeScript types
│   └── styles/
│       └── globals.css                 # Tailwind CSS
├── public/
│   └── datasets/                       # Pre-loaded SQL datasets (JSON)
│       ├── ecommerce.sql
│       ├── hr.sql
│       └── analytics.sql
├── package.json
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── .env.local                          # Firebase config (public keys only)
```

### Dependencies

```json
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "@monaco-editor/react": "^4",
    "pyodide": "^0.26",
    "@electric-sql/pglite": "^0.2",
    "firebase": "^11",
    "zustand": "^5",
    "react-markdown": "^9",
    "rehype-highlight": "^7",
    "react-dropzone": "^14",
    "mammoth": "^1",
    "pdfjs-dist": "^4",
    "tailwindcss": "^4",
    "dompurify": "^3"
  }
}
```

---

### In-Browser Code Execution

No server needed. All code runs in the user's browser.

#### Python — Pyodide (CPython compiled to WebAssembly)

```typescript
// hooks/usePyodide.ts
import { useRef, useState, useCallback } from 'react';

export function usePyodide() {
  const pyodideRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const init = useCallback(async () => {
    if (pyodideRef.current) return;
    setLoading(true);
    const { loadPyodide } = await import('pyodide');
    pyodideRef.current = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
    });
    setLoading(false);
    setReady(true);
  }, []);

  const run = useCallback(async (code: string, stdin?: string): Promise<{
    stdout: string;
    stderr: string;
    error: string | null;
  }> => {
    if (!pyodideRef.current) await init();
    const pyodide = pyodideRef.current;

    // Capture stdout/stderr
    pyodide.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
    `);

    // Provide stdin if needed
    if (stdin) {
      pyodide.runPython(`
import io
sys.stdin = io.StringIO(${JSON.stringify(stdin)})
      `);
    }

    try {
      pyodide.runPython(code);
      const stdout = pyodide.runPython('sys.stdout.getvalue()');
      const stderr = pyodide.runPython('sys.stderr.getvalue()');
      return { stdout, stderr, error: null };
    } catch (e: any) {
      const stderr = pyodide.runPython('sys.stderr.getvalue()');
      return { stdout: '', stderr, error: e.message };
    }
  }, [init]);

  return { run, loading, ready, init };
}
```

**Supports:** numpy, pandas, scipy, scikit-learn (loadable via `pyodide.loadPackage()`). Covers most interview-level Python.

#### SQL — PGlite (PostgreSQL in WebAssembly)

```typescript
// hooks/usePGlite.ts
import { useRef, useCallback, useState } from 'react';
import { PGlite } from '@electric-sql/pglite';

export function usePGlite() {
  const dbRef = useRef<PGlite | null>(null);
  const [ready, setReady] = useState(false);

  const init = useCallback(async (setupSql?: string) => {
    if (dbRef.current) return;
    dbRef.current = new PGlite();
    if (setupSql) {
      await dbRef.current.exec(setupSql);
    }
    setReady(true);
  }, []);

  const run = useCallback(async (sql: string) => {
    if (!dbRef.current) await init();
    try {
      const result = await dbRef.current!.query(sql);
      return {
        rows: result.rows,
        fields: result.fields.map(f => f.name),
        error: null,
      };
    } catch (e: any) {
      return { rows: [], fields: [], error: e.message };
    }
  }, [init]);

  const loadDataset = useCallback(async (datasetName: string) => {
    const response = await fetch(`/datasets/${datasetName}.sql`);
    const sql = await response.text();
    await dbRef.current?.exec(sql);
  }, []);

  return { run, ready, init, loadDataset };
}
```

**Full PostgreSQL syntax:** window functions, CTEs, subqueries, JOINs. Pre-loaded datasets for practice.

#### JavaScript — Sandboxed iframe

```typescript
// lib/executors.ts
export async function executeJavaScript(code: string): Promise<{
  stdout: string;
  error: string | null;
}> {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.sandbox.add('allow-scripts');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const logs: string[] = [];
    const timeout = setTimeout(() => {
      document.body.removeChild(iframe);
      resolve({ stdout: logs.join('\n'), error: 'Execution timed out (10s)' });
    }, 10000);

    // Override console.log in the iframe
    const script = `
      <script>
        const __logs = [];
        console.log = (...args) => __logs.push(args.map(String).join(' '));
        console.error = console.log;
        try {
          ${code}
          parent.postMessage({ type: 'result', stdout: __logs.join('\\n'), error: null }, '*');
        } catch(e) {
          parent.postMessage({ type: 'result', stdout: __logs.join('\\n'), error: e.message }, '*');
        }
      </script>
    `;

    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'result') {
        clearTimeout(timeout);
        window.removeEventListener('message', handler);
        document.body.removeChild(iframe);
        resolve(event.data);
      }
    };
    window.addEventListener('message', handler);
    iframe.srcdoc = script;
  });
}
```

#### Java — JDoodle Free API (200 requests/day)

```typescript
// hooks/useJavaExecution.ts
export async function executeJava(code: string, stdin?: string): Promise<{
  stdout: string;
  error: string | null;
}> {
  // JDoodle free API — 200 credits/day
  // Sign up at https://www.jdoodle.com/compiler-api
  const response = await fetch('https://api.jdoodle.com/v1/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: process.env.NEXT_PUBLIC_JDOODLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_JDOODLE_SECRET,
      script: code,
      stdin: stdin || '',
      language: 'java',
      versionIndex: '5', // Java 17
    }),
  });

  const data = await response.json();
  if (data.statusCode === 200) {
    return { stdout: data.output, error: null };
  }
  return { stdout: '', error: data.output || 'Execution failed' };
}
```

**Note:** JDoodle credentials are public-facing (client-side). The free tier has 200 req/day. For MVP, this is fine. Later, move to a backend proxy.

#### Execution Router

```typescript
// lib/executors.ts
import { usePyodide } from '@/hooks/usePyodide';
import { usePGlite } from '@/hooks/usePGlite';

export type Language = 'python' | 'javascript' | 'sql' | 'java';

export async function executeCode(
  language: Language,
  code: string,
  executors: { python: ReturnType<typeof usePyodide>; sql: ReturnType<typeof usePGlite> },
  stdin?: string,
) {
  switch (language) {
    case 'python':
      return executors.python.run(code, stdin);
    case 'sql':
      return executors.sql.run(code);
    case 'javascript':
      return executeJavaScript(code);
    case 'java':
      return executeJava(code, stdin);
  }
}
```

---

### Resume Parsing (In-Browser)

No backend. PDF and DOCX parsed entirely in the browser.

```typescript
// hooks/useResumeParser.ts
export async function parseResume(file: File): Promise<string> {
  if (file.type === 'application/pdf') {
    return parsePdf(file);
  }
  if (file.name.endsWith('.docx')) {
    return parseDocx(file);
  }
  throw new Error('Unsupported file type. Please upload PDF or DOCX.');
}

async function parsePdf(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item: any) => item.str).join(' ');
    pages.push(text);
  }
  return pages.join('\n\n');
}

async function parseDocx(file: File): Promise<string> {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}
```

---

### Firebase (Firestore) — Data Persistence

```typescript
// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import {
  getFirestore, doc, setDoc, getDoc, updateDoc,
  collection, addDoc, query, where, getDocs,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// --- Session Management (anonymous, no auth for MVP) ---

export async function getOrCreateSession(): Promise<string> {
  let sessionId = localStorage.getItem('prepwise_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('prepwise_session_id', sessionId);
    await setDoc(doc(db, 'sessions', sessionId), {
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
    });
  }
  return sessionId;
}

// --- User Profile ---

export async function saveProfile(sessionId: string, data: {
  resumeText: string;
  skills: { name: string; level: string }[];
}) {
  await setDoc(doc(db, 'sessions', sessionId, 'profile', 'main'), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function getProfile(sessionId: string) {
  const snap = await getDoc(doc(db, 'sessions', sessionId, 'profile', 'main'));
  return snap.exists() ? snap.data() : null;
}

// --- Study Plans ---

export async function savePlan(sessionId: string, plan: {
  id: string;
  jdText: string;
  topics: { id: string; title: string; type: string; priority: number; status: string }[];
}) {
  await setDoc(doc(db, 'sessions', sessionId, 'plans', plan.id), {
    ...plan,
    createdAt: serverTimestamp(),
  });
}

// --- Code Submissions ---

export async function saveSubmission(sessionId: string, submission: {
  topicId: string;
  assignmentId: string;
  code: string;
  language: string;
  passed: boolean;
  output: string;
}) {
  await addDoc(collection(db, 'sessions', sessionId, 'submissions'), {
    ...submission,
    submittedAt: serverTimestamp(),
  });
}
```

### Firestore Data Model

```
sessions/{sessionId}
  ├── profile/main          # Resume text, tagged skills
  ├── plans/{planId}        # Study plan with topics
  │   └── topics: [{ id, title, type, priority, status, content }]
  └── submissions/{autoId}  # Code submissions with results
      └── { topicId, assignmentId, code, language, passed, output }
```

### Firestore Security Rules (no auth MVP)

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Sessions: anyone can create and read their own session
    // In MVP without auth, we rely on the session UUID being unguessable
    match /sessions/{sessionId}/{document=**} {
      allow read, write: if true;
      // TODO: Add auth check when Firebase Auth is added:
      // allow read, write: if request.auth != null && request.auth.uid == sessionId;
    }
  }
}
```

---

### Test Runner (Auto-Grading)

Run user code against test cases and check output:

```typescript
// lib/testRunner.ts
export interface TestCase {
  id: string;
  input: string;       // stdin or function args
  expectedOutput: string;
  description: string;
}

export interface TestResult {
  testCase: TestCase;
  passed: boolean;
  actualOutput: string;
  error: string | null;
}

export async function runTests(
  code: string,
  language: Language,
  testCases: TestCase[],
  executors: any,
): Promise<TestResult[]> {
  const results: TestResult[] = [];

  for (const tc of testCases) {
    const { stdout, error } = await executeCode(language, code, executors, tc.input);
    const actualOutput = stdout.trim();
    const expectedOutput = tc.expectedOutput.trim();

    results.push({
      testCase: tc,
      passed: !error && actualOutput === expectedOutput,
      actualOutput,
      error,
    });
  }

  return results;
}
```

---

### Monaco Editor (Lazy Loaded)

```typescript
// components/editor/CodeEditor.tsx
'use client';

import dynamic from 'next/dynamic';
import { useEditorStore } from '@/stores/useEditorStore';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-zinc-900 rounded-lg animate-pulse
                    flex items-center justify-center">
      <span className="text-zinc-500">Loading editor...</span>
    </div>
  ),
});

const LANGUAGE_MAP: Record<string, string> = {
  python: 'python',
  javascript: 'javascript',
  sql: 'sql',
  java: 'java',
};

export default function CodeEditor() {
  const { code, language, setCode } = useEditorStore();

  return (
    <Editor
      height="100%"
      language={LANGUAGE_MAP[language]}
      value={code}
      theme="vs-dark"
      onChange={(value) => setCode(value || '')}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        padding: { top: 12 },
      }}
    />
  );
}
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Goal:** Project setup, resume upload, skill tagging, Firebase integration.

**Tasks:**
- [ ] Initialize Next.js project: `npx create-next-app@latest PrepWise --typescript --tailwind --app`
- [ ] Set up Firebase project + Firestore database (free tier)
- [ ] Implement `lib/firebase.ts` — session management, profile CRUD
- [ ] Build `ResumeUpload.tsx` — drag-and-drop with react-dropzone
- [ ] Implement `useResumeParser.ts` — pdf.js (PDF) + mammoth.js (DOCX) in-browser parsing
- [ ] Build `ResumeViewer.tsx` — display extracted text, let user manually tag skills with `SkillTag.tsx`
- [ ] Build `JDInput.tsx` — paste text area for job description
- [ ] Build `GapView.tsx` — side-by-side comparison of tagged resume skills vs JD requirements
- [ ] Implement `useProfileStore.ts` (Zustand) — synced to Firebase
- [ ] Build `Navbar.tsx` and `layout.tsx` with basic navigation
- [ ] Deploy to Vercel (connect GitHub repo)

**Deliverable:** User uploads resume, sees parsed text, tags skills, pastes JD, sees gap comparison.

### Phase 2: Study Plan Builder (Week 3)

**Goal:** User creates and manages their study plan.

**Tasks:**
- [ ] Build `PlanBuilder.tsx` — add topics, set type (coding/SQL/conceptual), set priority, drag-to-reorder
- [ ] Build `TopicCard.tsx` — topic with status (not started / in progress / completed)
- [ ] Build `ProgressBar.tsx` — overall plan completion percentage
- [ ] Implement `usePlanStore.ts` (Zustand) — synced to Firebase
- [ ] Implement plan CRUD in Firebase (savePlan, getPlan, updateTopic)
- [ ] Add pre-built topic templates (e.g., "DSA Basics", "SQL Fundamentals", "System Design 101")
- [ ] Build `learn/[topicId]/page.tsx` — topic detail page with theory + assignments sections

**Deliverable:** User builds a prioritized study plan and can track progress.

### Phase 3: Code Editor + Execution (Week 4-5)

**Goal:** In-browser code execution with test case validation.

**Tasks:**
- [ ] Integrate Monaco Editor — lazy loaded, multi-language support
- [ ] Implement `usePyodide.ts` — Python execution in WebAssembly
- [ ] Implement `usePGlite.ts` — SQL execution with pre-loaded datasets
- [ ] Implement JS execution via sandboxed iframe
- [ ] Implement `useJavaExecution.ts` — JDoodle free API integration
- [ ] Build `executors.ts` — language router (maps language to executor)
- [ ] Build `LanguageSelector.tsx` — dropdown (Python, JavaScript, SQL, Java)
- [ ] Build `OutputPanel.tsx` — stdout, stderr, error display
- [ ] Build `RunButton.tsx` — execute with loading spinner
- [ ] Implement `testRunner.ts` — run test cases, compare output
- [ ] Build `TestResults.tsx` — pass/fail per test case with diff view
- [ ] Build `AssignmentCard.tsx` — question, hints, test cases
- [ ] Create sample assignments for each topic template (at least 2 per topic)
- [ ] Save submissions to Firebase with pass/fail status
- [ ] Create SQL datasets in `public/datasets/` (ecommerce, HR, analytics)

**Deliverable:** User can write code, run it in-browser, see test results, track submissions.

### Phase 4: Content + Polish (Week 6-7)

**Goal:** Learning content, responsive design, production readiness.

**Tasks:**
- [ ] Create theory content for 5-10 common interview topics:
  - Arrays and Strings (Python)
  - Binary Search (Python)
  - SQL JOINs and Aggregations
  - JavaScript Closures and Promises
  - Basic Data Structures (stacks, queues, linked lists)
- [ ] Build `TheoryPanel.tsx` — markdown rendering with syntax highlighting
- [ ] Build `ExampleViewer.tsx` — code examples with explanations
- [ ] Add responsive design — tab layout on mobile, side-by-side on desktop
- [ ] Add loading states and skeleton screens
- [ ] Add error boundaries around Monaco Editor and Pyodide
- [ ] Implement data export (download plan + submissions as JSON)
- [ ] Set up Firestore security rules
- [ ] Performance optimization — verify lazy loading works, check bundle size
- [ ] End-to-end testing of full flow

**Deliverable:** Polished, deployed platform with real learning content.

### Phase 5: AI Integration (Future, when budget allows)

**Goal:** Add AI-powered features.

**Tasks (future):**
- [ ] Add Gemini Flash free tier (1500 req/day) or Claude API
- [ ] AI-powered resume parsing (extract skills automatically)
- [ ] AI-powered gap analysis (compare resume vs JD automatically)
- [ ] AI-generated study plans
- [ ] AI-generated theory, examples, assignments per topic
- [ ] AI code evaluation (beyond just test case pass/fail)
- [ ] Re-explanation loop (AI teaches differently on failure)
- [ ] Chat-based Q&A for behavioral and system design topics

**Design principle:** The AI layer is a **separate module** (`lib/ai.ts`) with a provider interface. Swap between Gemini, Claude, or local models without changing the rest of the app.

---

## Data Model (Firestore)

```
sessions/{sessionId}
│
├── profile/main
│   ├── resumeText: string
│   ├── skills: [{ name, level, source }]
│   ├── jdText: string
│   ├── jdSkills: [{ name, required }]
│   └── updatedAt: timestamp
│
├── plans/{planId}
│   ├── title: string
│   ├── mode: "interview_prep" | "learning"
│   ├── topics: [{
│   │     id, title, type, interfaceMode,
│   │     priority, status, difficulty
│   │   }]
│   └── createdAt: timestamp
│
├── topics/{topicId}
│   ├── planId: string
│   ├── theoryContent: string (markdown)
│   ├── examples: [{ code, explanation, language }]
│   ├── assignments: [{
│   │     id, questionText, testCases: [{ input, expectedOutput }],
│   │     language, hints: [string]
│   │   }]
│   └── updatedAt: timestamp
│
└── submissions/{autoId}
    ├── topicId: string
    ├── assignmentId: string
    ├── code: string
    ├── language: string
    ├── passed: boolean
    ├── testResults: [{ testCaseId, passed, actualOutput }]
    ├── output: string
    └── submittedAt: timestamp
```

---

## Security Considerations

| Concern | Mitigation |
|---------|-----------|
| Firestore open access (no auth) | Session UUID is unguessable (crypto.randomUUID). Add Firebase Auth later |
| XSS via user content | DOMPurify on all markdown rendering. CSP headers in next.config.ts |
| JS code execution | Sandboxed iframe with `sandbox="allow-scripts"` only. No DOM access, no network |
| Python code execution | Pyodide runs in WebAssembly sandbox. No filesystem, no network access |
| JDoodle API keys exposed | Free tier, low risk. Rate limited to 200/day. Move to backend proxy later |
| File upload (resume) | Client-side only. File never leaves the browser. No server upload |
| Firestore abuse | Firestore security rules limit document size. Free tier has built-in rate limits |

---

## Acceptance Criteria

### Functional
- [ ] Upload PDF/DOCX resume, see parsed text, tag skills manually
- [ ] Paste job description, identify required skills
- [ ] Side-by-side gap analysis view
- [ ] Build study plan with topics, priorities, types
- [ ] Theory content with markdown + syntax highlighting
- [ ] Code editor (Monaco) with Python, JS, SQL, Java support
- [ ] In-browser code execution (Python via Pyodide, SQL via PGlite, JS via iframe)
- [ ] Java execution via JDoodle API
- [ ] Test case auto-grading with pass/fail results
- [ ] Progress tracking persisted in Firebase
- [ ] At least 5 topics with theory + assignments

### Non-Functional
- [ ] Page load < 3 seconds (Monaco lazy loaded)
- [ ] Python execution ready within 5 seconds (Pyodide init)
- [ ] SQL execution instant (PGlite)
- [ ] Works on desktop and tablet
- [ ] Total cost: $0/month
- [ ] Deployed on Vercel free tier

---

## Future Enhancements (When Budget Allows)

| Feature | Required Infrastructure | Est. Cost |
|---------|------------------------|-----------|
| AI resume parsing | Gemini Flash free tier | $0 |
| AI plan generation | Gemini Flash or Claude Haiku | $0-5/mo |
| AI code evaluation | Claude Sonnet | $5-15/mo |
| More languages (C++, Go, Rust) | Piston on Railway | $7-10/mo |
| User auth + profiles | Firebase Auth | $0 |
| Community features | Firebase + more Firestore | $0 |
| Custom domain | Vercel or Namecheap | $10/yr |

---

## Sources and References

- [Pyodide](https://pyodide.org/) — CPython in WebAssembly
- [PGlite](https://github.com/electric-sql/pglite) — PostgreSQL in WebAssembly
- [pdf.js](https://mozilla.github.io/pdf.js/) — PDF parsing in browser
- [mammoth.js](https://github.com/mwilliamson/mammoth.js) — DOCX to text in browser
- [JDoodle API](https://www.jdoodle.com/compiler-api) — Free code execution (200 req/day)
- [Monaco Editor React](https://github.com/suren-atoyan/monaco-react) — In-browser code editor
- [Firebase Firestore](https://firebase.google.com/docs/firestore) — Free tier database
- [Vercel](https://vercel.com/) — Free Next.js hosting
- [DOMPurify](https://github.com/cure53/DOMPurify) — XSS protection
