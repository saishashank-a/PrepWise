"use client";

import type { ATSScore } from "@/lib/resumeTypes";

function scoreLabel(value: number): string {
  if (value >= 80) return "Excellent";
  if (value >= 60) return "Good";
  if (value >= 40) return "Fair";
  return "Needs Work";
}

export default function ScoreDisplay({ score }: { score: ATSScore }) {
  return (
    <div className="space-y-4">
      {/* Score ring */}
      <div className="flex justify-center">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#e1e3e2" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="42" fill="none"
              stroke="#191c1c"
              strokeWidth="6"
              strokeLinecap="butt"
              strokeDasharray={`${score.overall * 2.64} 264`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-3xl font-black text-black tracking-tighter"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {score.overall}
            </span>
            <span className="text-[10px] text-[#777]">out of 100</span>
          </div>
        </div>
      </div>

      {/* Overall label */}
      <div className="text-center">
        <span className="text-xs font-medium text-[#474747] bg-[#e6e9e8] px-3 py-1 rounded-full">
          {scoreLabel(score.overall)}
        </span>
      </div>

      {/* Sub-score breakdown bars */}
      <div className="space-y-3">
        {[
          { label: "Keyword Match", value: score.keywordMatch },
          { label: "Formatting", value: score.formatting },
          { label: "Sections", value: score.sectionStructure },
          { label: "Action Verbs", value: score.actionVerbs },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#474747]">{item.label}</span>
              <span className="text-xs font-semibold text-black">{item.value}%</span>
            </div>
            <div className="h-1.5 bg-[#e1e3e2] rounded-none overflow-hidden">
              <div
                className="h-full bg-black rounded-none transition-all duration-500"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Missing keywords */}
      {score.missingKeywords.length > 0 && (
        <div className="rounded-2xl p-4 bg-white border border-black/[0.06]">
          <div className="text-xs font-semibold text-black mb-2">Missing Keywords</div>
          <div className="flex flex-wrap gap-1.5">
            {score.missingKeywords.map((kw) => (
              <span key={kw} className="text-[11px] px-2.5 py-1 rounded-md bg-[#e6e9e8] text-[#474747]">
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Formatting issues */}
      {score.formattingIssues.length > 0 && (
        <div className="rounded-2xl p-4 bg-white border border-black/[0.06]">
          <div className="text-xs font-semibold text-black mb-2">Formatting Issues</div>
          <div className="space-y-1.5">
            {score.formattingIssues.map((issue, i) => (
              <div key={i} className="flex items-start gap-2 text-[13px] text-[#474747]">
                <svg className="w-3 h-3 mt-0.5 shrink-0 text-[#777]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
