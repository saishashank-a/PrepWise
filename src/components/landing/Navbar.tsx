"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Editor", href: "#editor" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-emerald-glow/20 rounded-lg blur-md group-hover:bg-emerald-glow/30 transition-colors" />
              <div className="relative w-full h-full bg-surface-elevated rounded-lg border border-emerald-glow/20 flex items-center justify-center">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-emerald-glow"
                >
                  <path
                    d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
            <span
              className="text-lg font-bold tracking-tight"
              style={{ fontFamily: "var(--font-cabinet)" }}
            >
              Prep<span className="text-emerald-glow">Wise</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm text-text-muted hover:text-foreground transition-colors rounded-lg hover:bg-white/[0.03]"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#"
              className="px-4 py-2 text-sm text-text-muted hover:text-foreground transition-colors"
            >
              Sign In
            </a>
            <a
              href="/dashboard"
              className="relative px-5 py-2.5 text-sm font-medium bg-emerald-glow/10 text-emerald-glow rounded-lg
                         border border-emerald-glow/20 hover:bg-emerald-glow/15 hover:border-emerald-glow/30
                         transition-all duration-300 group"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 rounded-lg bg-emerald-glow/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          >
            <span
              className={`block w-5 h-[1.5px] bg-foreground transition-all ${
                mobileOpen ? "rotate-45 translate-y-[4px]" : ""
              }`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-foreground transition-all ${
                mobileOpen ? "-rotate-45 -translate-y-[3px]" : ""
              }`}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 pt-20 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col items-center gap-6 pt-10">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-light text-text-muted hover:text-foreground transition-colors"
                  style={{ fontFamily: "var(--font-cabinet)" }}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#"
                className="mt-4 px-8 py-3 bg-emerald-glow/10 text-emerald-glow rounded-lg border border-emerald-glow/20"
              >
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
