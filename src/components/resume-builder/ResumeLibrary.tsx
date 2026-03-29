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
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-cabinet)" }}>
          My Resumes
        </h1>
        <p className="text-sm text-text-muted">
          All your tailored resumes, organized by role.
        </p>
      </div>

      {resumes.length === 0 ? (
        <div className="rounded-xl border border-border-subtle bg-surface-elevated/50 p-8 text-center">
          <p className="text-sm text-text-dim">
            No resumes yet. Generate a tailored resume from the Generate tab to see it here.
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
