"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

interface Example {
  code: string;
  language: string;
  explanation: string;
}

interface ExampleViewerProps {
  examples: Example[];
}

export default function ExampleViewer({ examples }: ExampleViewerProps) {
  if (examples.length === 0) return null;

  return (
    <div className="space-y-4">
      {examples.map((example, i) => (
        <div key={i} className="rounded-xl border border-border-default overflow-hidden">
          {/* Code block */}
          <div className="bg-surface">
            <div className="px-3 py-2 border-b border-border-default flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#d8dada]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#d8dada]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#d8dada]" />
              </div>
              <span className="text-[10px] text-text-muted font-mono">{example.language}</span>
            </div>
            <div className="prose-prepwise p-0">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {`\`\`\`${example.language}\n${example.code}\n\`\`\``}
              </ReactMarkdown>
            </div>
          </div>

          {/* Explanation */}
          <div className="px-4 py-3 bg-white border-t border-border-default">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-success shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
              <p className="text-xs text-text-secondary leading-relaxed">{example.explanation}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
