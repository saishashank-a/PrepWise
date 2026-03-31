"use client";

import { useEditorStore } from "@/stores/useEditorStore";

export default function TestResults() {
  const { testResults } = useEditorStore();

  if (!testResults) {
    return (
      <div className="h-full flex flex-col rounded-xl border border-border-default overflow-hidden">
        <div className="px-3 py-2 bg-white border-b border-border-default flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Test Results</span>
        </div>
        <div className="flex-1 p-3 bg-surface">
          <p className="text-xs text-text-muted italic">Click Submit to run test cases.</p>
        </div>
      </div>
    );
  }

  const passed = testResults.filter((r) => r.passed).length;
  const total = testResults.length;
  const allPassed = passed === total;

  return (
    <div className="h-full flex flex-col rounded-xl border border-border-default overflow-hidden">
      <div className="px-3 py-2 bg-white border-b border-border-default flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Test Results</span>
        </div>
        <span className={`text-xs font-bold ${allPassed ? "text-primary" : "text-[#474747]"}`}>
          {passed}/{total} passed
        </span>
      </div>
      <div className="flex-1 overflow-auto p-2 bg-surface space-y-1.5">
        {testResults.map((result, i) => (
          <div
            key={result.testCase.id}
            className={`rounded-lg border p-2.5 ${
              result.passed
                ? "bg-[#e6e9e8] border-[#c6c6c6]"
                : "bg-[#f2f4f3] border-[#c6c6c6]"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {result.passed ? (
                <svg className="w-3.5 h-3.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-[#474747] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <span className="text-xs font-medium text-foreground">
                Test {i + 1}: {result.testCase.description}
              </span>
            </div>
            {!result.passed && (
              <div className="ml-5.5 space-y-1 mt-1.5">
                <div className="text-[10px]">
                  <span className="text-text-muted">Expected: </span>
                  <code className="text-primary bg-white px-1 py-0.5 rounded">
                    {result.testCase.expectedOutput}
                  </code>
                </div>
                <div className="text-[10px]">
                  <span className="text-text-muted">Got: </span>
                  <code className="text-[#474747] bg-white px-1 py-0.5 rounded">
                    {result.actualOutput || "(empty)"}
                  </code>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
