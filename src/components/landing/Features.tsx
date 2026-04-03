"use client";

const features = [
  {
    number: "01",
    eyebrow: "Gap Analysis",
    headline: "Know exactly what's missing.",
    body: "Upload your resume, paste the job description. PrepWise maps your skills against the role and shows you precisely where you fall short — so you know what to fix before you apply.",
    img: "/product/gap-analysis.png",
    alt: "Gap Analysis Dashboard",
    url: "/dashboard",
    cta: "Try gap analysis",
    flip: false,
  },
  {
    number: "02",
    eyebrow: "Application Tracker",
    headline: "Every application.\nOne pipeline.",
    body: "A Kanban board for your job search. Track every company from To Apply through Offer. Never lose track of where you stand or forget to follow up.",
    img: "/product/tracker.png",
    alt: "Application Pipeline",
    url: "/tracker",
    cta: "Open tracker",
    flip: true,
  },
  {
    number: "03",
    eyebrow: "AI Interview Prep",
    headline: "Questions built for your\nexact role.",
    body: "Add a job description and PrepWise generates 8 tailored interview questions — behavioral, technical, and system design. Answer them, get a score, get better.",
    img: "/product/interview-prep.png",
    alt: "Interview Prep",
    url: "/tracker",
    cta: "Prep an interview",
    flip: false,
  },
];

const stats = [
  { value: "50+", label: "Practice problems" },
  { value: "$0", label: "Forever free" },
  { value: "0", label: "Servers you need" },
  { value: "100%", label: "Runs in browser" },
];

export default function Features() {
  return (
    <>
      {/* Stats strip */}
      <div id="features" className="bg-[#0f0f0f] border-y border-white/[0.06] py-12">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="text-4xl font-black text-white mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {s.value}
              </div>
              <div className="text-xs font-mono text-white/35 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature sections */}
      <div id="how-it-works" className="bg-white">
        {features.map((f, i) => (
          <section
            key={f.number}
            className={`relative py-24 md:py-32 border-b border-black/[0.06] ${
              i % 2 === 1 ? "bg-[#f8f8f8]" : "bg-white"
            }`}
          >
            <div className="max-w-6xl mx-auto px-6">
              <div className={`flex flex-col ${f.flip ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-16 md:gap-20`}>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-6">
                    <span
                      className="text-[11px] font-mono text-black/30 tracking-widest uppercase"
                    >
                      {f.number}
                    </span>
                    <span className="w-8 h-px bg-black/15" />
                    <span className="text-[11px] font-mono text-black/30 tracking-widest uppercase">
                      {f.eyebrow}
                    </span>
                  </div>

                  <h2
                    className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05] text-[#0a0a0a] mb-6 whitespace-pre-line"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {f.headline}
                  </h2>

                  <p className="text-[15px] text-[#555] leading-relaxed max-w-md mb-10">
                    {f.body}
                  </p>

                  <a
                    href={f.url}
                    className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#0a0a0a]
                               border border-black/15 rounded-xl px-5 py-3
                               hover:bg-black hover:text-white hover:border-black
                               transition-all duration-200"
                  >
                    {f.cta}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>

                {/* Screenshot */}
                <div className="flex-1 min-w-0 w-full">
                  <div
                    className="rounded-2xl overflow-hidden border border-black/[0.08]"
                    style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)" }}
                  >
                    <img
                      src={f.img}
                      alt={f.alt}
                      className="w-full block"
                    />
                  </div>
                </div>

              </div>
            </div>
          </section>
        ))}
      </div>

      {/* How it works — step flow */}
      <section className="bg-[#080808] py-24 px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-[11px] font-mono text-white/30 tracking-widest uppercase">The flow</span>
          <h2
            className="mt-4 text-4xl md:text-5xl font-black tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            From resume to offer.
          </h2>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-5 gap-0">
          {[
            { step: "01", label: "Upload resume" },
            { step: "02", label: "Analyse gaps" },
            { step: "03", label: "Build study plan" },
            { step: "04", label: "Track applications" },
            { step: "05", label: "Prep interview" },
          ].map((s, i) => (
            <div key={s.step} className="flex flex-col items-center text-center relative">
              {/* Connector line */}
              {i < 4 && (
                <div className="hidden md:block absolute top-5 left-[calc(50%+20px)] right-[-50%] h-px bg-white/10" />
              )}
              <div className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center mb-4 relative z-10">
                <span className="text-[11px] font-mono text-white/40">{s.step}</span>
              </div>
              <span className="text-[13px] text-white/50 leading-snug">{s.label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
