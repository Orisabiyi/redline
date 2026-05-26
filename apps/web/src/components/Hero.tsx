"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const images = [
  {
    src: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80",
    alt: "Red sports car",
    width: 280,
    height: 380,
    position: "top-[8%] right-[6%] md:right-[12%]",
    size: "w-[100px] sm:w-[140px] md:w-[220px] lg:w-[300px]",
    rotate: "rotate-3",
    hideOnMobile: false,
  },
  {
    src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
    alt: "Porsche front",
    width: 320,
    height: 220,
    position: "top-[20%] left-[3%] md:left-[8%]",
    size: "w-[110px] sm:w-[150px] md:w-[230px] lg:w-[300px]",
    rotate: "-rotate-2",
    hideOnMobile: false,
  },
  {
    src: "https://images.unsplash.com/photo-1584345604325-f5091269a0d1?q=80",
    alt: "Classic car detail",
    width: 240,
    height: 320,
    position: "top-[45%] right-[3%] md:right-[6%]",
    size: "w-[90px] sm:w-[120px] md:w-[200px] lg:w-[300px]",
    rotate: "rotate-1",
    hideOnMobile: true,
  },
  {
    src: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600&q=80",
    alt: "JDM car night",
    width: 300,
    height: 200,
    position: "top-[55%] left-[2%] md:left-[10%]",
    size: "w-[100px] sm:w-[140px] md:w-[220px] lg:w-[300px]",
    rotate: "-rotate-3",
    hideOnMobile: true,
  },
  {
    src: "https://images.unsplash.com/photo-1633767859621-c44623dbf8bd?q=80",
    alt: "Supercar rear",
    width: 200,
    height: 280,
    position: "top-[72%] right-[8%] md:right-[15%]",
    size: "w-[90px] sm:w-[120px] md:w-[190px] lg:w-[300px]",
    rotate: "rotate-2",
    hideOnMobile: true,
  },
  {
    src: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80",
    alt: "Ferrari side",
    width: 260,
    height: 180,
    position: "top-[80%] left-[4%] md:left-[14%]",
    size: "w-[100px] sm:w-[140px] md:w-[210px] lg:w-[300px]",
    rotate: "-rotate-1",
    hideOnMobile: false,
  },
  {
    src: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80",
    alt: "Car in motion",
    width: 220,
    height: 300,
    position: "top-[35%] left-[30%] sm:left-[35%] md:left-[42%]",
    size: "w-[80px] sm:w-[100px] md:w-[160px] lg:w-[200px]",
    rotate: "rotate-2",
    hideOnMobile: true,
  },
];

const words = [
  { text: "SPEED", outlined: false },
  { text: "POWER", outlined: true },
  { text: "LEGACY", outlined: false },
];

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.3,
      });

      // Words slide in from alternating sides
      tl.fromTo(
        ".hero-word-0",
        { x: -200, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2 },
        0
      );
      tl.fromTo(
        ".hero-word-1",
        { x: 200, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2 },
        0.15
      );
      tl.fromTo(
        ".hero-word-2",
        { x: -200, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2 },
        0.3
      );

      // Images pop in
      tl.fromTo(
        ".hero-img",
        { scale: 0.6, opacity: 0, y: 60 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "back.out(1.4)",
        },
        0.5
      );

      // Red line
      tl.fromTo(
        ".hero-redline",
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 1, ease: "power3.inOut" },
        1.0
      );

      // Tagline + subtitle + cta
      tl.fromTo(
        ".hero-tagline",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        1.3
      );
      tl.fromTo(
        ".hero-sub",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        1.5
      );
      tl.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        1.7
      );

      // Scroll parallax — words at different speeds
      [
        { sel: ".hero-word-0", y: -300 },
        { sel: ".hero-word-1", y: -200 },
        { sel: ".hero-word-2", y: -100 },
      ].forEach(({ sel, y }) => {
        gsap.to(sel, {
          y,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });

      // Images parallax
      document.querySelectorAll(".hero-img").forEach((img, i) => {
        const speeds = [-150, -250, -100, -200, -120, -180, -220];
        const rotations = [5, -4, 6, -3, 4, -5, 3];
        gsap.to(img, {
          y: speeds[i % speeds.length],
          rotation: rotations[i % rotations.length],
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1 + i * 0.2,
          },
        });
      });

      // Bottom area
      gsap.to(".hero-bottom", {
        y: -80,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Fade out
      gsap.to(containerRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "70% top",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <header
      ref={containerRef}
      className="relative min-h-screen bg-black overflow-hidden"
    >
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      {/* Red glow */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-[#e63946] rounded-full opacity-[0.03] blur-[200px] pulse-glow" />

      {/* Sticky wrapper */}
      <div className="sticky top-0 min-h-screen flex items-center justify-center">
        <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          {/* Images */}
          {images.map((img, i) => (
            <div
              key={i}
              className={`hero-img absolute ${img.position} ${img.size} ${img.rotate} z-[2] opacity-0 overflow-hidden rounded-lg shadow-2xl shadow-black/50 ${img.hideOnMobile ? "hidden md:block" : ""
                }`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                className="w-full h-full object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          ))}

          <div className="relative z-[3] flex flex-col items-center gap-0">
            {words.map((word, i) => (
              <h1
                key={word.text}
                className={`hero-word-${i} font-display text-[clamp(3rem,16vw,16rem)] leading-[0.85] font-black tracking-tight text-center opacity-0 ${word.outlined ? "text-transparent" : ""
                  }`}
                style={
                  word.outlined
                    ? {
                      WebkitTextStroke: "1px rgba(255,255,255,0.5)",
                      WebkitTextFillColor: "transparent",
                    }
                    : {
                      textShadow: "0 0 80px rgba(230,57,70,0.15)",
                    }
                }
              >
                {word.text}
              </h1>
            ))}
          </div>

          {/* Bottom content */}
          <div className="hero-bottom relative z-[5] mt-6 sm:mt-8 md:mt-12 flex flex-col items-center text-center">
            <div className="hero-redline w-[120px] sm:w-[160px] md:w-[300px] h-[2px] bg-gradient-to-r from-transparent via-[#e63946] to-transparent mb-4 sm:mb-6 md:mb-8" />

            <p className="hero-tagline font-display text-sm sm:text-base md:text-lg lg:text-2xl tracking-[0.1em] sm:tracking-[0.15em] text-white/80 uppercase opacity-0">
              Every car has a story
            </p>

            <p className="hero-sub mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-neutral-500 max-w-[280px] sm:max-w-sm md:max-w-md leading-relaxed font-light opacity-0 px-4 sm:px-0">
              The encyclopedia for car enthusiasts. JDM legends, supercars, and
              classics — specs, history, and the stories that made them iconic.
            </p>

            <div ref={ctaRef} className="mt-6 sm:mt-8 opacity-0">
              <Link
                href="#waitlist"
                className="group relative inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 bg-[#e63946] hover:bg-[#c1303b] rounded-full text-xs sm:text-sm uppercase tracking-[0.12em] sm:tracking-[0.15em] font-semibold text-white transition-all duration-500"
                style={{
                  boxShadow:
                    "0 0 40px rgba(230,57,70,0.2), 0 0 80px rgba(230,57,70,0.08)",
                }}
              >
                <span>Join the waitlist</span>
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300"
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
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 sm:gap-8 md:gap-10 mt-6 sm:mt-8 md:mt-10">
              {[
                { value: "10+", label: "Cars" },
                { value: "03", label: "Categories" },
                { value: "40+", label: "Variants" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-base sm:text-lg md:text-xl text-[#e63946]/70 tracking-wider">
                    {stat.value}
                  </div>
                  <div className="text-[8px] sm:text-[9px] text-neutral-600 uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollPulse {
          0% {
            transform: translateY(-100%);
          }
          50% {
            transform: translateY(0%);
          }
          100% {
            transform: translateY(100%);
          }
        }
      `}</style>
    </header>
  );
}