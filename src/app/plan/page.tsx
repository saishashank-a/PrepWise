"use client";

import { useEffect } from "react";
import { usePlanStore } from "@/stores/usePlanStore";
import PlanBuilder from "@/components/plan/PlanBuilder";

export default function PlanPage() {
  const { load, loaded, persist, plan } = usePlanStore();

  useEffect(() => {
    load();
  }, [load]);

  // Auto-persist on changes
  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => {
      persist();
    }, 1500);
    return () => clearTimeout(timer);
  }, [plan, loaded, persist]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-emerald-glow/20 rounded-lg blur-md" />
              <div className="relative w-full h-full bg-surface-elevated rounded-lg border border-emerald-glow/20 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-emerald-glow">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
                </svg>
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "var(--font-cabinet)" }}>
              Prep<span className="text-emerald-glow">Wise</span>
            </span>
          </a>

          <div className="flex items-center gap-3">
            <a
              href="/dashboard"
              className="px-3 py-1.5 rounded-lg text-xs text-text-muted hover:text-foreground transition-colors"
            >
              Dashboard
            </a>
            <div className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-glow bg-emerald-glow/10 border border-emerald-glow/20">
              Study Plan
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="space-y-8">
          <div>
            <h1
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "var(--font-cabinet)" }}
            >
              Study Plan
            </h1>
            <p className="text-sm text-text-muted">
              Build a prioritized learning path. Add topics, set difficulty, and track your progress.
            </p>
          </div>
          <PlanBuilder />
        </div>
      </main>
    </div>
  );
}
