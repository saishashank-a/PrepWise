"use client";

import type { Topic, TopicStatus } from "@/lib/types";

const STATUS_CONFIG: Record<TopicStatus, { label: string; color: string; bg: string }> = {
  not_started: {
    label: "Not Started",
    color: "text-text-muted",
    bg: "bg-white border-border-default",
  },
  in_progress: {
    label: "In Progress",
    color: "text-yellow-600",
    bg: "bg-yellow-50 border-yellow-200",
  },
  completed: {
    label: "Completed",
    color: "text-primary",
    bg: "bg-primary-light border-primary-border",
  },
};

const TYPE_LABELS: Record<string, string> = {
  coding: "Coding",
  sql: "SQL",
  conceptual: "Conceptual",
  "system-design": "System Design",
  behavioral: "Behavioral",
};

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string }> = {
  easy: { label: "Easy", color: "text-primary bg-primary-light" },
  medium: { label: "Medium", color: "text-yellow-600 bg-yellow-50" },
  hard: { label: "Hard", color: "text-red-500 bg-red-50" },
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
    <div className={`rounded-xl border p-4 transition-all ${status.bg}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-text-muted font-mono">#{index + 1}</span>
            <a
              href={`/learn/${topic.id}`}
              className="text-sm font-semibold text-foreground truncate hover:text-primary transition-colors"
            >
              {topic.title}
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-border-default text-text-secondary">
              {TYPE_LABELS[topic.type] || topic.type}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-md ${difficulty.color}`}>
              {difficulty.label}
            </span>
            <select
              value={topic.status}
              onChange={(e) => onStatusChange(e.target.value as TopicStatus)}
              className={`text-[10px] px-2 py-0.5 rounded-md border-0 cursor-pointer
                         bg-transparent ${status.color} focus:outline-none`}
            >
              {statuses.map((s) => (
                <option key={s} value={s} className="bg-surface text-foreground">
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
            className="p-1 rounded-md text-text-muted hover:text-foreground hover:bg-surface
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
            className="p-1 rounded-md text-text-muted hover:text-foreground hover:bg-surface
                       transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            title="Move down"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={onRemove}
            className="p-1 rounded-md text-text-muted hover:text-red-500 hover:bg-red-50
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
