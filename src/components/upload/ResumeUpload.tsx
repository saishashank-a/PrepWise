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
            <div className="w-8 h-8 rounded-lg bg-[#e1e3e2] flex items-center justify-center">
              <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm text-black font-medium">Resume uploaded</span>
            {skills.length > 0 && (
              <span className="text-xs text-[#474747]">
                — {skills.length} skill{skills.length !== 1 ? "s" : ""} extracted
              </span>
            )}
          </div>
          <button
            onClick={() => setResumeText("")}
            className="text-xs text-[#474747] hover:text-black transition-colors"
          >
            Replace
          </button>
        </div>
        <div className="max-h-32 overflow-y-auto rounded-xl bg-[#f2f4f3] border border-black/[0.06] p-4 text-sm text-[#474747] leading-relaxed">
          {resumeText.slice(0, 800)}
          {resumeText.length > 800 && (
            <span className="text-[#888]">... ({resumeText.length} chars)</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`dashed-border relative p-10 text-center cursor-pointer transition-all duration-300
          ${isDragActive ? "bg-[#e1e3e2]" : "bg-[#f2f4f3] hover:bg-[#e6e9e8]"}
          ${parsing ? "pointer-events-none opacity-60" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#e1e3e2] flex items-center justify-center">
            {parsing ? (
              <svg className="w-6 h-6 text-black animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            )}
          </div>
          <div>
            <p
              className="text-xl font-bold text-black"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {parsing
                ? "Parsing & extracting skills..."
                : isDragActive
                  ? "Drop your resume here"
                  : "Upload Your Resume"}
            </p>
            <p className="text-sm text-[#474747] mt-1">
              {parsing ? "This may take a moment" : "Drop PDF or DOCX here, or click to browse — skills auto-extracted"}
            </p>
          </div>
          {!parsing && (
            <button
              type="button"
              className="bg-black text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-black/85 transition-colors"
            >
              Choose File
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-[#474747] px-1">{error}</p>}
    </div>
  );
}
