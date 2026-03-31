"use client";

import type { Topic, TopicStatus } from "@/lib/types";

const STATUS_CONFIG: Record<TopicStatus, { label: string; color: string }> = {
  not_started: {
    label: "Not Started",
    color: "text-[#aaa]",
  },
  in_progress: {
    label: "In Progress",
    color: "text-[#474747]",
  },
  completed: {
    label: "Completed",
    color: "text-[#191c1c]",
  },
};

const TYPE_LABELS: Record<string, string> = {
  coding: "Coding",
  sql: "SQL",
  conceptual: "Conceptual",
  "system-design": "System Design",
  behavioral: "Behavioral",
};

const DIFFICULTY_CONFIG: Record<string, { label: string }> = {
  easy: { label: "Easy" },
  medium: { label: "Medium" },
  hard: { label: "Hard" },
};

interface TopicCardProps {
  topic: Topic;
  index: number;
  total: number;
  onStatusChange: (status: TopicStatus) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

export default function TopicCard({
  topic,
  index,
  total,
  onStatusChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}: TopicCardProps) {
  const status = STATUS_CONFIG[topic.status];
  const difficulty = DIFFICULTY_CONFIG[topic.difficulty];
  const statuses: TopicStatus[] = ["not_started", "in_progress", "completed"];

  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl p-5 hover:shadow-lg hover:shadow-black/5 transition-all duration-200 active:scale-[0.97]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-[#777] font-mono">#{index + 1}</span>
            <a
              href={`/learn/${topic.id}`}
              className="text-sm font-semibold text-[#191c1c] truncate hover:text-black transition-colors"
            >
              {topic.title}
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#e6e9e8] text-[#474747] text-[10px] uppercase tracking-widest px-2 py-0.5">
              {TYPE_LABELS[topic.type] || topic.type}
            </span>
            <span className="bg-[#eceeed] text-[#474747] text-[10px] uppercase tracking-widest px-2 py-0.5">
              {difficulty.label}
            </span>
            <select
              value={topic.status}
              onChange={(e) => onStatusChange(e.target.value as TopicStatus)}
              className={`text-[10px] px-2 py-0.5 border-0 cursor-pointer
                         bg-transparent ${status.color} focus:outline-none`}
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="bg-white text-[#191c1c]">
                  {STATUS_CONFIG[s].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1 rounded-md text-[#777] hover:text-[#191c1c] hover:bg-[#f2f4f3]
                       transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            title="Move up"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="p-1 rounded-md text-[#777] hover:text-[#191c1c] hover:bg-[#f2f4f3]
                       transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            title="Move down"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={onRemove}
            className="p-1 rounded-md text-[#777] hover:text-[#191c1c] hover:bg-[#f2f4f3]
                       transition-colors"
            title="Remove topic"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
