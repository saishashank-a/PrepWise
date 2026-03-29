"use client";

import { useState } from "react";
import { useProfileStore } from "@/stores/useProfileStore";
import { usePlanStore } from "@/stores/usePlanStore";
import { generateStudyPlanTopics, isAIConfigured } from "@/lib/ai";
import { templateToTopic } from "@/lib/templates";
import type { TopicType, Difficulty } from "@/lib/types";

// Map gap skills to sensible topic types
function guessTopicType(skill: string): TopicType {
  const lower = skill.toLowerCase();
  if (/sql|postgres|mysql|database|query/i.test(lower)) return "sql";
  if (/system design|architecture|scalab/i.test(lower)) return "system-design";
  if (/behavioral|leadership|communication/i.test(lower)) return "behavioral";
  if (/design pattern|oop|concept/i.test(lower)) return "conceptual";
  return "coding";
}

export default function GapView() {
  const { skills, jdSkills, getGapAnalysis } = useProfileStore();
  const { plan, createPlan, addTopic, persist } = usePlanStore();
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    const gaps = getGapAnalysis();
    const missingSkills = gaps.filter((g) => !g.inResume && g.inJD).map((g) => g.skill);
    const resumeSkills = skills.map((s) => s.name);

    if (missingSkills.length === 0) return;

    setGenerating(true);
    setError(null);

    // Create plan first
    if (!plan) createPlan("Interview Prep Plan");

    let topics: { title: string; type: string; difficulty: string }[] = [];

    // Try AI generation if configured
    if (isAIConfigured()) {
      try {
        const aiTopics = await generateStudyPlanTopics(missingSkills, resumeSkills);
        if (aiTopics.length > 0) {
          topics = aiTopics;
        }
      } catch {
        // AI failed, will fall back to basic generation
      }
    }

    // Fallback: generate topics directly from gap skills
    if (topics.length === 0) {
      topics = missingSkills.map((skill) => ({
        title: skill,
        type: guessTopicType(skill),
        difficulty: "medium",
      }));
    }

    // Add topics to plan
    const currentPlan = usePlanStore.getState().plan;
    const startPriority = currentPlan ? currentPlan.topics.length + 1 : 1;

    for (let i = 0; i < topics.length; i++) {
      const t = topics[i];
      const topic = templateToTopic(
        {
          title: t.title,
          type: (t.type as TopicType) || "coding",
          difficulty: (t.difficulty as Difficulty) || "medium",
        },
        startPriority + i,
      );
      addTopic(topic);
    }

    // Persist to localStorage/Firebase
    await persist();
    setGenerated(true);
    setGenerating(false);
  };

  if (skills.length === 0 && jdSkills.length === 0) {
    return (
      <div className="rounded-xl border border-border-default bg-surface p-8 text-center">
        <p className="text-sm text-text-muted">
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
      {/* Actions */}
      {missing.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            {!generated ? (
              <>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium
                             bg-primary-light text-primary border border-primary-border
                             hover:bg-primary-light transition-colors
                             disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {generating ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  )}
                  {generating ? "Generating Study Plan..." : `Generate Study Plan (${missing.length} gaps)`}
                </button>
                <a
                  href="/plan"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium
                             text-text-secondary border border-border-default
                             hover:text-foreground hover:border-primary-border transition-colors"
                >
                  Build Manually
                </a>
              </>
            ) : (
              <a
                href="/plan"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium
                           bg-primary-light text-primary border border-primary-border
                           hover:bg-primary-light transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                View Study Plan ({usePlanStore.getState().plan?.topics.length || 0} topics)
              </a>
            )}
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-primary-light border border-primary-border p-4 text-center">
          <div className="text-2xl font-bold text-primary" style={{ fontFamily: "var(--font-cabinet)" }}>
            {matches.length}
          </div>
          <div className="text-xs text-text-secondary mt-1">Matches</div>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-center">
          <div className="text-2xl font-bold text-red-400" style={{ fontFamily: "var(--font-cabinet)" }}>
            {missing.length}
          </div>
          <div className="text-xs text-text-secondary mt-1">Gaps</div>
        </div>
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-400" style={{ fontFamily: "var(--font-cabinet)" }}>
            {extra.length}
          </div>
          <div className="text-xs text-text-secondary mt-1">Extra Skills</div>
        </div>
      </div>

      {/* Detailed List */}
      <div className="rounded-xl border border-border-default overflow-hidden">
        <div className="grid grid-cols-3 gap-px bg-border-default text-xs font-medium text-text-secondary">
          <div className="bg-surface-elevated px-4 py-2.5">Skill</div>
          <div className="bg-surface-elevated px-4 py-2.5 text-center">Your Resume</div>
          <div className="bg-surface-elevated px-4 py-2.5 text-center">Job Requires</div>
        </div>

        <div className="divide-y divide-border-default">
          {/* Gaps first (most important) */}
          {missing.map((item) => (
            <div key={item.skill} className="grid grid-cols-3 gap-px bg-border-default">
              <div className="bg-surface px-4 py-3 text-sm text-foreground">{item.skill}</div>
              <div className="bg-surface px-4 py-3 text-center">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-50">
                  <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </span>
              </div>
              <div className="bg-surface px-4 py-3 text-center">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-success-light">
                  <svg className="w-3 h-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </div>
            </div>
          ))}

          {/* Matches */}
          {matches.map((item) => (
            <div key={item.skill} className="grid grid-cols-3 gap-px bg-border-default">
              <div className="bg-surface px-4 py-3 text-sm text-foreground">{item.skill}</div>
              <div className="bg-surface px-4 py-3 text-center">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-light">
                  <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </div>
              <div className="bg-surface px-4 py-3 text-center">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-light">
                  <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </div>
            </div>
          ))}

          {/* Extra skills */}
          {extra.map((item) => (
            <div key={item.skill} className="grid grid-cols-3 gap-px bg-border-default">
              <div className="bg-surface px-4 py-3 text-sm text-foreground opacity-60">{item.skill}</div>
              <div className="bg-surface px-4 py-3 text-center">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-50">
                  <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              </div>
              <div className="bg-surface px-4 py-3 text-center">
                <span className="text-xs text-text-muted">—</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
