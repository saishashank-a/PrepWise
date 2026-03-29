"use client";

import { useState } from "react";
import type { ResumeSection } from "@/lib/resumeTypes";

interface Props {
  section: ResumeSection;
  onUpdate: (content: string) => void;
  onRegenerate: () => Promise<void>;
}

export default function SectionEditor({ section, onUpdate, onRegenerate }: Props) {
  const [editing, setEditing] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      await onRegenerate();
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <div className="rounded-xl bg-white border border-border-default p-4 transition-colors hover:border-primary-border">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-semibold">{section.title}</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditing(!editing)}
            className="text-[11px] text-text-secondary hover:text-foreground transition-colors"
          >
            {editing ? "Done" : "Edit"}
          </button>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="text-[11px] text-primary hover:opacity-70 transition-opacity disabled:opacity-40"
          >
            {regenerating ? "..." : "✦ Regenerate"}
          </button>
        </div>
      </div>

      {editing ? (
        <textarea
          value={section.content}
          onChange={(e) => onUpdate(e.target.value)}
          rows={6}
          className="w-full bg-surface border border-border-default rounded-lg p-3 text-[13px] text-foreground
                     resize-none focus:outline-none focus:border-primary-border transition-colors leading-relaxed"
        />
      ) : (
        <div className="text-[13px] text-text-secondary leading-relaxed whitespace-pre-wrap">
          {section.content}
        </div>
      )}
    </div>
  );
}
