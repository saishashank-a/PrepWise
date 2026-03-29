"use client";

import { useEditorStore } from "@/stores/useEditorStore";

export default function OutputPanel() {
  const { output, error } = useEditorStore();

  const hasOutput = output || error;

  return (
    <div className="h-full flex flex-col rounded-xl border border-border-default overflow-hidden">
      <div className="px-3 py-2 bg-white border-b border-border-default flex items-center gap-2">
        <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Output</span>
      </div>
      <div className="flex-1 overflow-auto p-3 bg-surface">
        {hasOutput ? (
          <pre
            className={`text-xs font-mono leading-relaxed whitespace-pre-wrap break-words ${
              error ? "text-red-500" : "text-primary"
            }`}
          >
            {error ? `Error: ${error}` : output}
          </pre>
        ) : (
          <p className="text-xs text-text-muted italic">Run your code to see output here.</p>
        )}
      </div>
    </div>
  );
}
