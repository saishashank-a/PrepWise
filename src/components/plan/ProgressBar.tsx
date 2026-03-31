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
        <span className="text-[#474747]">
          {completed} of {total} topics completed
        </span>
        <span
          className="font-bold text-[#191c1c]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {percentage}%
        </span>
      </div>
      <div className="h-2 rounded-none bg-[#e1e3e2] overflow-hidden">
        <div
          className="h-full rounded-none bg-black transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
