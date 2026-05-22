"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const redlineRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Redline accent bar sweeps in
      tl.fromTo(
        redlineRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 1 }
      );

      // Main heading reveals
      tl.fromTo(
        headingRef.current,
        { y: 80, opacity: 0, clipPath: "inset(100% 0 0 0)" },
        { y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 1.2 },
        "-=0.6"
      );

      // Tagline fades in
      tl.fromTo(
        taglineRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.5"
      );

      // Stats count in
      tl.fromTo(
        statsRef.current?.children || [],
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.15 },
        "-=0.3"
      );

      // Parallax on scroll
      gsap.to(headingRef.current, {
        y: -100,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
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
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:72px_72px]" />

      {/* Red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#e63946] rounded-full opacity-[0.04] blur-[150px]" />

      {/* Redline accent bar */}
      <div
        ref={redlineRef}
        className="w-24 h-1 bg-[#e63946] rounded-full mb-8"
      />

      <h1
        ref={headingRef}
        className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-center leading-[0.9]"
      >
        <span className="text-gradient">Every car</span>
        <br />
        <span className="text-gradient-red">has a story</span>
      </h1>

      <p
        ref={taglineRef}
        className="mt-8 text-lg md:text-xl text-neutral-400 text-center max-w-xl leading-relaxed"
      >
        The encyclopedia for car enthusiasts. JDM legends, supercars, classics
        — specs, history, and the stories that made them iconic.
      </p>

      {/* Stats */}
      <div
        ref={statsRef}
        className="flex gap-12 mt-16 text-center"
      >
        {[
          { value: "10+", label: "Iconic cars" },
          { value: "3", label: "Categories" },
          { value: "40+", label: "Variants" },
        ].map((stat) => (
          <div key={stat.label}>
            <div className="text-3xl md:text-4xl font-bold text-gradient-red">
              {stat.value}
            </div>
            <div className="text-sm text-neutral-500 mt-1 uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-neutral-600 uppercase tracking-widest">
          Scroll
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-neutral-600 to-transparent" />
      </div>
    </section>
  );
}