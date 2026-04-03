"use client";

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/[0.06]">
      {/* CTA banner */}
      <div className="px-6 py-20 text-center border-b border-white/[0.06]">
        <h2
          className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Land your next role.
        </h2>
        <p className="text-white/40 mb-8 text-[15px]">
          Free. Private. No account required.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold
                     text-[15px] bg-white text-black hover:bg-white/90 transition-colors"
        >
          Get started free
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </div>

      {/* Links */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { heading: "Product", links: ["Features", "Resume Builder", "Study Plan", "Practice"] },
          { heading: "Resources", links: ["Documentation", "Blog", "Changelog", "Roadmap"] },
          { heading: "Community", links: ["GitHub", "Discord", "Twitter", "Contribute"] },
          { heading: "Legal", links: ["Privacy", "Terms", "Cookies"] },
        ].map(({ heading, links }) => (
          <div key={heading}>
            <h4 className="text-[11px] font-mono text-white/25 uppercase tracking-widest mb-4">{heading}</h4>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[13px] text-white/40 hover:text-white/80 transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="max-w-6xl mx-auto px-6 py-6 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="black" />
            </svg>
          </div>
          <span className="text-white/60 text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            PrepWise
          </span>
        </div>
        <p className="text-[12px] text-white/20 font-mono">
          Built with Next.js · Open source · Free forever
        </p>
      </div>
    </footer>
  );
}
