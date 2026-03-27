---
title: "feat: Code Editor + In-Browser Execution"
type: feat
status: active
date: 2026-03-27
---

# Code Editor + In-Browser Execution (Phase 3)

## Overview

Add a full code editor with in-browser execution to PrepWise. Users write code in Monaco Editor, run it against test cases, and get instant pass/fail feedback — all without a backend. Python runs via Pyodide (WebAssembly), SQL via PGlite (WebAssembly), JavaScript via sandboxed iframe, and Java via JDoodle free API.

## Problem Statement

Phase 2 gave users a study plan with topics, but no way to actually practice coding. The learn page currently shows placeholder text: "Code editor and practice problems will be available in Phase 3." Without hands-on practice and auto-graded feedback, the platform is just a todo list.

## Proposed Solution

Build a `/practice/[questionId]` page with Monaco Editor, multi-language execution, and a test runner. Create sample assignments per topic template with test cases. Wire up the learn page to show assignment cards that link to the practice page.

---

## Technical Approach

### New Dependencies

```bash
npm install @monaco-editor/react pyodide @electric-sql/pglite
```

### Data Model — Assignment Registry

Create a static assignment registry (`src/lib/assignments.ts`) since assignments are curated content, not user-generated.

```typescript
// src/lib/assignments.ts
export interface Assignment {
  id: string;
  topicTitle: string;          // Links to Topic.title from templates
  title: string;
  description: string;
  starterCode: Partial<Record<Language, string>>;
  allowedLanguages: Language[];
  testCases: TestCase[];
}
```

**Mapping strategy:** Assignments link to topics by `topicTitle` (matching the template title string). This avoids needing dynamic IDs since topic templates are static.

**Scope:** At least 2 assignments per coding/SQL topic template. Behavioral and system-design topics do NOT get code assignments.

### File Structure — New Files

```
src/
├── stores/
│   └── useEditorStore.ts          # Code, language, output, running state
├── hooks/
│   ├── usePyodide.ts              # Python WebAssembly execution
│   ├── usePGlite.ts               # SQL WebAssembly execution
│   └── useJavaExecution.ts        # JDoodle API wrapper
├── lib/
│   ├── executors.ts               # JS sandbox executor + language router
│   ├── testRunner.ts              # Run test cases, compare output
│   └── assignments.ts             # Static assignment registry
├── components/
│   ├── editor/
│   │   ├── CodeEditor.tsx         # Monaco Editor (lazy loaded)
│   │   ├── LanguageSelector.tsx   # Language dropdown
│   │   ├── RunButton.tsx          # Execute + Run Tests
│   │   ├── OutputPanel.tsx        # stdout/stderr/error display
│   │   └── TestResults.tsx        # Pass/fail per test case
│   └── learning/
│       └── AssignmentCard.tsx     # Assignment preview card
├── app/
│   └── practice/
│       └── [questionId]/
│           └── page.tsx           # Full practice page
public/
└── datasets/
    ├── ecommerce.sql
    ├── hr.sql
    └── analytics.sql
```

### Modified Files

| File | Change |
|------|--------|
| `src/app/learn/[topicId]/page.tsx` | Replace assignment placeholder with AssignmentCard list |
| `src/lib/firebase.ts` | Update `saveSubmission` to include `testResults`, add `getSubmissions` |
| `package.json` | Add 3 new dependencies |

---

## Implementation Phases

### Step 1: Dependencies + Store + Hooks

**Install packages and create the foundation layer.**

#### `src/stores/useEditorStore.ts`

Ephemeral store — code drafts auto-save to localStorage per `questionId:language` key, but no Firebase persistence (submissions are persisted separately on explicit submit).

```typescript
interface EditorState {
  code: string;
  language: Language;
  output: string;
  error: string | null;
  running: boolean;
  testResults: TestResult[] | null;

  setCode: (code: string) => void;
  setLanguage: (lang: Language) => void;
  setOutput: (output: string, error?: string | null) => void;
  setRunning: (running: boolean) => void;
  setTestResults: (results: TestResult[] | null) => void;
  reset: () => void;
  saveDraft: (questionId: string) => void;
  loadDraft: (questionId: string, starterCode: string) => void;
}
```

#### `src/hooks/usePyodide.ts`

- Lazy init on first `run()` call (not on mount)
- Show loading state during ~5s Pyodide init
- Capture stdout/stderr via `io.StringIO` redirection
- **Timeout:** 10 seconds via `setTimeout` + Pyodide interrupt buffer
- Returns `{ run, loading, ready, init }`

#### `src/hooks/usePGlite.ts`

- Lazy init on first `run()` call
- `loadDataset(name)` method fetches SQL from `/datasets/{name}.sql` and executes it
- **Read-only protection:** Re-init PGlite before each run to prevent dataset corruption from DROP/DELETE
- Returns result as `{ rows, fields, error }` — format rows as tab-separated string for test comparison
- Returns `{ run, ready, init, loadDataset }`

#### `src/hooks/useJavaExecution.ts`

- Direct `fetch()` to JDoodle API (client-side for MVP — keys are public, rate-limited to 200/day)
- Show clear error message when rate limit is exhausted
- **Timeout:** 15 seconds via `AbortController`
- Returns `{ run }`

#### `src/lib/executors.ts`

- JavaScript sandbox: `srcdoc` iframe with `sandbox="allow-scripts"` — NO `allow-same-origin`
- **Timeout:** 10 seconds, remove iframe on timeout
- Override `console.log` in iframe, capture via `postMessage`
- Language router: `executeCode(language, code, executors, stdin?)` dispatches to the right executor

**Deliverable:** All 4 execution paths working in isolation. Testable via browser console.

---

### Step 2: Test Runner + Assignments Data

#### `src/lib/testRunner.ts`

```typescript
export async function runTests(
  code: string,
  language: Language,
  testCases: TestCase[],
  executors: Executors,
): Promise<TestResult[]>
```

- For Python/JS/Java: pipe `testCase.input` as stdin, compare trimmed stdout to `testCase.expectedOutput`
- For SQL: execute code, format result set as `field1\tfield2\n` rows, compare to expected
- Each test case runs independently (fresh execution context if feasible)

#### `src/lib/assignments.ts`

Static registry with ~20 assignments covering the coding/SQL templates:

| Topic | Assignments |
|-------|-------------|
| Arrays & Strings | Two Sum, Reverse String |
| Hash Maps & Sets | First Unique Character, Group Anagrams |
| Two Pointers | Valid Palindrome, Container With Most Water |
| Binary Search | Search Insert Position, Find Peak Element |
| Stacks & Queues | Valid Parentheses, Min Stack |
| Linked Lists | Reverse Linked List, Merge Two Sorted Lists |
| SELECT & Filtering | Find employees above salary, Filter by date range |
| JOINs | Employee-Department join, Orders with customer names |
| GROUP BY & Aggregations | Department salary stats, Top N categories |
| Closures & Scope | Counter function, Memoize |
| Promises & Async/Await | Sequential fetch, Parallel fetch with Promise.all |

Each assignment has: `id`, `topicTitle`, `title`, `description`, `starterCode`, `allowedLanguages`, `testCases[]`.

#### `public/datasets/`

Three SQL schemas:
- `ecommerce.sql`: products, orders, customers, order_items
- `hr.sql`: employees, departments, salaries
- `analytics.sql`: events, users, sessions

**Deliverable:** Test runner works end-to-end. Assignment data ready for UI.

---

### Step 3: Editor Components

All components follow existing patterns: `"use client"`, default export, inline SVG icons, Tailwind dark theme.

#### `src/components/editor/CodeEditor.tsx`

- Monaco Editor via `next/dynamic` (SSR disabled, lazy loaded)
- `vs-dark` theme, JetBrains Mono font
- `minimap: false`, `wordWrap: on`, `fontSize: 14`
- Keyboard shortcut: Cmd/Ctrl+Enter to run code

#### `src/components/editor/LanguageSelector.tsx`

- Dropdown showing only `assignment.allowedLanguages`
- On change: load starter code for new language, save draft of current

#### `src/components/editor/RunButton.tsx`

- Two modes: "Run" (execute only) and "Submit" (run all tests + save to Firebase)
- Loading spinner during execution
- Disabled while `running === true`

#### `src/components/editor/OutputPanel.tsx`

- Tabbed: "Output" | "Test Results"
- Output tab: monospace text, green for stdout, red for stderr/errors
- Shows execution time
- All user code output rendered as plain text inside `<pre>` elements (never as HTML)

#### `src/components/editor/TestResults.tsx`

- List of test cases with pass/fail icons
- Show: description, expected output, actual output (for failed tests)
- Summary: "3/5 passed"
- Green checkmark / red X per test case (matching existing icon patterns)

#### `src/components/learning/AssignmentCard.tsx`

- Compact card showing: title, difficulty indicator, language badges, completion status
- Links to `/practice/{assignmentId}`
- Shows green checkmark if previously submitted with `passed: true`

**Deliverable:** All editor UI components built and styled.

---

### Step 4: Practice Page + Integration

#### `src/app/practice/[questionId]/page.tsx`

Layout:
```
┌──────────────────────────────────────────────┐
│ Header: Back to Topic  |  Assignment Title   │
├────────────────────┬─────────────────────────┤
│ Problem Description│ CodeEditor              │
│ (scrollable)       │                         │
│                    │                         │
│ Test Cases (input/ │                         │
│ expected shown)    ├─────────────────────────┤
│                    │ LanguageSelector | Run   │
│                    ├─────────────────────────┤
│                    │ OutputPanel / TestResults│
└────────────────────┴─────────────────────────┘
```

- Left panel: problem description + visible test cases (30% width)
- Right panel: code editor top (60% height), output bottom (40% height)
- On mobile: stacked layout (description then editor then output)
- Load assignment by `questionId` from registry
- Auto-save drafts on code change (debounced 1s)
- "Submit" saves to Firebase via `saveSubmission()`

#### Update `src/app/learn/[topicId]/page.tsx`

- Import assignments for the current topic from `assignments.ts`
- Replace placeholder with list of `AssignmentCard` components
- Show "No coding assignments" for behavioral/system-design topics

#### Update `src/lib/firebase.ts`

- Update `saveSubmission` signature to include `testResults`
- Add `getSubmissionsByTopic(sessionId, topicId)` to show completion state

**Deliverable:** Full end-to-end flow works: plan -> topic -> assignment -> code -> run -> test -> submit.

---

## System-Wide Impact

### Interaction Graph

1. User clicks assignment card on `/learn/[topicId]` navigates to `/practice/[questionId]`
2. Practice page loads assignment from static registry, initializes `useEditorStore` with starter code
3. User clicks "Run": `executors.ts` routes to correct hook, hook initializes runtime (WASM/iframe/API), returns output, store updated, OutputPanel re-renders
4. User clicks "Submit": `testRunner.ts` runs all test cases, results stored in `useEditorStore`, TestResults re-renders, if all pass then `saveSubmission()` writes to Firebase + localStorage
5. On return to `/learn/[topicId]`, `getSubmissionsByTopic()` checks Firebase, AssignmentCards show completion status

### Performance Risks

| Risk | Mitigation |
|------|-----------|
| Pyodide WASM ~15-20MB download | Lazy load on first Run, show loading bar, rely on browser HTTP cache |
| PGlite WASM ~5-10MB | Same lazy approach |
| Monaco ~3MB | `next/dynamic` with SSR disabled |
| Multiple WASM runtimes in memory | Only one active at a time (language selection unloads previous) |

### Security

| Risk | Mitigation |
|------|-----------|
| Infinite loops (Python/JS) | 10s timeout, iframe removal, Pyodide interrupt |
| XSS from user code output | OutputPanel renders as plain text in pre elements, never as HTML |
| JS sandbox escape | srcdoc iframe with sandbox allow-scripts only, no allow-same-origin |
| SQL dataset corruption | Re-init PGlite instance before each execution |
| JDoodle key exposure | Acceptable for MVP (200 req/day limit). Move to API route in future |

---

## Acceptance Criteria

### Functional

- [ ] Monaco Editor loads and supports Python, JavaScript, SQL, Java syntax
- [ ] Python code executes via Pyodide with stdout/stderr capture
- [ ] SQL code executes via PGlite with pre-loaded datasets
- [ ] JavaScript code executes via sandboxed iframe
- [ ] Java code executes via JDoodle API
- [ ] All executors have 10-15s timeout protection
- [ ] Test runner validates output against test cases
- [ ] Pass/fail displayed per test case with expected vs actual
- [ ] Submissions persist to localStorage + Firebase
- [ ] At least 20 assignments across coding and SQL topics
- [ ] 3 SQL datasets (ecommerce, HR, analytics) with realistic schemas
- [ ] Learn page shows assignment cards with completion status
- [ ] Practice page has split layout: description left, editor right
- [ ] Cmd/Ctrl+Enter keyboard shortcut runs code
- [ ] Code drafts auto-save to localStorage

### Non-Functional

- [ ] Monaco lazy loads (not in initial bundle)
- [ ] Pyodide ready within 5-10 seconds on first run
- [ ] Production build passes with 0 TypeScript errors
- [ ] Practice page works on desktop browsers (Chrome, Firefox, Safari)

---

## Dependencies and Risks

| Dependency | Risk | Mitigation |
|-----------|------|-----------|
| `@monaco-editor/react` | Next.js 16 dynamic import compatibility | Verify against Next.js 16 docs |
| `pyodide` | Large bundle, slow first load | Lazy init, loading state, HTTP cache |
| `@electric-sql/pglite` | API may differ from plan reference code | Check latest docs at install time |
| JDoodle API | 200 req/day shared across all users | Clear error message, encourage Python/JS |
| Next.js 16 `dynamic()` | API may have changed from training data | Read Next.js 16 docs before implementing |

---

## Implementation Order Summary

| Step | Files | Depends On |
|------|-------|-----------|
| 1. Dependencies + Store + Hooks | `useEditorStore.ts`, `usePyodide.ts`, `usePGlite.ts`, `useJavaExecution.ts`, `executors.ts` | npm install |
| 2. Test Runner + Assignments | `testRunner.ts`, `assignments.ts`, `public/datasets/*.sql` | Step 1 |
| 3. Editor Components | `CodeEditor.tsx`, `LanguageSelector.tsx`, `RunButton.tsx`, `OutputPanel.tsx`, `TestResults.tsx`, `AssignmentCard.tsx` | Step 1 |
| 4. Practice Page + Integration | `practice/[questionId]/page.tsx`, update `learn/[topicId]/page.tsx`, update `firebase.ts` | Steps 2+3 |

Steps 2 and 3 can run in parallel after Step 1.

---

## Sources and References

- [Pyodide docs](https://pyodide.org/en/stable/) — Python in WebAssembly
- [PGlite README](https://github.com/electric-sql/pglite) — PostgreSQL in WebAssembly
- [Monaco React](https://github.com/suren-atoyan/monaco-react) — Editor component
- [JDoodle API](https://www.jdoodle.com/compiler-api) — Java execution
- Master plan: `docs/plans/2026-03-26-001-feat-prepwise-ai-interview-prep-platform-plan.md` (Phase 3 at line 706)
- Existing patterns: `src/stores/useProfileStore.ts`, `src/components/plan/TopicCard.tsx`
