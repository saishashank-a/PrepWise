"use client";

import { useProfileStore } from "@/stores/useProfileStore";

export default function GapView() {
  const { skills, jdSkills, getGapAnalysis } = useProfileStore();

  if (skills.length === 0 && jdSkills.length === 0) {
    return (
      <div className="rounded-xl border border-border-subtle bg-surface-elevated/50 p-8 text-center">
        <p className="text-sm text-text-dim">
          Add your skills and job description requirements to see the gap analysis.
        </p>
      </div>
    );
  }

  const gaps = getGapAnalysis();
  const matches = gaps.filter((g) => g.inResume && g.inJD);
  const missing = gaps.filter((g) => !g.inResume && g.inJD);
  const extra = gaps.filter((g) => g.inResume && !g.inJD);

  return (
    <div className="space-y-6">
      {/* Action */}
      {missing.length > 0 && (
        <a
          href="/plan"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium
                     bg-emerald-glow/10 text-emerald-glow border border-emerald-glow/20
                     hover:bg-emerald-glow/15 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
          </svg>
          Create Study Plan to Close {missing.length} Gap{missing.length > 1 ? "s" : ""}
        </a>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-emerald-glow/[0.05] border border-emerald-glow/10 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-glow" style={{ fontFamily: "var(--font-cabinet)" }}>
            {matches.length}
          </div>
          <div className="text-xs text-text-muted mt-1">Matches</div>
        </div>
        <div className="rounded-xl bg-red-500/[0.05] border border-red-500/10 p-4 text-center">
          <div className="text-2xl font-bold text-red-400" style={{ fontFamily: "var(--font-cabinet)" }}>
            {missing.length}
          </div>
          <div className="text-xs text-text-muted mt-1">Gaps</div>
        </div>
        <div className="rounded-xl bg-blue-500/[0.05] border border-blue-500/10 p-4 text-center">
          <div className="text-2xl font-bold text-blue-400" style={{ fontFamily: "var(--font-cabinet)" }}>
            {extra.length}
          </div>
          <div className="text-xs text-text-muted mt-1">Extra Skills</div>
        </div>
      </div>

      {/* Detailed List */}
      <div className="rounded-xl border border-border-subtle overflow-hidden">
        <div className="grid grid-cols-3 gap-px bg-border-subtle text-xs font-medium text-text-dim">
          <div className="bg-surface-elevated px-4 py-2.5">Skill</div>
          <div className="bg-surface-elevated px-4 py-2.5 text-center">Your Resume</div>
          <div className="bg-surface-elevated px-4 py-2.5 text-center">Job Requires</div>
        </div>

        <div className="divide-y divide-border-subtle">
          {/* Gaps first (most important) */}
          {missing.map((item) => (
            <div key={item.skill} className="grid grid-cols-3 gap-px bg-border-subtle">
              <div className="bg-surface px-4 py-3 text-sm text-foreground/90">{item.skill}</div>
              <div className="bg-surface px-4 py-3 text-center">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500/10">
                  <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              </div>
              <div className="bg-surface px-4 py-3 text-center">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-glow/10">
                  <svg className="w-3 h-3 text-cyan-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </div>
            </div>
          ))}

          {/* Matches */}
          {matches.map((item) => (
            <div key={item.skill} className="grid grid-cols-3 gap-px bg-border-subtle">
              <div className="bg-surface px-4 py-3 text-sm text-foreground/90">{item.skill}</div>
              <div className="bg-surface px-4 py-3 text-center">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-glow/10">
                  <svg className="w-3 h-3 text-emerald-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </div>
              <div className="bg-surface px-4 py-3 text-center">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-glow/10">
                  <svg className="w-3 h-3 text-emerald-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </div>
            </div>
          ))}

          {/* Extra skills */}
          {extra.map((item) => (
            <div key={item.skill} className="grid grid-cols-3 gap-px bg-border-subtle">
              <div className="bg-surface px-4 py-3 text-sm text-foreground/90 opacity-60">{item.skill}</div>
              <div className="bg-surface px-4 py-3 text-center">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/10">
                  <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </div>
              <div className="bg-surface px-4 py-3 text-center">
                <span className="text-xs text-text-dim">—</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
