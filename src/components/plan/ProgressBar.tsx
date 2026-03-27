"use client";

interface ProgressBarProps {
  percentage: number;
  total: number;
  completed: number;
}

export default function ProgressBar({ percentage, total, completed }: ProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-muted">
          {completed} of {total} topics completed
        </span>
        <span
          className="font-bold text-emerald-glow"
          style={{ fontFamily: "var(--font-cabinet)" }}
        >
          {percentage}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-surface-elevated border border-border-subtle overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-glow/80 to-cyan-glow/80 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
