"use client";

import { useRouter } from "next/navigation";
import { Application } from "@/lib/applicationTypes";
import { useApplicationStore } from "@/stores/useApplicationStore";

const PRIORITY_LABELS: Record<string, string> = {
  high: "HIGH",
  medium: "MED",
  low: "LOW",
};

export default function ApplicationCard({ app }: { app: Application }) {
  const { moveApplication, deleteApplication } = useApplicationStore();
  const router = useRouter();

  return (
    <div
      className={`bg-white border border-black/[0.06] rounded-xl p-4 hover:shadow-md hover:shadow-black/5 transition-all duration-200 active:scale-[0.97] cursor-grab ${
        app.status === "interviewing" ? "border-l-4 border-l-black" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-[#191c1c] truncate">{app.company}</h4>
          <p className="text-xs text-[#474747] truncate mt-0.5">{app.role}</p>
        </div>
        {app.priority && (
          <span className="text-[10px] font-mono text-[#777] bg-[#f2f4f3] px-1.5 py-0.5 rounded flex-shrink-0">
            {PRIORITY_LABELS[app.priority]}
          </span>
        )}
      </div>

      {app.location && (
        <p className="text-[11px] text-[#777] mb-3 flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">location_on</span>
          {app.location}
        </p>
      )}

      {app.status === "interviewing" && app.interviewDate && (
        <div className="flex items-center gap-1.5 bg-[#f2f4f3] rounded-lg p-2 mb-3">
          <span className="material-symbols-outlined text-[14px] text-[#474747]">calendar_today</span>
          <span className="text-[11px] text-[#474747] font-medium">
            {new Date(app.interviewDate).toLocaleDateString()}
          </span>
        </div>
      )}

      {app.status === "interviewing" && (
        <button
          onClick={() => router.push(`/interview/${app.id}`)}
          className="w-full mt-3 py-2 text-[11px] font-semibold bg-[#191c1c] text-white rounded-lg hover:bg-black/80 transition-colors flex items-center justify-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[14px]">psychology</span>
          Prep Interview
        </button>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/[0.04]">
        <span className="text-[10px] font-mono text-[#aaa]">
          {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : "No date"}
        </span>
        <button
          onClick={() => deleteApplication(app.id)}
          className="text-[#ccc] hover:text-[#474747] transition-colors"
          aria-label="Delete application"
        >
          <span className="material-symbols-outlined text-[16px]">delete</span>
        </button>
      </div>
    </div>
  );
}
