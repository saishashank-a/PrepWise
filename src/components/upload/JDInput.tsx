"use client";

import { useState, useCallback, useRef } from "react";
import { useProfileStore } from "@/stores/useProfileStore";
import { extractSkillsFromText } from "@/lib/skillExtractor";
import { extractJDSkills, isAIConfigured } from "@/lib/ai";
import type { JDSkill } from "@/lib/types";

export default function JDInput() {
  const { jdText, setJDText, jdSkills, addJDSkill, removeJDSkill } = useProfileStore();
  const [skillInput, setSkillInput] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const extractedRef = useRef(false);

  const autoExtractFromJD = useCallback(
    async (text: string) => {
      if (!text || text.length < 20) return;

      setExtracting(true);
      try {
        // Instant keyword extraction
        const keywordSkills = extractSkillsFromText(text);
        for (const name of keywordSkills) {
          addJDSkill({ name, required: true });
        }

        // AI extraction for more nuanced skills
        if (isAIConfigured()) {
          try {
            const aiSkills = await extractJDSkills(text);
            for (const skill of aiSkills) {
              addJDSkill(skill);
            }
          } catch {
            // AI failed — keyword extraction already ran
          }
        }
      } finally {
        setExtracting(false);
        extractedRef.current = true;
      }
    },
    [addJDSkill],
  );

  const handleJDChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJDText(e.target.value);
    extractedRef.current = false;
  };

  const handleJDBlur = () => {
    if (jdText && !extractedRef.current && jdSkills.length === 0) {
      autoExtractFromJD(jdText);
    }
  };

  const handlePaste = () => {
    // Trigger extraction after paste (with small delay to let value update)
    setTimeout(() => {
      const text = useProfileStore.getState().jdText;
      if (text && !extractedRef.current) {
        autoExtractFromJD(text);
      }
    }, 100);
  };

  const handleAddSkill = () => {
    const name = skillInput.trim();
    if (!name) return;
    addJDSkill({ name, required: true });
    setSkillInput("");
  };

  return (
    <div className="space-y-5">
      {/* JD Text Area */}
      <div>
        <label className="text-sm font-medium text-[#191c1c] mb-2 block">
          Job Description
        </label>
        <textarea
          value={jdText}
          onChange={handleJDChange}
          onBlur={handleJDBlur}
          onPaste={handlePaste}
          placeholder="Paste the job description here — skills will be auto-extracted..."
          rows={6}
          className="w-full px-4 py-3 rounded-xl bg-white border border-black/[0.06]
                     text-sm text-[#191c1c] placeholder:text-[#777] leading-relaxed resize-y
                     focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10 transition-colors"
        />
        {extracting && (
          <p className="text-xs text-[#777] mt-1 flex items-center gap-1.5">
            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Extracting skills from job description...
          </p>
        )}
      </div>

      {/* Required Skills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-[#191c1c]">
            Required Skills
            {jdSkills.length > 0 && (
              <span className="ml-2 text-xs text-[#777] font-normal">({jdSkills.length})</span>
            )}
          </label>
          <div className="flex items-center gap-3">
            {jdText && jdSkills.length === 0 && !extracting && (
              <button
                onClick={() => autoExtractFromJD(jdText)}
                className="text-[10px] text-[#474747] hover:text-[#191c1c] transition-colors"
              >
                Re-extract skills
              </button>
            )}
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="text-[10px] text-[#474747] hover:text-[#191c1c] transition-colors"
            >
              {showAdd ? "Hide" : "+ Add manually"}
            </button>
          </div>
        </div>

        {showAdd && (
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
              placeholder="Add required skill (e.g. Kubernetes, GraphQL)"
              className="flex-1 px-4 py-2 rounded-xl bg-white border border-black/[0.06]
                         text-sm text-[#191c1c] placeholder:text-[#777]
                         focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10 transition-colors"
            />
            <button
              onClick={handleAddSkill}
              disabled={!skillInput.trim()}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-black text-white
                         hover:bg-black/90 transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Skill tags */}
      {jdSkills.length > 0 ? (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {jdSkills.map((skill: JDSkill) => (
              <div
                key={skill.name}
                className="group flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-lg border text-xs font-medium
                           bg-white border-black/10 text-[#191c1c]
                           hover:bg-black hover:text-white hover:border-black transition-all"
              >
                <span>{skill.name}</span>
                {skill.required && <span className="text-[9px] opacity-50">req</span>}
                <button
                  onClick={() => removeJDSkill(skill.name)}
                  className="w-5 h-5 rounded-md flex items-center justify-center opacity-40 hover:opacity-100 transition-all"
                  title="Remove skill"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-[#777]">
              Auto-extracted from JD. Click × to remove, or add more manually.
            </p>
            <button
              onClick={() => jdSkills.forEach((s: JDSkill) => removeJDSkill(s.name))}
              className="text-[10px] text-[#777] hover:text-[#191c1c] transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>
      ) : (
        !extracting && (
          <p className="text-xs text-[#777] py-1">
            {jdText ? "No skills detected yet. Try pasting the full job description." : "Paste a job description above to auto-extract required skills."}
          </p>
        )
      )}
    </div>
  );
}
