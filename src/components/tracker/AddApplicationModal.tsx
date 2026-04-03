"use client";

import { useState } from "react";
import { useApplicationStore } from "@/stores/useApplicationStore";
import { ApplicationStatus, Priority } from "@/lib/applicationTypes";

interface Props {
  defaultStatus?: ApplicationStatus;
  onClose: () => void;
}

export default function AddApplicationModal({ defaultStatus = "to_apply", onClose }: Props) {
  const { addApplication } = useApplicationStore();
  const [form, setForm] = useState({
    company: "",
    role: "",
    location: "",
    priority: "" as Priority | "",
    jd: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company || !form.role) return;
    addApplication({
      company: form.company,
      role: form.role,
      location: form.location,
      status: defaultStatus,
      priority: (form.priority as Priority) || null,
      appliedDate: defaultStatus === "applied" ? new Date().toISOString() : null,
      interviewDate: null,
      interviewLink: null,
      jd: form.jd,
      notes: form.notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black tracking-tighter" style={{ fontFamily: "var(--font-display)" }}>
            Add Application
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f2f4f3] flex items-center justify-center hover:bg-[#e6e9e8] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[11px] font-mono uppercase tracking-widest text-[#777] block mb-1.5">Company *</label>
            <input
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              placeholder="Google, Meta, Stripe..."
              className="w-full bg-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black/10 outline-none"
              required
            />
          </div>
          <div>
            <label className="text-[11px] font-mono uppercase tracking-widest text-[#777] block mb-1.5">Role *</label>
            <input
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              placeholder="Senior Software Engineer..."
              className="w-full bg-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black/10 outline-none"
              required
            />
          </div>
          <div>
            <label className="text-[11px] font-mono uppercase tracking-widest text-[#777] block mb-1.5">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="Remote, San Francisco..."
              className="w-full bg-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black/10 outline-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-mono uppercase tracking-widest text-[#777] block mb-1.5">Priority</label>
            <select
              value={form.priority}
              onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as Priority | "" }))}
              className="w-full bg-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black/10 outline-none"
            >
              <option value="">No priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-mono uppercase tracking-widest text-[#777] block mb-1.5">Job Description</label>
            <textarea
              value={form.jd}
              onChange={(e) => setForm((f) => ({ ...f, jd: e.target.value }))}
              placeholder="Paste the job description here — used to generate interview questions..."
              rows={4}
              className="w-full bg-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black/10 outline-none resize-none"
            />
          </div>
          <div>
            <label className="text-[11px] font-mono uppercase tracking-widest text-[#777] block mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Referral from John, interesting team..."
              rows={2}
              className="w-full bg-white border border-black/[0.1] rounded-xl px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black/10 outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-black/15 text-[#474747] text-sm font-medium rounded-xl hover:bg-[#f2f4f3] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-black/85 transition-colors"
            >
              Add Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
