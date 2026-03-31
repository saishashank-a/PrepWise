"use client";

import type { Assignment } from "@/lib/assignments";

const LANG_COLORS: Record<string, string> = {
  python: "text-[#191c1c] bg-[#f2f4f3]",
  javascript: "text-[#474747] bg-[#f2f4f3]",
  sql: "text-[#191c1c] bg-[#e6e9e8]",
  java: "text-[#474747] bg-[#f2f4f3]",
};

interface AssignmentCardProps {
  assignment: Assignment;
  completed?: boolean;
}

export default function AssignmentCard({ assignment, completed }: AssignmentCardProps) {
  return (
    <a
      href={`/practice/${assignment.id}`}
      className={`block rounded-xl border p-4 transition-all hover:border-[#c6c6c6] hover:bg-surface ${
        completed
          ? "bg-[#e6e9e8] border-[#c6c6c6]"
          : "bg-white border-border-default"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {completed && (
              <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            <h4 className="text-sm font-semibold text-foreground truncate">{assignment.title}</h4>
          </div>
          <p className="text-xs text-text-muted line-clamp-2 mb-2">
            {assignment.description.split("\n")[0]}
          </p>
          <div className="flex items-center gap-2">
            {assignment.allowedLanguages.map((lang) => (
              <span
                key={lang}
                className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${LANG_COLORS[lang] || "text-text-muted bg-surface"}`}
              >
                {lang}
              </span>
            ))}
            <span className="text-[10px] text-text-muted">
              {assignment.testCases.length} test{assignment.testCases.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <svg className="w-4 h-4 text-text-muted shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
}
