"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Upload Your Resume",
    description:
      "Drop your PDF or DOCX. Our in-browser parser extracts your skills instantly and runs an ATS compatibility check — no data leaves your machine.",
    tag: "Privacy-first",
  },
  {
    number: "02",
    title: "Check Your ATS Score",
    description:
      "Paste any job description and instantly see your ATS compatibility score, missing keywords, and formatting issues. Know exactly where you stand.",
    tag: "Instant feedback",
  },
  {
    number: "03",
    title: "Tailor & Apply",
    description:
      "Generate a role-specific resume tailored to the job description. Download as PDF or DOCX and track your application in the Kanban board.",
    tag: "AI-powered",
  },
  {
    number: "04",
    title: "Prepare & Practice",
    description:
      "Build a study plan for your interviews. Practice coding, SQL, and system design — all in your browser. Show up to every interview ready.",
    tag: "In-browser IDE",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Header reveal
      gsap.from(".hiw-header", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      // Each step: line grows, then content fades in
      const stepEls = sectionRef.current?.querySelectorAll<HTMLElement>(".hiw-step");
      stepEls?.forEach((step) => {
        const line = step.querySelector<HTMLElement>(".step-line");
        const content = step.querySelector<HTMLElement>(".step-content");

        gsap.from(line, {
          scaleY: 0,
          transformOrigin: "top center",
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: step,
            start: "top 75%",
          },
        });

        gsap.from(content, {
          opacity: 0,
          x: -24,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: step,
            start: "top 70%",
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative py-32 bg-white"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="hiw-header mb-20">
          <span className="text-[10px] font-mono text-black/30 tracking-[0.3em] uppercase block mb-4">
            How It Works
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight"
            style={{ fontFamily: "var(--font-cabinet)" }}
          >
            Four steps to
            <br />
            your next role.
          </h2>
        </div>

        {/* Steps */}
        <div className="space-y-0">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="hiw-step flex gap-8 md:gap-16 group"
            >
              {/* Left: number + vertical line */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-10 h-10 flex items-center justify-center border border-black/15 text-[11px] font-mono text-black/40">
                  {step.number}
                </div>
                {i < steps.length - 1 && (
                  <div className="step-line w-px flex-1 mt-2 bg-black/10 min-h-[80px]" />
                )}
              </div>

              {/* Right: content */}
              <div className="step-content pb-16 pt-1 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-mono text-black/30 border border-black/10 px-2 py-1 tracking-widest uppercase">
                    {step.tag}
                  </span>
                </div>
                <h3
                  className="text-2xl md:text-3xl font-bold text-black mb-4 leading-tight"
                  style={{ fontFamily: "var(--font-cabinet)" }}
                >
                  {step.title}
                </h3>
                <p className="text-black/50 leading-relaxed max-w-lg text-sm md:text-base">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
