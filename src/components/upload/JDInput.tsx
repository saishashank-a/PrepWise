"use client";

import { useState } from "react";
import { useProfileStore } from "@/stores/useProfileStore";
import { extractJDSkills, isAIConfigured } from "@/lib/ai";
import type { JDSkill } from "@/lib/types";

export default function JDInput() {
  const { jdText, setJDText, jdSkills, addJDSkill, removeJDSkill } = useProfileStore();
  const [skillInput, setSkillInput] = useState("");
  const [extracting, setExtracting] = useState(false);

  const handleAIExtract = async () => {
    if (!jdText) return;
    setExtracting(true);
    try {
      const extracted = await extractJDSkills(jdText);
      for (const skill of extracted) {
        addJDSkill(skill);
      }
    } catch {
      // silently ignore
    } finally {
      setExtracting(false);
    }
  };

  const handleAddSkill = () => {
    const name = skillInput.trim();
    if (!name) return;
    addJDSkill({ name, required: true });
    setSkillInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <div className="space-y-5">
      {/* JD Text Area */}
      <div>
        <label className="text-sm font-medium text-foreground/80 mb-2 block">
          Job Description
        </label>
        <textarea
          value={jdText}
          onChange={(e) => setJDText(e.target.value)}
          placeholder="Paste the job description here..."
          rows={6}
          className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-border-subtle
                     text-sm text-foreground placeholder:text-text-dim leading-relaxed resize-y
                     focus:outline-none focus:border-emerald-glow/30 transition-colors"
        />
      </div>

      {/* Required Skills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground/80">
            Required Skills from JD
          </label>
          {isAIConfigured() && jdText && (
            <button
              onClick={handleAIExtract}
              disabled={extracting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-medium
                         bg-cyan-glow/10 text-cyan-glow border border-cyan-glow/20
                         hover:bg-cyan-glow/15 transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {extracting ? (
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              )}
              {extracting ? "Extracting..." : "AI Extract from JD"}
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add required skill (e.g. Kubernetes, GraphQL)"
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface-elevated border border-border-subtle
                       text-sm text-foreground placeholder:text-text-dim
                       focus:outline-none focus:border-emerald-glow/30 transition-colors"
          />
          <button
            onClick={handleAddSkill}
            disabled={!skillInput.trim()}
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-cyan-glow/10 text-cyan-glow
                       border border-cyan-glow/20 hover:bg-cyan-glow/15 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>

      {jdSkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {jdSkills.map((skill: JDSkill) => (
            <div
              key={skill.name}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium
                         bg-cyan-glow/10 text-cyan-glow border-cyan-glow/20"
            >
              <span>{skill.name}</span>
              {skill.required && <span className="text-[10px] opacity-50">req</span>}
              <button
                onClick={() => removeJDSkill(skill.name)}
                className="ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
