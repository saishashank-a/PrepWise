"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePlanStore } from "@/stores/usePlanStore";
import { getAssignmentsByTopic } from "@/lib/assignments";
import { getTopicContent } from "@/lib/topicContent";
import AssignmentCard from "@/components/learning/AssignmentCard";
import TheoryPanel from "@/components/learning/TheoryPanel";
import ExampleViewer from "@/components/learning/ExampleViewer";
import type { Topic } from "@/lib/types";

const STATUS_LABELS = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
} as const;

const PLACEHOLDER_CONTENT: Record<string, string> = {
  coding:
    "This topic covers fundamental coding concepts and problem-solving patterns. Practice with the code editor to build your skills.",
  sql:
    "Master SQL queries from basic SELECT statements to advanced window functions. Practice with real database schemas.",
  conceptual:
    "Understand the theory behind key computer science concepts. Review explanations and test your understanding.",
  "system-design":
    "Learn to design scalable systems. Understand trade-offs between different architectural approaches.",
  behavioral:
    "Prepare structured answers using the STAR method. Practice common behavioral interview questions.",
};

export default function LearnTopicPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  const { plan, load, loaded, updateTopicStatus } = usePlanStore();
  const [topic, setTopic] = useState<Topic | null>(null);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (loaded && plan) {
      const found = plan.topics.find((t) => t.id === topicId);
      setTopic(found || null);
    }
  }, [loaded, plan, topicId]);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-text-dim">Loading...</div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-40 glass">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <a href="/plan" className="text-sm text-text-muted hover:text-foreground transition-colors">
              &larr; Back to Plan
            </a>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-20 text-center">
          <p className="text-sm text-text-dim">Topic not found. Go back to your study plan.</p>
        </main>
      </div>
    );
  }

  const placeholderContent = PLACEHOLDER_CONTENT[topic.type] || PLACEHOLDER_CONTENT.coding;
  const topicContent = getTopicContent(topic.title);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a href="/plan" className="flex items-center gap-2 text-sm text-text-muted hover:text-foreground transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Plan
          </a>

          <div className="flex items-center gap-2">
            {topic.status !== "completed" && (
              <button
                onClick={() => {
                  const next = topic.status === "not_started" ? "in_progress" : "completed";
                  updateTopicStatus(topic.id, next);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-glow/10 text-emerald-glow
                           border border-emerald-glow/20 hover:bg-emerald-glow/15 transition-colors"
              >
                {topic.status === "not_started" ? "Start Learning" : "Mark Complete"}
              </button>
            )}
            {topic.status === "completed" && (
              <span className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-glow bg-emerald-glow/[0.05] border border-emerald-glow/20">
                Completed
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="space-y-8">
          {/* Topic header */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-surface-elevated border border-border-subtle text-text-muted capitalize">
                {topic.type.replace("-", " ")}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-md ${
                topic.difficulty === "easy"
                  ? "text-emerald-glow bg-emerald-glow/10"
                  : topic.difficulty === "medium"
                    ? "text-yellow-400 bg-yellow-500/10"
                    : "text-red-400 bg-red-500/10"
              }`}>
                {topic.difficulty}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-md ${
                topic.status === "completed"
                  ? "text-emerald-glow bg-emerald-glow/10"
                  : topic.status === "in_progress"
                    ? "text-yellow-400 bg-yellow-500/10"
                    : "text-text-dim bg-surface-elevated"
              }`}>
                {STATUS_LABELS[topic.status]}
              </span>
            </div>
            <h1
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-cabinet)" }}
            >
              {topic.title}
            </h1>
          </div>

          {/* Theory section */}
          <div className="rounded-xl border border-border-subtle bg-surface-elevated/50 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
              <svg className="w-4 h-4 text-cyan-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              Theory
            </h2>
            {topicContent ? (
              <TheoryPanel content={topicContent.theory} />
            ) : (
              <p className="text-sm text-text-muted leading-relaxed">{placeholderContent}</p>
            )}
          </div>

          {/* Examples section */}
          {topicContent && topicContent.examples.length > 0 && (
            <div className="rounded-xl border border-border-subtle bg-surface-elevated/50 p-6 space-y-4">
              <h2 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                </svg>
                Code Examples
              </h2>
              <ExampleViewer examples={topicContent.examples} />
            </div>
          )}

          {/* Assignments section */}
          {(() => {
            const assignments = getAssignmentsByTopic(topic.title);
            if (assignments.length === 0) {
              return (
                <div className="rounded-xl border border-border-subtle bg-surface-elevated/50 p-6 space-y-4">
                  <h2 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                    </svg>
                    Practice
                  </h2>
                  <p className="text-xs text-text-dim">
                    No coding assignments for this topic type. Track your progress by updating the status above.
                  </p>
                </div>
              );
            }

            return (
              <div className="rounded-xl border border-border-subtle bg-surface-elevated/50 p-6 space-y-4">
                <h2 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                  Practice Assignments
                  <span className="text-[10px] text-text-dim font-normal">({assignments.length})</span>
                </h2>
                <div className="space-y-2">
                  {assignments.map((assignment) => {
                    let completed = false;
                    try {
                      const sub = localStorage.getItem(`prepwise_submission_${assignment.id}`);
                      if (sub) {
                        completed = JSON.parse(sub).passed === true;
                      }
                    } catch {
                      // ignore
                    }
                    return (
                      <AssignmentCard
                        key={assignment.id}
                        assignment={assignment}
                        completed={completed}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </main>
    </div>
  );
}
