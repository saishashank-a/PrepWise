"use client";

const included = [
  "Resume upload & ATS scoring",
  "Skill gap analysis vs any job description",
  "AI resume tailoring (bring your own API key)",
  "PDF & DOCX export",
  "Application tracker — Kanban board",
  "AI interview prep — role-specific questions",
  "Study plan builder",
  "50+ coding practice problems",
  "In-browser Python, SQL & JS execution",
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-white py-24 px-6 border-t border-black/[0.06]">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <span className="text-[11px] font-mono text-black/30 tracking-widest uppercase">Pricing</span>
        <h2
          className="mt-4 text-5xl md:text-6xl font-black tracking-tight text-[#0a0a0a]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Free.<br />Forever.
        </h2>
        <p className="mt-4 text-[15px] text-[#666] max-w-sm mx-auto">
          No credit card. No trial period. No catch.
          Everything runs in your browser.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="rounded-2xl border border-black/[0.08] overflow-hidden"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}>

          {/* Header */}
          <div className="bg-[#0a0a0a] px-8 py-8">
            <div className="flex items-end gap-2 mb-2">
              <span
                className="text-6xl font-black text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                $0
              </span>
              <span className="text-white/35 text-sm mb-3 font-mono">/ month</span>
            </div>
            <p className="text-white/40 text-sm">Everything included, always.</p>
          </div>

          {/* Features list */}
          <div className="bg-white px-8 py-8">
            <ul className="space-y-3.5 mb-8">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14px] text-[#333]">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#0a0a0a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="/dashboard"
              className="block w-full py-3.5 rounded-xl text-center font-semibold text-[15px]
                         bg-[#0a0a0a] text-white hover:bg-black/80 transition-colors"
            >
              Get started — it's free
            </a>

            <p className="text-center text-[12px] text-black/25 mt-4 font-mono">
              No account required to start
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
