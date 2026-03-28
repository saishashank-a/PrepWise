"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { parseResume } from "@/hooks/useResumeParser";
import { useProfileStore } from "@/stores/useProfileStore";
import { extractSkillsFromText, guessSkillLevel } from "@/lib/skillExtractor";
import { extractSkillsFromResume, isAIConfigured } from "@/lib/ai";

export default function ResumeUpload() {
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { resumeText, setResumeText, addSkill, skills } = useProfileStore();

  const autoExtractSkills = useCallback(
    async (text: string) => {
      // First: instant keyword extraction
      const keywordSkills = extractSkillsFromText(text);
      for (const name of keywordSkills) {
        addSkill({ name, level: guessSkillLevel(name, text), source: "resume" });
      }

      // Then: AI extraction for more nuanced skills (if configured)
      if (isAIConfigured()) {
        try {
          const aiSkills = await extractSkillsFromResume(text);
          for (const skill of aiSkills) {
            addSkill({ name: skill.name, level: skill.level, source: "resume" });
          }
        } catch {
          // AI failed — keyword extraction already ran, so we're fine
        }
      }
    },
    [addSkill],
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setError(null);
      setParsing(true);
      try {
        const text = await parseResume(file);
        setResumeText(text);
        // Auto-extract skills from the parsed text
        await autoExtractSkills(text);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to parse resume");
      } finally {
        setParsing(false);
      }
    },
    [setResumeText, autoExtractSkills],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    multiple: false,
  });

  if (resumeText) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-glow/10 border border-emerald-glow/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm text-emerald-glow font-medium">Resume uploaded</span>
            {skills.length > 0 && (
              <span className="text-xs text-text-dim">
                — {skills.length} skill{skills.length !== 1 ? "s" : ""} extracted
              </span>
            )}
          </div>
          <button
            onClick={() => setResumeText("")}
            className="text-xs text-text-muted hover:text-foreground transition-colors"
          >
            Replace
          </button>
        </div>
        <div className="max-h-32 overflow-y-auto rounded-xl bg-surface-elevated border border-border-subtle p-4 text-sm text-text-muted leading-relaxed">
          {resumeText.slice(0, 800)}
          {resumeText.length > 800 && (
            <span className="text-text-dim">... ({resumeText.length} chars)</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive
            ? "border-emerald-glow/50 bg-emerald-glow/[0.03]"
            : "border-border-subtle hover:border-emerald-glow/20 hover:bg-surface-elevated/50"
          }
          ${parsing ? "pointer-events-none opacity-60" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-glow/10 border border-emerald-glow/20 flex items-center justify-center">
            {parsing ? (
              <svg className="w-5 h-5 text-emerald-glow animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-emerald-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground/80">
              {parsing
                ? "Parsing & extracting skills..."
                : isDragActive
                  ? "Drop your resume here"
                  : "Drop your resume here, or click to browse"}
            </p>
            <p className="text-xs text-text-dim mt-1">PDF or DOCX — skills auto-extracted</p>
          </div>
        </div>
      </div>
      {error && <p className="text-xs text-red-400 px-1">{error}</p>}
    </div>
  );
}
