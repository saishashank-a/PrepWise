"use client";

import { useEffect } from "react";
import { useResumeBuilderStore } from "@/stores/useResumeBuilderStore";
import { useProfileStore } from "@/stores/useProfileStore";
import ATSChecker from "@/components/resume-builder/ATSChecker";
import ResumeGenerator from "@/components/resume-builder/ResumeGenerator";
import ResumeLibrary from "@/components/resume-builder/ResumeLibrary";

type Tab = "ats" | "generate" | "library";

export default function ResumeBuilderPage() {
  const { activeTab, setActiveTab, resumes, load, loaded } = useResumeBuilderStore();
  const profileStore = useProfileStore();

  useEffect(() => {
    load();
    profileStore.load();
  }, [load, profileStore.load]);

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "ats", label: "ATS Score Check" },
    { id: "generate", label: "Generate Resume" },
    { id: "library", label: "My Resumes", count: resumes.length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
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

          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto">
            <div className="flex items-center gap-1 bg-surface-elevated rounded-xl border border-border-subtle p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-emerald-glow/10 text-emerald-glow border border-emerald-glow/20"
                      : "text-text-muted hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="ml-1.5 text-[10px] bg-emerald-glow/20 text-emerald-glow px-1.5 py-0.5 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <a
              href="/dashboard"
              className="px-3 py-2 rounded-lg text-xs font-medium text-cyan-glow bg-cyan-glow/10
                         border border-cyan-glow/20 hover:bg-cyan-glow/15 transition-colors"
            >
              Dashboard
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {activeTab === "ats" && <ATSChecker />}
        {activeTab === "generate" && <ResumeGenerator />}
        {activeTab === "library" && <ResumeLibrary />}
      </main>
    </div>
  );
}
