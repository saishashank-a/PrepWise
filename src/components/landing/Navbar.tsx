"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Resume Builder", href: "/resume-builder" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useGSAP(
    () => {
      gsap.from(navRef.current, {
        y: -80,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        delay: 0.1,
      });
    },
    { scope: navRef }
  );

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-black/10 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div
              className={`w-8 h-8 flex items-center justify-center border transition-colors duration-300 ${
                scrolled
                  ? "border-black/20 bg-white"
                  : "border-white/20 bg-white/5"
              }`}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className={scrolled ? "text-black" : "text-white"}
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
              </svg>
            </div>
            <span
              className={`text-base font-bold tracking-tight transition-colors duration-300 ${
                scrolled ? "text-black" : "text-white"
              }`}
              style={{ fontFamily: "var(--font-cabinet)" }}
            >
              PrepWise
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`px-4 py-2 text-sm transition-colors duration-200 ${
                  scrolled
                    ? "text-black/50 hover:text-black"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#"
              className={`text-sm transition-colors duration-200 ${
                scrolled ? "text-black/50 hover:text-black" : "text-white/40 hover:text-white"
              }`}
            >
              Sign In
            </a>
            <a
              href="/dashboard"
              className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                scrolled
                  ? "bg-black text-white hover:bg-black/80"
                  : "bg-white text-black hover:bg-white/90"
              }`}
            >
              Get Started
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-[1.5px] transition-all duration-300 ${
                scrolled ? "bg-black" : "bg-white"
              } ${mobileOpen ? "rotate-45 translate-y-[4px]" : ""}`}
            />
            <span
              className={`block w-5 h-[1.5px] transition-all duration-300 ${
                scrolled ? "bg-black" : "bg-white"
              } ${mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 pt-20 bg-black/98 backdrop-blur-xl md:hidden flex flex-col items-center justify-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-2xl font-light text-white/60 hover:text-white transition-colors"
              style={{ fontFamily: "var(--font-cabinet)" }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/dashboard"
            className="mt-4 px-10 py-4 bg-white text-black font-semibold text-sm"
          >
            Get Started Free
          </a>
        </div>
      )}
    </>
  );
}
