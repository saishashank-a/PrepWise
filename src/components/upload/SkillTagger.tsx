"use client";

import { useState } from "react";
import { useProfileStore } from "@/stores/useProfileStore";
import type { Skill } from "@/lib/types";

const LEVEL_COLORS: Record<Skill["level"], string> = {
  beginner: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  intermediate: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  advanced: "bg-emerald-glow/10 text-emerald-glow border-emerald-glow/20",
};

export default function SkillTagger() {
  const { skills, addSkill, removeSkill, updateSkillLevel } = useProfileStore();
  const [input, setInput] = useState("");

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
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-foreground/80 mb-2 block">
          Your Skills
        </label>
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
