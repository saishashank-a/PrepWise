"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const codeLines = [
  { indent: 0, tokens: [{ text: "def ", cls: "text-[#c678dd]" }, { text: "two_sum", cls: "text-[#61afef]" }, { text: "(nums, target):", cls: "text-[#abb2bf]" }] },
  { indent: 1, tokens: [{ text: '"""Find two numbers that add up to target."""', cls: "text-[#98c379]" }] },
  { indent: 1, tokens: [{ text: "seen = {}", cls: "text-[#abb2bf]" }] },
  { indent: 1, tokens: [{ text: "for ", cls: "text-[#c678dd]" }, { text: "i, num ", cls: "text-[#e06c75]" }, { text: "in ", cls: "text-[#c678dd]" }, { text: "enumerate", cls: "text-[#61afef]" }, { text: "(nums):", cls: "text-[#abb2bf]" }] },
  { indent: 2, tokens: [{ text: "complement = target - num", cls: "text-[#abb2bf]" }] },
  { indent: 2, tokens: [{ text: "if ", cls: "text-[#c678dd]" }, { text: "complement ", cls: "text-[#e06c75]" }, { text: "in ", cls: "text-[#c678dd]" }, { text: "seen:", cls: "text-[#abb2bf]" }] },
  { indent: 3, tokens: [{ text: "return ", cls: "text-[#c678dd]" }, { text: "[seen[complement], i]", cls: "text-[#d19a66]" }] },
  { indent: 2, tokens: [{ text: "seen[num] = i", cls: "text-[#abb2bf]" }] },
  { indent: 1, tokens: [{ text: "return ", cls: "text-[#c678dd]" }, { text: "[]", cls: "text-[#d19a66]" }] },
  { indent: 0, tokens: [{ text: "", cls: "" }] },
  { indent: 0, tokens: [{ text: "# Test", cls: "text-[#5c6370]" }] },
  { indent: 0, tokens: [{ text: "print", cls: "text-[#61afef]" }, { text: "(two_sum([", cls: "text-[#abb2bf]" }, { text: "2, 7, 11, 15", cls: "text-[#d19a66]" }, { text: "], ", cls: "text-[#abb2bf]" }, { text: "9", cls: "text-[#d19a66]" }, { text: "))", cls: "text-[#abb2bf]" }] },
];

const testResults = [
  { name: "Basic case [2,7,11,15], target=9", passed: true, output: "[0, 1]" },
  { name: "Negative numbers [-1,-2,-3,-4,-5], target=-8", passed: true, output: "[2, 4]" },
  { name: "Duplicate values [3,3], target=6", passed: true, output: "[0, 1]" },
  { name: "No solution [1,2,3], target=7", passed: true, output: "[]" },
];

function CodeLine({
  line,
  index,
  visible,
}: {
  line: (typeof codeLines)[0];
  index: number;
  visible: boolean;
}) {
  const indent = "\u00A0\u00A0".repeat(line.indent);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={visible ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="flex"
    >
      <span className="w-8 text-right pr-4 text-[#4b5263] select-none text-xs">
        {index + 1}
      </span>
      <span className="code-line text-sm">
        {indent}
        {line.tokens.map((token, ti) => (
          <span key={ti} className={token.cls}>
            {token.text}
          </span>
        ))}
      </span>
    </motion.div>
  );
}

export default function EditorPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [showOutput, setShowOutput] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "tests">("code");

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => setShowOutput(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  return (
    <section id="editor" className="relative py-32 overflow-hidden bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-mono text-primary tracking-widest uppercase mb-4 block">
            Code Editor
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground"
            style={{ fontFamily: "var(--font-cabinet)" }}
          >
            Write. Run. <span className="gradient-text">Verify.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-text-secondary text-lg">
            Full-featured code editor with in-browser execution. No setup, no
            installs — just open and code.
          </p>
        </motion.div>

        {/* Editor mockup */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Subtle glow behind editor */}
          <div className="absolute -inset-4 bg-primary/[0.03] rounded-3xl blur-2xl" />

          <div className="relative rounded-2xl overflow-hidden border border-border-default shadow-xl">
            {/* Title bar — keep dark for authentic IDE feel */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#1e1e1e] border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="ml-3 text-xs text-[#6b7280] font-mono">
                  two_sum.py
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Language selector */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08]">
                  <div className="w-3 h-3 rounded-sm bg-[#3572A5]" />
                  <span className="text-xs text-[#9ca3af] font-mono">
                    Python
                  </span>
                  <svg
                    className="w-3 h-3 text-[#6b7280]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {/* Run button */}
                <button className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary/20 border border-primary/30 text-primary text-xs font-medium hover:bg-primary/30 transition-colors">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Run
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row">
              {/* Code panel */}
              <div className="flex-1 bg-[#1e1e1e] p-4 min-h-[360px]">
                <div className="space-y-0.5">
                  {codeLines.map((line, i) => (
                    <CodeLine key={i} line={line} index={i} visible={inView} />
                  ))}
                </div>
              </div>

              {/* Output / Tests panel */}
              <div className="w-full md:w-[340px] border-t md:border-t-0 md:border-l border-white/[0.06] bg-[#1a1a1a]">
                {/* Tabs */}
                <div className="flex border-b border-white/[0.06]">
                  {(["code", "tests"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-4 py-2.5 text-xs font-mono capitalize transition-colors ${
                        activeTab === tab
                          ? "text-[#60a5fa] border-b border-[#60a5fa] bg-white/[0.02]"
                          : "text-[#6b7280] hover:text-[#9ca3af]"
                      }`}
                    >
                      {tab === "code" ? "Output" : "Test Cases"}
                    </button>
                  ))}
                </div>

                <div className="p-4">
                  {activeTab === "code" ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={showOutput ? { opacity: 1 } : {}}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2 text-xs text-[#6b7280] font-mono">
                        <span className="text-[#60a5fa]">$</span> python
                        two_sum.py
                      </div>
                      <div className="text-sm font-mono text-[#98c379]">
                        [0, 1]
                      </div>
                      <div className="text-xs text-[#4b5263] font-mono mt-4">
                        Executed in 0.003s via Pyodide (WebAssembly)
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-2">
                      {testResults.map((test, i) => (
                        <motion.div
                          key={test.name}
                          initial={{ opacity: 0, x: 10 }}
                          animate={showOutput ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-2 p-2 rounded-lg bg-white/[0.02]"
                        >
                          <span className="mt-0.5 text-[#34d399] text-xs">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>
                          <div>
                            <div className="text-xs text-[#abb2bf] font-mono leading-tight">
                              {test.name}
                            </div>
                            <div className="text-[10px] text-[#5c6370] font-mono mt-0.5">
                              Output: {test.output}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      <div className="mt-3 pt-3 border-t border-white/[0.06] text-xs font-mono text-[#34d399]">
                        4/4 tests passed
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
