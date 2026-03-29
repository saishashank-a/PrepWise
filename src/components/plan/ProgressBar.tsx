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
        <span className="text-text-secondary">
          {completed} of {total} topics completed
        </span>
        <span
          className="font-bold text-primary"
          style={{ fontFamily: "var(--font-cabinet)" }}
        >
          {percentage}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-white border border-border-default overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
