"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    number: "01",
    title: "ATS Resume Scanner",
    description:
      "Check your resume's ATS compatibility score instantly. Get keyword match analysis, formatting feedback, and actionable improvements — all in your browser.",
  },
  {
    number: "02",
    title: "Gap Analysis",
    description:
      "See exactly which skills you're missing for a role. Compare your resume against any job description instantly and know where to focus.",
  },
  {
    number: "03",
    title: "AI Resume Tailoring",
    description:
      "Generate role-specific resumes tailored to each job description. Edit section-by-section or get a complete rewrite. Export as PDF or DOCX.",
  },
  {
    number: "04",
    title: "Application Tracker",
    description:
      "Track every application in a Kanban board. Monitor statuses from applied to offered. Never lose track of where you stand.",
  },
  {
    number: "05",
    title: "In-Browser Code Practice",
    description:
      "Full code editor with Python, SQL, and JavaScript execution. No setup needed — write code, run it, get instant feedback.",
  },
  {
    number: "06",
    title: "AI-Powered Prep",
    description:
      "Get AI feedback on your code, generate personalized study plans, and practice with an AI interview coach. Bring your own API key.",
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const slider = sliderRef.current;
      if (!slider) return;

      // Animate header in with ScrollTrigger
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Horizontal scroll: pin section, translate slider left
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.to(slider, {
          x: () => -(slider.scrollWidth - window.innerWidth + 96),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            pin: true,
            scrub: 1.2,
            end: () => `+=${slider.scrollWidth - window.innerWidth + 96}`,
            invalidateOnRefresh: true,
          },
        });

        // Each card fades + rises slightly as it enters
        const cards = slider.querySelectorAll<HTMLElement>(".feature-card");
        cards.forEach((card) => {
          gsap.from(card, {
            opacity: 0,
            y: 24,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "left 85%",
              toggleActions: "play none none none",
            },
          });
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="features" className="bg-white overflow-hidden">
      {/* Inner sticky container */}
      <div className="h-screen flex flex-col justify-center">
        {/* Section header */}
        <div ref={headerRef} className="px-8 md:px-16 mb-14 flex items-end justify-between max-w-none">
          <div>
            <span className="text-[10px] font-mono text-black/30 tracking-[0.3em] uppercase block mb-3">
              Features
            </span>
            <h2
              className="text-4xl md:text-5xl font-bold text-black leading-tight"
              style={{ fontFamily: "var(--font-cabinet)" }}
            >
              Everything you need
              <br />
              to get hired.
            </h2>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-black/40 text-sm max-w-xs leading-relaxed">
              A complete job search workflow
              <br />
              that runs entirely in your browser.
            </p>
            <div className="mt-4 flex items-center justify-end gap-2 text-[11px] font-mono text-black/30">
              <span>Scroll to explore</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Horizontal slider */}
        <div
          ref={sliderRef}
          className="flex gap-5 pl-8 md:pl-16 pr-16"
          style={{ width: "max-content" }}
        >
          {features.map((feature) => (
            <div
              key={feature.number}
              className="feature-card flex-shrink-0 w-72 md:w-80 border border-black/10 p-8 flex flex-col
                         hover:border-black/25 transition-colors duration-300 group"
            >
              <div
                className="text-[11px] font-mono text-black/25 mb-8 tracking-widest"
              >
                {feature.number}
              </div>
              <h3
                className="text-lg font-bold text-black mb-4 leading-tight group-hover:text-black/70 transition-colors"
                style={{ fontFamily: "var(--font-cabinet)" }}
              >
                {feature.title}
              </h3>
              <p className="text-sm text-black/45 leading-relaxed mt-auto">
                {feature.description}
              </p>

              {/* Bottom arrow */}
              <div className="mt-8 flex items-center gap-2 text-[11px] font-mono text-black/20 group-hover:text-black/50 transition-colors">
                <div className="w-4 h-px bg-current" />
                <span className="tracking-widest uppercase">Learn more</span>
              </div>
            </div>
          ))}

          {/* End spacer card */}
          <div className="flex-shrink-0 w-32" />
        </div>
      </div>
    </section>
  );
}
