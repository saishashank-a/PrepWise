"use client";

import { useState } from "react";
import type { TailoredResume } from "@/lib/resumeTypes";
import { exportToPDF, exportToDOCX } from "@/lib/resumeExporter";

interface Props {
  resume: TailoredResume;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ResumeCard({ resume, onEdit, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fileName = `${resume.roleTitle}-${resume.company}`.replace(/\s+/g, "-").toLowerCase();
  const date = new Date(resume.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const scoreBadge = resume.atsScore !== null ? (
    <span className="text-[11px] font-semibold px-3 py-1 rounded-md bg-[#e6e9e8] text-[#474747]">
      ATS: {resume.atsScore}
    </span>
  ) : null;

  return (
    <div className="rounded-2xl bg-white border border-black/[0.06] p-4 transition-colors hover:border-black/20">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-sm font-semibold text-black">{resume.roleTitle}</div>
          <div className="text-xs text-[#777] mt-0.5">{resume.company} — {date}</div>
        </div>
        {scoreBadge}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => exportToPDF(resume.sections, fileName)}
          className="px-3.5 py-1.5 rounded-lg bg-[#f8faf9] border border-black/[0.06] text-xs text-[#474747]
                     hover:text-black hover:border-black/20 transition-all"
        >
          PDF ↓
        </button>
        <button
          onClick={() => exportToDOCX(resume.sections, fileName)}
          className="px-3.5 py-1.5 rounded-lg bg-[#f8faf9] border border-black/[0.06] text-xs text-[#474747]
                     hover:text-black hover:border-black/20 transition-all"
        >
          DOCX ↓
        </button>
        <button
          onClick={onEdit}
          className="px-3.5 py-1.5 rounded-lg bg-[#f8faf9] border border-black/[0.06] text-xs text-[#474747]
                     hover:text-black hover:border-black/20 transition-all"
        >
          Edit
        </button>
        {confirmDelete ? (
          <button
            onClick={() => { onDelete(); setConfirmDelete(false); }}
            className="px-3.5 py-1.5 rounded-lg bg-black text-white border border-black text-xs"
          >
            Confirm Delete
          </button>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#f8faf9] border border-black/[0.06] text-xs text-[#777]
                       hover:text-black hover:border-black/20 transition-all"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
