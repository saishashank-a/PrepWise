"use client";

import { useState, useEffect } from "react";
import { useProfileStore } from "@/stores/useProfileStore";
import ResumeUpload from "@/components/upload/ResumeUpload";
import SkillTagger from "@/components/upload/SkillTagger";
import JDInput from "@/components/upload/JDInput";
import GapView from "@/components/upload/GapView";

type Tab = "resume" | "jd" | "gap";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("resume");
  const { skills, jdSkills, resumeText, load, loaded, persist } = useProfileStore();

  useEffect(() => {
    load();
  }, [load]);

  // Auto-persist on changes (debounced)
  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => {
      persist();
    }, 2000);
    return () => clearTimeout(timer);
  }, [resumeText, skills, jdSkills, loaded, persist]);

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "resume", label: "Resume & Skills", count: skills.length },
    { id: "jd", label: "Job Description", count: jdSkills.length },
    { id: "gap", label: "Gap Analysis" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-primary-light rounded-lg blur-md" />
              <div className="relative w-full h-full bg-surface-elevated rounded-lg border border-primary-border flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
                </svg>
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "var(--font-cabinet)" }}>
              Prep<span className="text-primary">Wise</span>
            </span>
          </a>

          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto">
          <div className="flex items-center gap-1 bg-surface-elevated rounded-xl border border-border-default p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary-light text-primary border border-primary-border"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1.5 text-[10px] bg-primary-light text-primary px-1.5 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          <a
            href="/plan"
            className="px-3 py-2 rounded-lg text-xs font-medium text-success bg-success-light
                       border border-success-border hover:bg-success-light transition-colors"
          >
            Study Plan
          </a>
          <a
            href="/resume-builder"
            className="px-3 py-2 rounded-lg text-xs font-medium text-primary bg-primary-light
                       border border-primary-border hover:bg-primary-light transition-colors"
          >
            Resume Builder
          </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {activeTab === "resume" && (
          <div className="space-y-8">
            <div>
              <h1
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: "var(--font-cabinet)" }}
              >
                Upload Your Resume
              </h1>
              <p className="text-sm text-text-secondary">
                Drop your PDF or DOCX file. Everything is parsed in your browser — no data leaves your machine.
              </p>
            </div>
            <ResumeUpload />
            <div className="h-px bg-gradient-to-r from-transparent via-primary-border to-transparent" />
            <SkillTagger />
          </div>
        )}

        {activeTab === "jd" && (
          <div className="space-y-8">
            <div>
              <h1
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: "var(--font-cabinet)" }}
              >
                Paste the Job Description
              </h1>
              <p className="text-sm text-text-secondary">
                Copy the job posting and identify the required skills. We&apos;ll compare them against your resume.
              </p>
            </div>
            <JDInput />
          </div>
        )}

        {activeTab === "gap" && (
          <div className="space-y-8">
            <div>
              <h1
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: "var(--font-cabinet)" }}
              >
                Gap Analysis
              </h1>
              <p className="text-sm text-text-secondary">
                See how your skills stack up against what the job requires.
              </p>
            </div>
            <GapView />
          </div>
        )}
      </main>
    </div>
  );
}
