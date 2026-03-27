"use client";

import type { Assignment } from "@/lib/assignments";

const LANG_COLORS: Record<string, string> = {
  python: "text-blue-400 bg-blue-500/10",
  javascript: "text-yellow-400 bg-yellow-500/10",
  sql: "text-cyan-glow bg-cyan-glow/10",
  java: "text-orange-400 bg-orange-500/10",
};

interface AssignmentCardProps {
  assignment: Assignment;
  completed?: boolean;
}

export default function AssignmentCard({ assignment, completed }: AssignmentCardProps) {
  return (
    <a
      href={`/practice/${assignment.id}`}
      className={`block rounded-xl border p-4 transition-all hover:border-emerald-glow/20 hover:bg-surface-elevated/80 ${
        completed
          ? "bg-emerald-glow/[0.02] border-emerald-glow/10"
          : "bg-surface-elevated/50 border-border-subtle"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {completed && (
              <svg className="w-4 h-4 text-emerald-glow shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            <h4 className="text-sm font-semibold text-foreground/90 truncate">{assignment.title}</h4>
          </div>
          <p className="text-xs text-text-muted line-clamp-2 mb-2">
            {assignment.description.split("\n")[0]}
          </p>
          <div className="flex items-center gap-2">
            {assignment.allowedLanguages.map((lang) => (
              <span
                key={lang}
                className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${LANG_COLORS[lang] || "text-text-dim bg-surface-elevated"}`}
              >
                {lang}
              </span>
            ))}
            <span className="text-[10px] text-text-dim">
              {assignment.testCases.length} test{assignment.testCases.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <svg className="w-4 h-4 text-text-dim shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
}
