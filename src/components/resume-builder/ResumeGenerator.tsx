"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { parseResume } from "@/hooks/useResumeParser";
import { isAIConfigured } from "@/lib/ai";
import { generateTailoredSections, generateFullDocument, regenerateSection } from "@/lib/resumeGenerator";
import { exportToPDF, exportToDOCX, exportFullDocumentToPDF, exportFullDocumentToDOCX } from "@/lib/resumeExporter";
import { useResumeBuilderStore } from "@/stores/useResumeBuilderStore";
import { useProfileStore } from "@/stores/useProfileStore";
import type { ResumeSection, TailoredResume } from "@/lib/resumeTypes";
import SectionEditor from "./SectionEditor";

type Mode = "sections" | "full";

export default function ResumeGenerator() {
  const [mode, setMode] = useState<Mode>("sections");
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [company, setCompany] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [sections, setSections] = useState<ResumeSection[]>([]);
  const [fullText, setFullText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { generating, setGenerating, addResume, editingResume, setEditingResume, persist } = useResumeBuilderStore();
  const profileStore = useProfileStore();
  const prefillAvailable = !resumeText && profileStore.resumeText;
  const hasGenerated = sections.length > 0 || fullText.length > 0;

  // Load editing resume if one is set
  useEffect(() => {
    if (editingResume) {
      setResumeText("(loaded from saved resume)");
      setJdText(editingResume.jdText);
      setCompany(editingResume.company);
      setRoleTitle(editingResume.roleTitle);
      setSections(editingResume.sections);
      setFullText(editingResume.fullDocument);
    }
  }, [editingResume]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setError(null);
    setParsing(true);
    try {
      const text = await parseResume(file);
      setResumeText(text);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to parse resume");
    } finally {
      setParsing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleGenerate = async () => {
    if (!resumeText || !jdText) return;
    setGenerating(true);
    setError(null);
    try {
      if (mode === "sections") {
        const result = await generateTailoredSections(resumeText, jdText);
        setSections(result);
      } else {
        const result = await generateFullDocument(resumeText, jdText);
        setFullText(result);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Generation failed. Check your API key.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    const resume: TailoredResume = {
      id: editingResume?.id || crypto.randomUUID(),
      roleTitle: roleTitle || "Untitled Role",
      company: company || "Unknown Company",
      jdText,
      sections,
      fullDocument: fullText,
      atsScore: null,
      createdAt: editingResume?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addResume(resume);
    await persist();
    setEditingResume(null);
  };

  const handleDownloadPDF = async () => {
    const fileName = `${roleTitle || "resume"}-${company || "tailored"}`.replace(/\s+/g, "-").toLowerCase();
    if (mode === "sections" && sections.length > 0) {
      await exportToPDF(sections, fileName);
    } else if (fullText) {
      await exportFullDocumentToPDF(fullText, fileName);
    }
  };

  const handleDownloadDOCX = async () => {
    const fileName = `${roleTitle || "resume"}-${company || "tailored"}`.replace(/\s+/g, "-").toLowerCase();
    if (mode === "sections" && sections.length > 0) {
      await exportToDOCX(sections, fileName);
    } else if (fullText) {
      await exportFullDocumentToDOCX(fullText, fileName);
    }
  };

  if (!isAIConfigured()) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-cabinet)" }}>
            Generate Tailored Resume
          </h1>
          <p className="text-sm text-text-secondary">
            Create a resume optimized for a specific role using AI.
          </p>
        </div>
        <div className="rounded-xl border border-border-default bg-surface p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-sm text-text-secondary mb-2">AI resume generation requires a Gemini API key.</p>
          <p className="text-xs text-text-muted">
            Set <code className="text-primary bg-surface px-1.5 py-0.5 rounded text-[11px]">NEXT_PUBLIC_GEMINI_API_KEY</code> in your environment to enable this feature.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-cabinet)" }}>
          Generate Tailored Resume
        </h1>
        <p className="text-sm text-text-secondary">
          Create a resume optimized for a specific role using your existing resume and the job description.
        </p>
      </div>

      {/* Role info */}
      <div className="flex gap-3">
        <input
          value={roleTitle}
          onChange={(e) => setRoleTitle(e.target.value)}
          placeholder="Role title (e.g. Senior Frontend Engineer)"
          className="flex-1 rounded-xl bg-white border border-border-default px-4 py-2.5 text-sm
                     placeholder:text-text-muted focus:outline-none focus:border-primary-border transition-colors"
        />
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Company"
          className="w-48 rounded-xl bg-white border border-border-default px-4 py-2.5 text-sm
                     placeholder:text-text-muted focus:outline-none focus:border-primary-border transition-colors"
        />
      </div>

      {!hasGenerated && (
        <>
          {prefillAvailable && (
            <button
              onClick={() => {
                setResumeText(profileStore.resumeText);
                if (profileStore.jdText) setJdText(profileStore.jdText);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium
                         text-success bg-success-light border border-success-border hover:bg-success-light transition-colors"
            >
              Use resume &amp; JD from Dashboard
            </button>
          )}

          <div>
            <div className="text-xs uppercase tracking-wider text-text-muted font-medium mb-2.5">Resume</div>
            {resumeText ? (
              <div className="flex items-center justify-between rounded-xl bg-white border border-border-default p-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary-light flex items-center justify-center">
                    <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-primary">Resume loaded</span>
                </div>
                <button onClick={() => setResumeText("")} className="text-xs text-text-secondary hover:text-foreground transition-colors">
                  Replace
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all
                  ${isDragActive ? "border-primary-border bg-primary-light" : "border-border-default hover:border-primary-border"}
                  ${parsing ? "pointer-events-none opacity-60" : ""}`}
              >
                <input {...getInputProps()} />
                <p className="text-sm text-foreground">
                  {parsing ? "Parsing..." : "Drop resume or click to upload"}
                </p>
                <p className="text-xs text-text-muted mt-1">PDF or DOCX</p>
              </div>
            )}
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-text-muted font-medium mb-2.5">Job Description</div>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the job description here..."
              rows={5}
              className="w-full rounded-xl bg-white border border-border-default p-4 text-sm
                         placeholder:text-text-muted resize-none focus:outline-none focus:border-primary-border transition-colors"
            />
          </div>
        </>
      )}

      {/* Mode toggle */}
      <div className="flex gap-3">
        {(["sections", "full"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 p-3.5 rounded-xl transition-all text-left ${
              mode === m
                ? "bg-primary-light border border-primary-border"
                : "bg-white border border-border-default"
            }`}
          >
            <div className={`text-sm font-semibold ${mode === m ? "text-primary" : ""}`}>
              {m === "sections" ? "Section Editor" : "Full Document"}
            </div>
            <div className="text-xs text-text-muted mt-1">
              {m === "sections" ? "Edit each section individually" : "Generate complete resume at once"}
            </div>
          </button>
        ))}
      </div>

      {!hasGenerated && (
        <button
          onClick={handleGenerate}
          disabled={!resumeText || !jdText || generating}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium
                     bg-primary-light text-primary border border-primary-border
                     hover:bg-primary-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {generating ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Generate Tailored Resume
            </>
          )}
        </button>
      )}

      {error && <p className="text-xs text-red-400 px-1">{error}</p>}

      {mode === "sections" && sections.length > 0 && (
        <div className="space-y-3">
          {sections.map((section, i) => (
            <SectionEditor
              key={section.id}
              section={section}
              onUpdate={(content) => {
                const updated = [...sections];
                updated[i] = { ...section, content };
                setSections(updated);
              }}
              onRegenerate={async () => {
                const newContent = await regenerateSection(section, resumeText, jdText);
                const updated = [...sections];
                updated[i] = { ...section, content: newContent };
                setSections(updated);
              }}
            />
          ))}
        </div>
      )}

      {mode === "full" && fullText && (
        <div className="rounded-xl bg-white border border-border-default p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold">Full Resume</span>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="text-[11px] text-primary hover:opacity-70 disabled:opacity-40"
            >
              {generating ? "..." : "✦ Regenerate"}
            </button>
          </div>
          <textarea
            value={fullText}
            onChange={(e) => setFullText(e.target.value)}
            rows={20}
            className="w-full bg-surface border border-border-default rounded-lg p-3 text-[13px] text-foreground
                       resize-y focus:outline-none focus:border-primary-border transition-colors leading-relaxed font-mono"
          />
        </div>
      )}

      {hasGenerated && (
        <div className="flex gap-2.5">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium
                       bg-primary-light text-primary border border-primary-border hover:bg-primary-light transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download PDF
          </button>
          <button
            onClick={handleDownloadDOCX}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium
                       text-text-secondary border border-border-default hover:text-foreground hover:border-primary-border transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download DOCX
          </button>
          <button
            onClick={handleSave}
            className="px-6 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium
                       text-text-secondary border border-border-default hover:text-foreground hover:border-primary-border transition-colors"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
