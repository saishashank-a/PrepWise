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
    <span
      className={`text-[11px] font-semibold px-3 py-1 rounded-md ${
        resume.atsScore >= 80
          ? "bg-emerald-glow/10 text-emerald-glow"
          : resume.atsScore >= 60
            ? "bg-yellow-400/10 text-yellow-400"
            : "bg-red-400/10 text-red-400"
      }`}
    >
      ATS: {resume.atsScore}
    </span>
  ) : null;

  return (
    <div className="rounded-xl bg-surface-elevated border border-border-subtle p-4 transition-colors hover:border-emerald-glow/[0.12]">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-sm font-semibold">{resume.roleTitle}</div>
          <div className="text-xs text-text-dim mt-0.5">{resume.company} — {date}</div>
        </div>
        {scoreBadge}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => exportToPDF(resume.sections, fileName)}
          className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-border-subtle text-xs text-text-muted
                     hover:text-foreground hover:border-emerald-glow/20 transition-all"
        >
          PDF ↓
        </button>
        <button
          onClick={() => exportToDOCX(resume.sections, fileName)}
          className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-border-subtle text-xs text-text-muted
                     hover:text-foreground hover:border-emerald-glow/20 transition-all"
        >
          DOCX ↓
        </button>
        <button
          onClick={onEdit}
          className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-border-subtle text-xs text-text-dim
                     hover:text-foreground hover:border-emerald-glow/20 transition-all"
        >
          Edit
        </button>
        {confirmDelete ? (
          <button
            onClick={() => { onDelete(); setConfirmDelete(false); }}
            className="px-3.5 py-1.5 rounded-lg bg-red-400/10 border border-red-400/20 text-xs text-red-400"
          >
            Confirm
          </button>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-border-subtle text-xs text-red-400/60
                       hover:text-red-400 hover:border-red-400/20 transition-all"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
