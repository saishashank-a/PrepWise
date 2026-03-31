"use client";

import { useResumeBuilderStore } from "@/stores/useResumeBuilderStore";
import ResumeCard from "./ResumeCard";

export default function ResumeLibrary() {
  const { resumes, deleteResume, setEditingResume, setActiveTab, persist } = useResumeBuilderStore();

  const handleEdit = (resume: typeof resumes[0]) => {
    setEditingResume(resume);
    setActiveTab("generate");
  };

  const handleDelete = async (id: string) => {
    deleteResume(id);
    await persist();
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs text-[#777]">
          All your tailored resumes, organized by role.
        </p>
      </div>

      {resumes.length === 0 ? (
        <div className="rounded-2xl border border-black/[0.06] bg-[#f8faf9] p-8 text-center">
          <p className="text-sm text-[#777]">
            No resumes yet. Generate a tailored resume from the Resume Generator tab to see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              onEdit={() => handleEdit(resume)}
              onDelete={() => handleDelete(resume.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
