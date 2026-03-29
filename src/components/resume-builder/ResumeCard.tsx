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
          ? "bg-primary-light text-primary"
          : resume.atsScore >= 60
            ? "bg-amber-50 text-yellow-400"
            : "bg-red-50 text-red-400"
      }`}
    >
      ATS: {resume.atsScore}
    </span>
  ) : null;

  return (
    <div className="rounded-xl bg-white border border-border-default p-4 transition-colors hover:border-primary-border">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-sm font-semibold">{resume.roleTitle}</div>
          <div className="text-xs text-text-muted mt-0.5">{resume.company} — {date}</div>
        </div>
        {scoreBadge}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => exportToPDF(resume.sections, fileName)}
          className="px-3.5 py-1.5 rounded-lg bg-surface border border-border-default text-xs text-text-secondary
                     hover:text-foreground hover:border-primary-border transition-all"
        >
          PDF ↓
        </button>
        <button
          onClick={() => exportToDOCX(resume.sections, fileName)}
          className="px-3.5 py-1.5 rounded-lg bg-surface border border-border-default text-xs text-text-secondary
                     hover:text-foreground hover:border-primary-border transition-all"
        >
          DOCX ↓
        </button>
        <button
          onClick={onEdit}
          className="px-3.5 py-1.5 rounded-lg bg-surface border border-border-default text-xs text-text-muted
                     hover:text-foreground hover:border-primary-border transition-all"
        >
          Edit
        </button>
        {confirmDelete ? (
          <button
            onClick={() => { onDelete(); setConfirmDelete(false); }}
            className="px-3.5 py-1.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-400"
          >
            Confirm
          </button>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="px-3.5 py-1.5 rounded-lg bg-surface border border-border-default text-xs text-red-400/60
                       hover:text-red-400 hover:border-red-200 transition-all"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
