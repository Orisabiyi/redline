"use client";

import { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      tl.fromTo(
        ".wl-label",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      );

      tl.fromTo(
        ".wl-title",
        { y: 60, opacity: 0, clipPath: "inset(100% 0 0 0)" },
        { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 1 },
        0.1
      );

      tl.fromTo(
        ".wl-sub",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.4
      );

      tl.fromTo(
        ".wl-form",
        { y: 40, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8 },
        0.6
      );

      tl.fromTo(
        ".wl-note",
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        0.9
      );
    },
    { scope: sectionRef }
  );

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="waitlist"
      className="relative py-40 px-6 overflow-hidden"
    >
      {/* Dramatic red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#e63946] rounded-full opacity-[0.04] blur-[200px]" />

      {/* Checkered pattern (subtle) */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `repeating-conic-gradient(#fff 0% 25%, transparent 0% 50%)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <p className="wl-label text-[#e63946] text-xs uppercase tracking-[0.3em] mb-6 font-medium">
          Coming soon
        </p>

        <h2 className="wl-title font-display text-6xl md:text-9xl tracking-wider leading-none mb-6">
          BE FIRST ON
          <br />
          <span className="text-gradient-red">THE GRID</span>
        </h2>

        <p className="wl-sub text-neutral-400 text-lg mb-12 max-w-lg mx-auto">
          Join the waitlist and be the first to explore Redline when it launches.
          Free. Open source. Built by car people, for car people.
        </p>

        {status === "success" ? (
          <div className="wl-form inline-flex items-center gap-4 py-5 px-8 rounded-2xl border border-green-500/20 bg-green-500/5">
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-green-300 text-lg">
              You&apos;re on the grid. We&apos;ll be in touch.
            </span>
          </div>
        ) : (
          <div className="wl-form">
            <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl border border-neutral-800 bg-neutral-950/80 backdrop-blur-sm max-w-xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="your@email.com"
                className="flex-1 bg-transparent px-6 py-4 text-white placeholder:text-neutral-600 outline-none text-lg font-light tracking-wide"
                disabled={status === "loading"}
              />
              <button
                onClick={handleSubmit}
                disabled={status === "loading" || !email}
                className="relative px-8 py-4 bg-[#e63946] text-white font-display text-lg tracking-wider rounded-xl hover:bg-[#c1303b] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden group"
              >
                <span className="relative z-10">
                  {status === "loading" ? "JOINING..." : "JOIN"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff4757] to-[#e63946] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            </div>

            {status === "error" && (
              <p className="text-red-400 text-sm mt-4">
                Something went wrong. Try again.
              </p>
            )}
          </div>
        )}

        <p className="wl-note text-neutral-700 text-xs mt-6 tracking-wide">
          No spam. Just a heads up when Revv is ready to roll.
        </p>
      </div>
    </section>
  );
}