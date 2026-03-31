"use client";

import { useEffect } from "react";
import { useResumeBuilderStore } from "@/stores/useResumeBuilderStore";
import { useProfileStore } from "@/stores/useProfileStore";
import ATSChecker from "@/components/resume-builder/ATSChecker";
import ResumeGenerator from "@/components/resume-builder/ResumeGenerator";
import ResumeLibrary from "@/components/resume-builder/ResumeLibrary";
import AppLayout from "@/components/layout/AppLayout";

type Tab = "ats" | "generate" | "library";

export default function ResumeBuilderPage() {
  const { activeTab, setActiveTab, resumes, load, loaded } = useResumeBuilderStore();
  const profileStore = useProfileStore();

  useEffect(() => {
    load();
    profileStore.load();
  }, [load, profileStore.load]);

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "ats", label: "ATS Checker" },
    { id: "generate", label: "Resume Generator" },
    { id: "library", label: "Resume Library", count: resumes.length },
  ];

  return (
    <AppLayout>
      <div className="p-8 md:p-10 space-y-8">
        {/* Page header */}
        <div>
          <p className="text-[11px] font-mono uppercase tracking-widest text-[#777] mb-1">
            RESUME BUILDER
          </p>
          <h1
            className="text-4xl font-black tracking-tighter text-black"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your Resumes
          </h1>
        </div>

        {/* Tab bar */}
        <div className="bg-[#f2f4f3] rounded-xl p-1 inline-flex gap-1">
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
                <span className="ml-1.5 text-[10px] bg-[#e6e9e8] text-[#474747] px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === "ats" && <ATSChecker />}
          {activeTab === "generate" && <ResumeGenerator />}
          {activeTab === "library" && <ResumeLibrary />}
        </div>
      </div>
    </AppLayout>
  );
}
