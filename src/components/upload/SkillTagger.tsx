"use client";

import { useState } from "react";
import { useProfileStore } from "@/stores/useProfileStore";
import { extractSkillsFromResume, isAIConfigured } from "@/lib/ai";
import type { Skill } from "@/lib/types";

const LEVEL_COLORS: Record<Skill["level"], string> = {
  beginner: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  intermediate: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  advanced: "bg-emerald-glow/10 text-emerald-glow border-emerald-glow/20",
};

export default function SkillTagger() {
  const { skills, addSkill, removeSkill, updateSkillLevel, resumeText } = useProfileStore();
  const [input, setInput] = useState("");
  const [extracting, setExtracting] = useState(false);

  const handleAdd = () => {
    const name = input.trim();
    if (!name) return;
    addSkill({ name, level: "intermediate", source: "manual" });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const cycleLevel = (name: string, current: Skill["level"]) => {
    const levels: Skill["level"][] = ["beginner", "intermediate", "advanced"];
    const next = levels[(levels.indexOf(current) + 1) % levels.length];
    updateSkillLevel(name, next);
  };

  const handleAIExtract = async () => {
    if (!resumeText) return;
    setExtracting(true);
    try {
      const extracted = await extractSkillsFromResume(resumeText);
      for (const skill of extracted) {
        addSkill({ name: skill.name, level: skill.level, source: "resume" });
      }
    } catch {
      // silently ignore — user can still add manually
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-foreground/80">
            Your Skills
          </label>
          {isAIConfigured() && resumeText && (
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
              {extracting ? "Extracting..." : "AI Extract from Resume"}
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a skill (e.g. Python, React, SQL)"
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface-elevated border border-border-subtle
                       text-sm text-foreground placeholder:text-text-dim
                       focus:outline-none focus:border-emerald-glow/30 transition-colors"
          />
          <button
            onClick={handleAdd}
            disabled={!input.trim()}
            className="px-4 py-2.5 rounded-xl text-sm font-medium bg-emerald-glow/10 text-emerald-glow
                       border border-emerald-glow/20 hover:bg-emerald-glow/15 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${LEVEL_COLORS[skill.level]}`}
            >
              <button
                onClick={() => cycleLevel(skill.name, skill.level)}
                className="hover:opacity-70 transition-opacity"
                title={`Level: ${skill.level} (click to change)`}
              >
                {skill.name}
              </button>
              <span className="text-[10px] opacity-50">{skill.level[0].toUpperCase()}</span>
              <button
                onClick={() => removeSkill(skill.name)}
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

      {skills.length > 0 && (
        <p className="text-[10px] text-text-dim">
          Click a skill to cycle level: B(eginner) → I(ntermediate) → A(dvanced)
        </p>
      )}
    </div>
  );
}
