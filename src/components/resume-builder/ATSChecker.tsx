"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { parseResume } from "@/hooks/useResumeParser";
import { calculateATSScore } from "@/lib/atsScorer";
import { useResumeBuilderStore } from "@/stores/useResumeBuilderStore";
import { useProfileStore } from "@/stores/useProfileStore";
import ScoreDisplay from "./ScoreDisplay";

export default function ATSChecker() {
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [parsing, setParsing] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentScore, setCurrentScore } = useResumeBuilderStore();

  const profileStore = useProfileStore();
  const prefillAvailable = !resumeText && profileStore.resumeText;

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

  const handleCheck = async () => {
    if (!resumeText || !jdText) return;
    setChecking(true);
    setError(null);
    try {
      const score = await calculateATSScore(resumeText, jdText);
      setCurrentScore(score);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to calculate score");
    } finally {
      setChecking(false);
    }
  };

  const handlePrefill = () => {
    setResumeText(profileStore.resumeText);
    if (profileStore.jdText) setJdText(profileStore.jdText);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-cabinet)" }}>
          ATS Score Check
        </h1>
        <p className="text-sm text-text-secondary">
          Upload your resume and paste a job description to see how well they match.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Inputs */}
        <div className="flex-1 space-y-6">
          {prefillAvailable && (
            <button
              onClick={handlePrefill}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium
                         text-success bg-success-light border border-success-border
                         hover:bg-success-light transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              Use resume &amp; JD from Dashboard
            </button>
          )}

          <div>
            <div className="text-xs uppercase tracking-wider text-text-muted font-medium mb-2.5">Resume</div>
            {resumeText ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-light border border-primary-border flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-primary font-medium">Resume loaded</span>
                  </div>
                  <button
                    onClick={() => { setResumeText(""); setCurrentScore(null); }}
                    className="text-xs text-text-secondary hover:text-foreground transition-colors"
                  >
                    Replace
                  </button>
                </div>
                <div className="max-h-32 overflow-y-auto rounded-xl bg-white border border-border-default p-4 text-sm text-text-secondary leading-relaxed">
                  {resumeText.slice(0, 500)}
                  {resumeText.length > 500 && <span className="text-text-muted">... ({resumeText.length} chars)</span>}
                </div>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300
                  ${isDragActive ? "border-primary-border bg-primary-light" : "border-border-default hover:border-primary-border hover:bg-surface"}
                  ${parsing ? "pointer-events-none opacity-60" : ""}`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-light border border-primary-border flex items-center justify-center">
                    {parsing ? (
                      <svg className="w-5 h-5 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {parsing ? "Parsing resume..." : isDragActive ? "Drop your resume here" : "Drop your resume here, or click to browse"}
                    </p>
                    <p className="text-xs text-text-muted mt-1">PDF or DOCX</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border-default to-transparent" />

          <div>
            <div className="text-xs uppercase tracking-wider text-text-muted font-medium mb-2.5">Job Description</div>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the job description here..."
              rows={6}
              className="w-full rounded-xl bg-white border border-border-default p-4 text-sm text-foreground
                         placeholder:text-text-muted resize-none focus:outline-none focus:border-primary-border transition-colors"
            />
          </div>

          <button
            onClick={handleCheck}
            disabled={!resumeText || !jdText || checking}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium
                       bg-primary-light text-primary border border-primary-border
                       hover:bg-primary-light transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {checking ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            )}
            {checking ? "Analyzing..." : "Check ATS Score"}
          </button>

          {error && <p className="text-xs text-red-400 px-1">{error}</p>}
        </div>

        {/* Right: Score Results */}
        <div className="flex-1">
          {currentScore ? (
            <div>
              <div className="text-xs uppercase tracking-wider text-text-muted font-medium mb-4">Score Breakdown</div>
              <ScoreDisplay score={currentScore} />
            </div>
          ) : (
            <div className="rounded-xl border border-border-default bg-surface p-8 text-center h-full flex items-center justify-center">
              <p className="text-sm text-text-muted">
                Upload your resume and paste a job description to see your ATS score.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
