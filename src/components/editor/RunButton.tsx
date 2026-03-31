"use client";

import { useEditorStore } from "@/stores/useEditorStore";

interface RunButtonProps {
  onRun: () => void;
  onSubmit: () => void;
}

export default function RunButton({ onRun, onSubmit }: RunButtonProps) {
  const { running } = useEditorStore();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onRun}
        disabled={running}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium
                   bg-[#f2f4f3] text-primary border border-[#c6c6c6]
                   hover:bg-[#f2f4f3] transition-colors
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {running ? (
          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
        {running ? "Running..." : "Run"}
      </button>

      <button
        onClick={onSubmit}
        disabled={running}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium
                   bg-[#e6e9e8] text-success border border-[#c6c6c6]
                   hover:bg-[#e6e9e8] transition-colors
                   disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Submit
      </button>
    </div>
  );
}
