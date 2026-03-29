"use client";

import type { ATSScore } from "@/lib/resumeTypes";

export default function ScoreDisplay({ score }: { score: ATSScore }) {
  const ringColor = score.overall >= 80 ? "#10b981" : score.overall >= 60 ? "#f59e0b" : "#f43f5e";

  return (
    <div className="space-y-4">
      {/* Score ring */}
      <div className="flex justify-center">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="6" />
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
            <span className="text-[10px] text-text-muted">out of 100</span>
          </div>
        </div>
      </div>

      {/* Sub-score cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Keyword Match", value: score.keywordMatch },
          { label: "Formatting", value: score.formatting },
          { label: "Sections", value: score.sectionStructure },
          { label: "Action Verbs", value: score.actionVerbs },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-xl p-3 text-center ${
              item.value >= 70
                ? "bg-primary-light border border-primary-border"
                : item.value >= 50
                  ? "bg-amber-50 border border-amber-200"
                  : "bg-red-50 border border-red-200"
            }`}
          >
            <div
              className={`text-xl font-bold ${
                item.value >= 70 ? "text-primary" : item.value >= 50 ? "text-yellow-400" : "text-red-400"
              }`}
              style={{ fontFamily: "var(--font-cabinet)" }}
            >
              {item.value}%
            </div>
            <div className="text-xs text-text-secondary mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Missing keywords */}
      {score.missingKeywords.length > 0 && (
        <div className="rounded-xl p-3 bg-primary-light border border-primary-border">
          <div className="text-xs font-semibold text-primary mb-2">Missing Keywords</div>
          <div className="flex flex-wrap gap-1.5">
            {score.missingKeywords.map((kw) => (
              <span key={kw} className="text-[11px] px-2.5 py-1 rounded-md bg-red-50 text-red-400">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Formatting issues */}
      {score.formattingIssues.length > 0 && (
        <div className="rounded-xl p-3 bg-blue-50 border border-blue-200">
          <div className="text-xs font-semibold text-blue-400 mb-2">Formatting Issues</div>
          <div className="space-y-1.5">
            {score.formattingIssues.map((issue, i) => (
              <div key={i} className="flex items-start gap-2 text-[13px] text-text-secondary">
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
