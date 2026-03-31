"use client";

import { useApplicationStore } from "@/stores/useApplicationStore";

export default function PipelineVelocity() {
  const { getStats } = useApplicationStore();
  const stats = getStats();

  return (
    <div className="bg-[#f2f4f3] rounded-2xl p-6 md:p-8">
      <div className="mb-6">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#777] block mb-1">
          Analytics
        </span>
        <h3 className="text-xl font-black tracking-tighter text-[#191c1c]" style={{ fontFamily: "var(--font-display)" }}>
          Pipeline Velocity
        </h3>
        <p className="text-sm text-[#474747] mt-1">
          Track how your applications are progressing through the pipeline.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-black/[0.06]">
          <div className="text-2xl font-black text-[#191c1c]" style={{ fontFamily: "var(--font-display)" }}>
            {stats.reached}
          </div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#777] mt-1">
            Reached
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-black/[0.06]">
          <div className="text-2xl font-black text-[#191c1c]" style={{ fontFamily: "var(--font-display)" }}>
            {stats.responseRate}%
          </div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#777] mt-1">
            Response Rate
          </div>
        </div>
        <div className="bg-black rounded-xl p-4">
          <div className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-display)" }}>
            {stats.offers}
          </div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-white/50 mt-1">
            Offers
          </div>
        </div>
      </div>
    </div>
  );
}
