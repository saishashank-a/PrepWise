"use client";

import { useState, useEffect } from "react";
import { useProfileStore } from "@/stores/useProfileStore";
import ResumeUpload from "@/components/upload/ResumeUpload";
import SkillTagger from "@/components/upload/SkillTagger";
import JDInput from "@/components/upload/JDInput";
import GapView from "@/components/upload/GapView";
import AppLayout from "@/components/layout/AppLayout";

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
    <AppLayout>
      <div className="p-8 md:p-10 max-w-5xl">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#474747] mb-2">
            WORKSPACE
          </p>
          <h1
            className="text-4xl md:text-5xl font-black tracking-tighter text-black"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Dashboard
          </h1>
        </div>

        {/* Tab bar */}
        <div className="bg-[#f2f4f3] rounded-xl p-1 inline-flex gap-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-black text-white"
                  : "text-[#474747] hover:bg-[#e6e9e8]"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-black/10 text-[#474747]"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "resume" && (
          <div className="space-y-8">
            <div>
              <h2
                className="text-2xl font-black tracking-tighter text-black mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Upload Your Resume
              </h2>
              <p className="text-sm text-[#474747]">
                Drop your PDF or DOCX file. Everything is parsed in your browser — no data leaves your machine.
              </p>
            </div>
            <ResumeUpload />
            <div className="h-px bg-black/[0.06]" />
            <SkillTagger />
          </div>
        )}

        {activeTab === "jd" && (
          <div className="space-y-8">
            <div>
              <h2
                className="text-2xl font-black tracking-tighter text-black mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Paste the Job Description
              </h2>
              <p className="text-sm text-[#474747]">
                Copy the job posting and identify the required skills. We&apos;ll compare them against your resume.
              </p>
            </div>
            <JDInput />
          </div>
        )}

        {activeTab === "gap" && (
          <div className="space-y-8">
            <div>
              <h2
                className="text-2xl font-black tracking-tighter text-black mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Gap Analysis
              </h2>
              <p className="text-sm text-[#474747]">
                See how your skills stack up against what the job requires.
              </p>
            </div>
            <GapView />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
