"use client";

import { useEffect, useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { useEditorStore } from "@/stores/useEditorStore";
import { getAssignmentById } from "@/lib/assignments";
import { executeCode, type Executors } from "@/lib/executors";
import { runTests } from "@/lib/testRunner";
import { usePyodide } from "@/hooks/usePyodide";
import { usePGlite } from "@/hooks/usePGlite";
import { useJavaExecution } from "@/hooks/useJavaExecution";
import {
  saveSubmission,
  getOrCreateSession,
  isFirebaseConfigured,
} from "@/lib/firebase";
import CodeEditor from "@/components/editor/CodeEditor";
import LanguageSelector from "@/components/editor/LanguageSelector";
import RunButton from "@/components/editor/RunButton";
import OutputPanel from "@/components/editor/OutputPanel";
import TestResults from "@/components/editor/TestResults";

export default function PracticePage() {
  const params = useParams();
  const questionId = params.questionId as string;
  const assignment = getAssignmentById(questionId);

  const {
    code,
    language,
    setCode,
    setLanguage,
    setOutput,
    setRunning,
    setTestResults,
    saveDraft,
    loadDraft,
  } = useEditorStore();

  const python = usePyodide();
  const sql = usePGlite();
  const java = useJavaExecution();
  const [activeTab, setActiveTab] = useState<"output" | "tests">("output");

  // Initialize editor with assignment starter code
  useEffect(() => {
    if (!assignment) return;
    const defaultLang = assignment.allowedLanguages[0];
    setLanguage(defaultLang);
    const starter = assignment.starterCode[defaultLang] || "";
    loadDraft(questionId, starter);
  }, [assignment, questionId, setLanguage, loadDraft]);

  // Auto-save drafts
  useEffect(() => {
    if (!assignment) return;
    const timer = setTimeout(() => {
      saveDraft(questionId);
    }, 1000);
    return () => clearTimeout(timer);
  }, [code, language, questionId, saveDraft, assignment]);

  const executors: Executors = {
    python,
    sql,
    java,
  };

  const handleRun = useCallback(async () => {
    if (!assignment) return;
    setRunning(true);
    setOutput("", null);
    setTestResults(null);
    setActiveTab("output");

    try {
      const result = await executeCode(language, code, executors);
      setOutput(result.stdout || "", result.error);
    } catch (e: any) {
      setOutput("", e.message);
    } finally {
      setRunning(false);
    }
  }, [assignment, language, code, executors, setRunning, setOutput, setTestResults]);

  const handleSubmit = useCallback(async () => {
    if (!assignment) return;
    setRunning(true);
    setTestResults(null);
    setActiveTab("tests");

    try {
      const results = await runTests(code, language, assignment.testCases, executors);
      setTestResults(results);

      const allPassed = results.every((r) => r.passed);

      // Save submission
      const submissionData = {
        topicId: assignment.topicTitle,
        assignmentId: assignment.id,
        code,
        language,
        passed: allPassed,
        output: results.map((r) => r.actualOutput).join("\n"),
      };

      // Save to localStorage
      try {
        const key = `prepwise_submission_${assignment.id}`;
        localStorage.setItem(key, JSON.stringify({ ...submissionData, submittedAt: new Date().toISOString() }));
      } catch {
        // ignore
      }

      // Save to Firebase
      if (isFirebaseConfigured()) {
        const sessionId = getOrCreateSession();
        if (sessionId) {
          await saveSubmission(sessionId, submissionData);
        }
      }
    } catch (e: any) {
      setOutput("", e.message);
    } finally {
      setRunning(false);
    }
  }, [assignment, code, language, executors, setRunning, setTestResults, setOutput]);

  const handleLanguageChange = useCallback(
    (lang: typeof language) => {
      if (!assignment) return;
      saveDraft(questionId);
      const starter = assignment.starterCode[lang] || "";
      loadDraft(questionId, starter);
    },
    [assignment, questionId, saveDraft, loadDraft],
  );

  if (!assignment) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 glass">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <a href="/plan" className="text-sm text-text-muted hover:text-foreground transition-colors">
              &larr; Back to Plan
            </a>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="text-sm text-text-dim">Assignment not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="shrink-0 glass z-40">
        <div className="max-w-full mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/plan"
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-foreground transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Plan
            </a>
            <span className="text-border-subtle">/</span>
            <h1 className="text-sm font-semibold text-foreground/90">{assignment.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector
              allowedLanguages={assignment.allowedLanguages}
              onLanguageChange={handleLanguageChange}
            />
            <RunButton onRun={handleRun} onSubmit={handleSubmit} />
          </div>
        </div>
      </header>

      {/* Main content - split layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel - Problem description */}
        <div className="w-[35%] min-w-[300px] border-r border-border-subtle overflow-y-auto p-5 space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-foreground/80 mb-3">{assignment.title}</h2>
            <div className="text-xs text-text-muted leading-relaxed whitespace-pre-wrap">
              {assignment.description}
            </div>
          </div>

          {/* Visible test cases */}
          <div>
            <h3 className="text-xs font-semibold text-text-dim uppercase tracking-wider mb-2">
              Test Cases
            </h3>
            <div className="space-y-2">
              {assignment.testCases.map((tc, i) => (
                <div key={tc.id} className="rounded-lg bg-surface-elevated border border-border-subtle p-3">
                  <div className="text-[10px] text-text-dim mb-1.5">Test {i + 1}: {tc.description}</div>
                  <div className="space-y-1">
                    {tc.input && (
                      <div className="text-[10px]">
                        <span className="text-text-dim">Input: </span>
                        <code className="text-foreground/70 bg-surface px-1 py-0.5 rounded font-mono">
                          {tc.input.replace(/\n/g, " \\n ")}
                        </code>
                      </div>
                    )}
                    <div className="text-[10px]">
                      <span className="text-text-dim">Expected: </span>
                      <code className="text-emerald-glow/70 bg-surface px-1 py-0.5 rounded font-mono">
                        {tc.expectedOutput}
                      </code>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel - Editor + Output */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Code editor */}
          <div className="flex-1 min-h-0 p-2">
            <CodeEditor onRun={handleRun} />
          </div>

          {/* Output / Test Results tabs */}
          <div className="h-[35%] min-h-[150px] border-t border-border-subtle flex flex-col">
            <div className="shrink-0 flex gap-1 px-2 pt-2">
              <button
                onClick={() => setActiveTab("output")}
                className={`px-3 py-1 rounded-t-lg text-[10px] font-medium transition-colors ${
                  activeTab === "output"
                    ? "text-emerald-glow bg-surface border border-b-0 border-border-subtle"
                    : "text-text-dim hover:text-text-muted"
                }`}
              >
                Output
              </button>
              <button
                onClick={() => setActiveTab("tests")}
                className={`px-3 py-1 rounded-t-lg text-[10px] font-medium transition-colors ${
                  activeTab === "tests"
                    ? "text-cyan-glow bg-surface border border-b-0 border-border-subtle"
                    : "text-text-dim hover:text-text-muted"
                }`}
              >
                Test Results
              </button>
            </div>
            <div className="flex-1 overflow-auto p-2">
              {activeTab === "output" ? <OutputPanel /> : <TestResults />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
