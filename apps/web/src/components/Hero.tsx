"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tachRef = useRef<SVGPathElement>(null);
  const needleRef = useRef<SVGGElement>(null);
  const titleCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const redlineBarRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const title = "REDLINE";

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.3,
      });

      // Tachometer arc draws in
      tl.fromTo(
        tachRef.current,
        { strokeDashoffset: 800 },
        { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" }
      );

      // Needle sweeps to redline
      tl.fromTo(
        needleRef.current,
        { rotation: -120, transformOrigin: "100% 100%" },
        { rotation: 30, duration: 1.8, ease: "power2.inOut" },
        0
      );

      // Each character drops in
      titleCharsRef.current.forEach((char, i) => {
        if (!char) return;
        tl.fromTo(
          char,
          { y: 120, opacity: 0, rotateX: -80 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          0.8 + i * 0.08
        );
      });

      // Red bar sweeps across
      tl.fromTo(
        redlineBarRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1.2, ease: "power3.inOut" },
        1.2
      );

      // Subtitle fades up
      tl.fromTo(
        subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        1.8
      );

      // CTA fades in
      tl.fromTo(
        ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        2.2
      );

      // Parallax on scroll — everything moves at different speeds
      gsap.to(".hero-title", {
        y: -200,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      gsap.to(".hero-subtitle", {
        y: -100,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      gsap.to(".hero-tach", {
        y: -300,
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "80% top",
          scrub: 1,
        },
      });

      // Fade entire hero on scroll
      gsap.to(containerRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "60% top",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Speed lines background */}
      <div className="speed-lines" />

      {/* Tachometer arc — massive, background element */}
      <div className="hero-tach absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          viewBox="0 0 500 500"
          className="w-[700px] h-[700px] md:w-[900px] md:h-[900px] opacity-[0.06]"
        >
          {/* Tach arc */}
          <path
            ref={tachRef}
            d="M 100 400 A 200 200 0 1 1 400 400"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="800"
            strokeDashoffset="800"
            strokeLinecap="round"
          />
          {/* Redline zone */}
          <path
            d="M 350 135 A 200 200 0 0 1 400 400"
            fill="none"
            stroke="#e63946"
            strokeWidth="4"
            opacity="0.4"
          />
          {/* Tick marks */}
          {Array.from({ length: 11 }).map((_, i) => {
            const angle = -210 + i * 24;
            const rad = (angle * Math.PI) / 180;
            const innerR = 170;
            const outerR = 190;
            const cx = 250;
            const cy = 400 - 200 + 200;
            return (
              <line
                key={i}
                x1={cx + innerR * Math.cos(rad)}
                y1={cy + innerR * Math.sin(rad)}
                x2={cx + outerR * Math.cos(rad)}
                y2={cy + outerR * Math.sin(rad)}
                stroke={i >= 8 ? "#e63946" : "white"}
                strokeWidth={i % 2 === 0 ? "2" : "1"}
                opacity={i >= 8 ? "0.6" : "0.3"}
              />
            );
          })}
          {/* Needle */}
          <g ref={needleRef} style={{ transformOrigin: "250px 350px" }}>
            <line
              x1="250"
              y1="350"
              x2="250"
              y2="180"
              stroke="#e63946"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="250" cy="350" r="6" fill="#e63946" />
          </g>
        </svg>
      </div>

      {/* Red ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#e63946] rounded-full pulse-glow blur-[200px]" />

      {/* Main title — character by character */}
      <div className="hero-title relative z-10 perspective-[1000px]">
        <h1 className="font-display text-[clamp(5rem,15vw,14rem)] leading-none tracking-[0.05em] text-center">
          {title.split("").map((char, i) => (
            <span
              key={i}
              ref={(el) => { titleCharsRef.current[i] = el; }}
              className="inline-block opacity-0"
              style={{
                textShadow:
                  char === "R" || char === "E"
                    ? "0 0 80px rgba(230, 57, 70, 0.3)"
                    : "none",
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Red accent bar under the title */}
        <div
          ref={redlineBarRef}
          className="h-[3px] bg-gradient-to-r from-transparent via-[#e63946] to-transparent mt-4"
        />
      </div>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="hero-subtitle relative z-10 mt-8 text-lg md:text-2xl text-neutral-400 text-center max-w-2xl leading-relaxed font-light tracking-wide px-6 opacity-0"
      >
        The encyclopedia for car enthusiasts.
        <br />
        <span className="text-neutral-500">
          JDM legends. Supercars. Classics.
        </span>
      </p>

      {/* CTA */}
      <div ref={ctaRef} className="relative z-10 mt-12 opacity-0">
        <a
          href="#waitlist"
          className="group relative inline-flex items-center gap-3 px-8 py-4 border border-neutral-700 rounded-full text-sm uppercase tracking-[0.15em] font-medium text-neutral-300 hover:text-white hover:border-[#e63946] transition-all duration-500 overflow-hidden"
        >
          <span className="relative z-10">Join the waitlist</span>
          <svg
            className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-[#e63946]/0 to-[#e63946]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <span className="text-[10px] text-neutral-600 uppercase tracking-[0.3em] font-medium">
          Explore
        </span>
        <div className="w-[1px] h-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#e63946] to-transparent animate-[scrollPulse_2s_ease-in-out_infinite]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollPulse {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(0%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </section>
  );
}