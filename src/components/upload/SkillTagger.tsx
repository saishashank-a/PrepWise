"use client";

import { useState } from "react";
import { useProfileStore } from "@/stores/useProfileStore";
import type { Skill } from "@/lib/types";

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
        <label className="text-sm font-medium text-black">
          Your Skills
          {skills.length > 0 && (
            <span className="ml-2 text-xs text-[#474747] font-normal">({skills.length})</span>
          )}
        </label>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-[10px] text-[#474747] hover:text-black transition-colors"
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
            className="flex-1 px-4 py-2 rounded-xl bg-[#f2f4f3] border border-black/[0.06]
                       text-sm text-black placeholder:text-[#888]
                       focus:outline-none focus:border-black/20 transition-colors"
          />
          <button
            onClick={handleAdd}
            disabled={!input.trim()}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-black text-white
                       hover:bg-black/85 transition-colors
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
              className="group flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-lg border
                         bg-white border-black/10 text-[#191c1c] text-sm font-medium
                         hover:bg-black hover:text-white hover:border-black transition-all duration-150"
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
                className="w-5 h-5 rounded-md flex items-center justify-center opacity-40 hover:opacity-100 hover:bg-black/10 transition-all"
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
        <p className="text-xs text-[#888] py-2">
          Upload your resume above to auto-extract skills, or add them manually.
        </p>
      )}

      {skills.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-[#888]">
            Click level to cycle: Beginner → Intermediate → Advanced. Click × to remove.
          </p>
          {skills.length > 1 && (
            <button
              onClick={() => skills.forEach((s) => removeSkill(s.name))}
              className="text-[10px] text-[#888] hover:text-black transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}
