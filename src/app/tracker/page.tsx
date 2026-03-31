"use client";

import { useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import KanbanBoard from "@/components/tracker/KanbanBoard";
import PipelineVelocity from "@/components/tracker/PipelineVelocity";
import { useApplicationStore } from "@/stores/useApplicationStore";

export default function TrackerPage() {
  const { load, loaded } = useApplicationStore();

  useEffect(() => {
    if (!loaded) load();
  }, [load, loaded]);

  return (
    <AppLayout>
      <div className="p-8 md:p-10">
        {/* Header */}
        <header className="mb-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#777] block mb-2">
            Application Tracker
          </span>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1
                className="text-4xl md:text-5xl font-black tracking-tighter text-[#191c1c] leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Application Pipeline
              </h1>
              <p className="text-[#474747] text-sm mt-2 max-w-md">
                Track every opportunity from discovery to offer. Stay organized across your entire job search.
              </p>
            </div>
          </div>
        </header>

        {/* Kanban Board */}
        <KanbanBoard />

        {/* Pipeline Velocity analytics */}
        <div className="mt-16">
          <PipelineVelocity />
        </div>
      </div>
    </AppLayout>
  );
}
