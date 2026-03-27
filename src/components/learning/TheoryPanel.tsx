"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

interface TheoryPanelProps {
  content: string;
}

export default function TheoryPanel({ content }: TheoryPanelProps) {
  if (!content) {
    return (
      <div className="rounded-lg bg-surface border border-border-subtle p-4">
        <p className="text-xs text-text-dim italic">No theory content available yet.</p>
      </div>
    );
  }

  return (
    <div className="prose-prepwise">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>
    </div>
  );
}
