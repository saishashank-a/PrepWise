"use client";

import { useState } from "react";
import { evaluateCode, isAIConfigured } from "@/lib/ai";
import type { TestResult } from "@/lib/types";
import ReactMarkdown from "react-markdown";

interface AIFeedbackProps {
  code: string;
  language: string;
  problemDescription: string;
  testResults: TestResult[];
}

export default function AIFeedback({ code, language, problemDescription, testResults }: AIFeedbackProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isAIConfigured()) return null;

  const handleGetFeedback = async () => {
    setLoading(true);
    try {
      const result = await evaluateCode(
        code,
        language,
        problemDescription,
        testResults.map((r) => ({
          passed: r.passed,
          description: r.testCase.description,
          actualOutput: r.actualOutput,
          expectedOutput: r.testCase.expectedOutput,
        })),
      );
      setFeedback(result);
    } catch {
      setFeedback("Unable to generate feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-cyan-glow/10 bg-cyan-glow/[0.02] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          <span className="text-xs font-medium text-cyan-glow">AI Coach</span>
        </div>
        {!feedback && (
          <button
            onClick={handleGetFeedback}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg text-[10px] font-medium bg-cyan-glow/10 text-cyan-glow
                       border border-cyan-glow/20 hover:bg-cyan-glow/15 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing..." : "Get AI Feedback"}
          </button>
        )}
      </div>
      {feedback && (
        <div className="prose-prepwise text-xs">
          <ReactMarkdown>{feedback}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
