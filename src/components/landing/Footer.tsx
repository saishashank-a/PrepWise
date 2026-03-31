"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".footer-cta-text .char", {
        y: "105%",
        duration: 0.9,
        stagger: 0.018,
        ease: "power4.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      gsap.from(".footer-links-group", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".footer-links",
          start: "top 85%",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <footer ref={sectionRef} className="relative bg-white border-t border-black/10">
      {/* Large CTA block */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 border-b border-black/8">
        <div className="max-w-3xl">
          <span className="text-[10px] font-mono text-black/30 tracking-[0.3em] uppercase block mb-6">
            Get Started
          </span>
          <h2
            className="footer-cta-text text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-[0.9] mb-8"
            style={{ fontFamily: "var(--font-cabinet)" }}
          >
            {/* Character split for GSAP */}
            {"Ready to land".split("").map((char, i) => (
              <span
                key={i}
                style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
              >
                <span className="char" style={{ display: "inline-block" }}>
                  {char === " " ? "\u00A0" : char}
                </span>
              </span>
            ))}
            <br />
            {"your next role?".split("").map((char, i) => (
              <span
                key={`b${i}`}
                style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
              >
                <span className="char" style={{ display: "inline-block" }}>
                  {char === " " ? "\u00A0" : char}
                </span>
              </span>
            ))}
          </h2>
          <p className="text-black/40 text-base mb-10 max-w-md">
            Upload your resume, check your ATS score, tailor for the role,
            and prep for the interview — all in one place, completely free.
          </p>
          <a
            href="/dashboard"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-black text-white text-sm
                       font-semibold hover:bg-black/80 transition-colors duration-200"
          >
            Start Free
            <svg
              className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>

      {/* Footer links */}
      <div className="footer-links max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="footer-links-group col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-black flex items-center justify-center">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
                </svg>
              </div>
              <span
                className="text-sm font-bold text-black"
                style={{ fontFamily: "var(--font-cabinet)" }}
              >
                PrepWise
              </span>
            </div>
            <p className="text-xs text-black/35 leading-relaxed">
              The complete job search OS.
              <br />
              Free. Private. Runs in your browser.
            </p>
          </div>

          {[
            {
              heading: "Product",
              links: ["Features", "Resume Builder", "Study Plans", "Practice"],
            },
            {
              heading: "Resources",
              links: ["Documentation", "Blog", "Changelog", "Roadmap"],
            },
            {
              heading: "Community",
              links: ["GitHub", "Discord", "Twitter", "Contribute"],
            },
            {
              heading: "Legal",
              links: ["Privacy", "Terms", "Cookies"],
            },
          ].map((col) => (
            <div key={col.heading} className="footer-links-group">
              <h4 className="text-[10px] font-mono text-black/40 tracking-[0.2em] uppercase mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-black/45 hover:text-black transition-colors duration-200"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-16 pt-8 border-t border-black/8">
          <p className="text-[11px] font-mono text-black/25 mb-2 md:mb-0">
            © 2024 PrepWise. Open source & free forever.
          </p>
          <p className="text-[11px] font-mono text-black/25">
            Built with Next.js · Three.js · WebAssembly
          </p>
        </div>
      </div>
    </footer>
  );
}
