"use client";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#080808] flex flex-col items-center justify-center overflow-hidden px-6 pt-16">

      {/* Ambient glow — pure CSS, renders in SSR/headless */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-48"
          style={{ background: "linear-gradient(to top, #080808, transparent)" }} />
      </div>

      {/* Noise grain overlay */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")", backgroundSize: "128px 128px" }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] mb-10"
          style={{ animation: "fadeUp 0.6s ease forwards", opacity: 0 }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: "pulse 2s infinite" }} />
          <span className="text-[11px] font-mono text-white/50 tracking-widest uppercase">
            Your Job Search Companion
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-[clamp(52px,10vw,112px)] font-black leading-[0.92] tracking-[-0.03em] text-white mb-8"
          style={{ fontFamily: "var(--font-display)", animation: "fadeUp 0.7s 0.1s ease forwards", opacity: 0 }}
        >
          The job search,<br />
          <span style={{ color: "rgba(255,255,255,0.35)" }}>rebuilt.</span>
        </h1>

        {/* Sub */}
        <p className="max-w-xl mx-auto text-[17px] text-white/45 leading-relaxed mb-12"
          style={{ animation: "fadeUp 0.7s 0.2s ease forwards", opacity: 0 }}>
          Resume analysis. Gap scoring. Application tracking.
          AI interview prep — tailored to your exact role.
          <br />
          <span className="text-white/65">Free. Private. Runs in your browser.</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          style={{ animation: "fadeUp 0.7s 0.3s ease forwards", opacity: 0 }}>
          <a
            href="/dashboard"
            className="group px-8 py-3.5 rounded-xl font-semibold text-[15px] bg-white text-black
                       hover:bg-white/90 transition-all duration-200 flex items-center gap-2"
          >
            Start for free
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <a
            href="#features"
            className="px-8 py-3.5 rounded-xl font-medium text-[15px] text-white/50
                       border border-white/10 hover:border-white/20 hover:text-white/80
                       transition-all duration-200"
          >
            See how it works
          </a>
        </div>

        {/* Product screenshot */}
        <div className="mt-20 relative"
          style={{ animation: "fadeUp 0.9s 0.5s ease forwards", opacity: 0 }}>
          {/* Glow behind screenshot */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-3/4 h-32 blur-3xl rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 70%)" }} />

          {/* Browser chrome */}
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.08]"
            style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.8)" }}>
            {/* Browser bar */}
            <div className="bg-[#161616] px-4 py-3 flex items-center gap-3 border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              <div className="flex-1 bg-white/[0.04] rounded-md h-6 flex items-center justify-center">
                <span className="text-[11px] text-white/25 font-mono">prepwise.vercel.app/tracker</span>
              </div>
            </div>
            <img
              src="/product/tracker.png"
              alt="PrepWise Application Tracker"
              className="w-full block"
              style={{ imageRendering: "crisp-edges" }}
            />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ animation: "fadeIn 1s 1.2s ease forwards", opacity: 0 }}>
        <span className="text-[10px] font-mono text-white/25 tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
