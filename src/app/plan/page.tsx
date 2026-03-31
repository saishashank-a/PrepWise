"use client";

import { useEffect } from "react";
import { usePlanStore } from "@/stores/usePlanStore";
import PlanBuilder from "@/components/plan/PlanBuilder";
import AppLayout from "@/components/layout/AppLayout";

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
    <AppLayout>
      <div className="p-8 md:p-10">
        {/* Page header */}
        <div className="mb-8">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#777] mb-2">
            Study Plan
          </p>
          <div className="flex items-center gap-3">
            <h1
              className="text-4xl md:text-5xl font-black tracking-tighter text-[#191c1c]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Study Plan
            </h1>
            <span className="bg-black text-white text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full">
              Active
            </span>
          </div>
          <p className="text-sm text-[#474747] mt-2">
            Build a prioritized learning path. Add topics, set difficulty, and track your progress.
          </p>
        </div>

        <PlanBuilder />
      </div>
    </AppLayout>
  );
}
