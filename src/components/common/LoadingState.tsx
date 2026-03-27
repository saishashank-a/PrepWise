"use client";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 border-2 border-emerald-glow/20 rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-emerald-glow rounded-full animate-spin" />
      </div>
      <p className="text-xs text-text-dim">{message}</p>
    </div>
  );
}
