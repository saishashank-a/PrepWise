"use client";

import { useState } from "react";
import { useProfileStore } from "@/stores/useProfileStore";
import type { Skill } from "@/lib/types";

const LEVEL_COLORS: Record<Skill["level"], string> = {
  beginner: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  intermediate: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  advanced: "bg-emerald-glow/10 text-emerald-glow border-emerald-glow/20",
};

const LEVEL_LABELS: Record<Skill["level"], string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function SkillTagger() {
  const { skills, addSkill, removeSkill, updateSkillLevel } = useProfileStore();
  const [input, setInput] = useState("");
  const [showAdd, setShowAdd] = useState(false);

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

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground/80">
          Your Skills
          {skills.length > 0 && (
            <span className="ml-2 text-xs text-text-dim font-normal">({skills.length})</span>
          )}
        </label>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-[10px] text-cyan-glow hover:text-cyan-glow/80 transition-colors"
        >
          {showAdd ? "Hide" : "+ Add manually"}
        </button>
      </div>

      {/* Manual add (collapsed by default) */}
      {showAdd && (
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a skill (e.g. Python, React, SQL)"
            className="flex-1 px-4 py-2 rounded-xl bg-surface-elevated border border-border-subtle
                       text-sm text-foreground placeholder:text-text-dim
                       focus:outline-none focus:border-emerald-glow/30 transition-colors"
          />
          <button
            onClick={handleAdd}
            disabled={!input.trim()}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-glow/10 text-emerald-glow
                       border border-emerald-glow/20 hover:bg-emerald-glow/15 transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      )}

      {/* Skill tags */}
      {skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className={`group flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${LEVEL_COLORS[skill.level]}`}
            >
              <span className="select-none">{skill.name}</span>
              {/* Level badge — click to cycle */}
              <button
                onClick={() => cycleLevel(skill.name, skill.level)}
                className="px-1.5 py-0.5 rounded text-[9px] opacity-60 hover:opacity-100 transition-opacity"
                title={`${LEVEL_LABELS[skill.level]} — click to change`}
              >
                {LEVEL_LABELS[skill.level]}
              </button>
              {/* Remove button */}
              <button
                onClick={() => removeSkill(skill.name)}
                className="w-5 h-5 rounded-md flex items-center justify-center opacity-40 hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-all"
                title="Remove skill"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-text-dim py-2">
          Upload your resume above to auto-extract skills, or add them manually.
        </p>
      )}

      {skills.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-text-dim">
            Click level to cycle: Beginner → Intermediate → Advanced. Click × to remove.
          </p>
          {skills.length > 1 && (
            <button
              onClick={() => skills.forEach((s) => removeSkill(s.name))}
              className="text-[10px] text-red-400/60 hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}
