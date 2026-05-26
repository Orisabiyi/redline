"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface Props {
  onComplete: () => void;
}

export default function IntroOverlay({ onComplete }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        onComplete: () => {
          setDone(true);
          onComplete();
        },
      });

      // 1. REDLINE letters reveal
      tl.fromTo(
        ".intro-char",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
        },
        0.3
      );

      // 2. Subtitle
      tl.fromTo(
        ".intro-sub",
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        1.0
      );

      // 3. Car drives from left edge to center — line grows behind it
      const trackWidth =
        typeof window !== "undefined"
          ? Math.min(window.innerWidth * 0.8, 600)
          : 600;

      tl.set(carRef.current, { x: 0 }, 1.2);
      tl.set(trailRef.current, { width: 0 }, 1.2);

      tl.to(
        carRef.current,
        {
          x: trackWidth,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: function () {
            // Trail always follows behind the car
            if (carRef.current && trailRef.current) {
              const carX = gsap.getProperty(carRef.current, "x") as number;
              trailRef.current.style.width = `${carX}px`;
            }
          },
        },
        1.2
      );

      // 4. Car overshoots and settles
      tl.to(carRef.current, {
        x: trackWidth + 40,
        duration: 0.25,
        ease: "power2.in",
        onUpdate: function () {
          if (carRef.current && trailRef.current) {
            const carX = gsap.getProperty(carRef.current, "x") as number;
            trailRef.current.style.width = `${carX}px`;
          }
        },
      });
      tl.to(carRef.current, {
        x: trackWidth + 10,
        duration: 0.2,
        ease: "power2.out",
        onUpdate: function () {
          if (carRef.current && trailRef.current) {
            const carX = gsap.getProperty(carRef.current, "x") as number;
            trailRef.current.style.width = `${carX}px`;
          }
        },
      });

      // 5. Brief hold
      tl.to({}, { duration: 0.5 });

      // 6. Everything scales up — driving into the screen
      tl.to(".intro-content", {
        scale: 1.6,
        opacity: 0,
        duration: 0.6,
        ease: "power3.in",
      });

      // 7. Overlay reveals the page
      tl.to(overlayRef.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.8,
        ease: "power4.inOut",
      });
    },
    { scope: overlayRef }
  );

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[100] bg-black flex items-center justify-center ${done ? "pointer-events-none" : ""
        }`}
      style={{ clipPath: "inset(0 0 0 0)" }}
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(230,57,70,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(230,57,70,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="intro-content flex flex-col items-center relative">
        {/* REDLINE text */}
        <div className="flex overflow-hidden">
          {"REDLINE".split("").map((char, i) => (
            <span
              key={i}
              className="intro-char font-display text-[clamp(3.5rem,12vw,10rem)] font-black tracking-tight text-white leading-none opacity-0"
              style={{
                textShadow:
                  i === 0 || i === 6
                    ? "0 0 60px rgba(230,57,70,0.3)"
                    : "none",
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Subtitle */}
        <p className="intro-sub text-neutral-600 text-xs md:text-sm tracking-[0.4em] uppercase mt-2 opacity-0">
          Every car has a story
        </p>

        {/* Track area — car leads, line follows */}
        <div
          className="relative mt-10"
          style={{ width: "80vw", maxWidth: 600, height: 50 }}
        >
          {/* Road surface */}
          <div className="absolute bottom-[12px] left-0 right-0 h-[1px] bg-white/[0.04]" />

          {/* Red trail — grows from left, always behind the car */}
          <div
            ref={trailRef}
            className="absolute bottom-[11px] left-0 h-[3px]"
            style={{
              width: 0,
              background:
                "linear-gradient(90deg, rgba(230,57,70,0.1), #e63946)",
              boxShadow: "0 0 12px rgba(230,57,70,0.3)",
            }}
          />

          {/* Car — starts at left edge, drives right */}
          <div
            ref={carRef}
            className="absolute bottom-0 left-0"
            style={{ transform: "translateX(0px)" }}
          >
            <svg
              width="52"
              height="24"
              viewBox="0 0 52 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Body shell */}
              <path
                d="M2 16 C2 16 4 16 6 16 L8 12 L14 8 L20 6 L34 6 L40 8 L46 12 L48 16 L50 16"
                fill="rgba(255,255,255,0.08)"
                stroke="white"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* Roof */}
              <path
                d="M14 8 L17 2 L33 2 L36 6"
                fill="rgba(255,255,255,0.04)"
                stroke="white"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* Windshield glass */}
              <path
                d="M14 8 L17 2.5 L22 2.5 L19 8 Z"
                fill="rgba(230,57,70,0.15)"
              />
              {/* Rear glass */}
              <path
                d="M30 2.5 L33 2.5 L36 6 L32 6 Z"
                fill="rgba(230,57,70,0.1)"
              />
              {/* Undercarriage */}
              <line
                x1="6"
                y1="16"
                x2="48"
                y2="16"
                stroke="white"
                strokeWidth="1.2"
              />
              {/* Front wheel */}
              <circle
                cx="14"
                cy="17.5"
                r="4.5"
                fill="black"
                stroke="white"
                strokeWidth="1.2"
              />
              <circle cx="14" cy="17.5" r="1.8" fill="#e63946" />
              {/* Front wheel spin line */}
              <line
                x1="14"
                y1="14"
                x2="14"
                y2="21"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.5"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 14 17.5"
                  to="360 14 17.5"
                  dur="0.3s"
                  repeatCount="indefinite"
                />
              </line>
              {/* Rear wheel */}
              <circle
                cx="40"
                cy="17.5"
                r="4.5"
                fill="black"
                stroke="white"
                strokeWidth="1.2"
              />
              <circle cx="40" cy="17.5" r="1.8" fill="#e63946" />
              {/* Rear wheel spin line */}
              <line
                x1="40"
                y1="14"
                x2="40"
                y2="21"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="0.5"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 40 17.5"
                  to="360 40 17.5"
                  dur="0.3s"
                  repeatCount="indefinite"
                />
              </line>
              {/* Headlight glow */}
              <circle cx="49" cy="14" r="1.2" fill="#e63946">
                <animate
                  attributeName="opacity"
                  values="0.6;1;0.6"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </circle>
              {/* Taillight */}
              <rect
                x="1"
                y="12"
                width="2"
                height="3.5"
                rx="0.5"
                fill="#e63946"
                opacity="0.7"
              />
              {/* Exhaust smoke */}
              <circle cx="-2" cy="16" r="1" fill="white" opacity="0.1">
                <animate
                  attributeName="cx"
                  values="-2;-12"
                  dur="0.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.15;0"
                  dur="0.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values="1;3"
                  dur="0.5s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="-4" cy="15" r="0.6" fill="white" opacity="0.08">
                <animate
                  attributeName="cx"
                  values="-4;-16"
                  dur="0.7s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.1;0"
                  dur="0.7s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="r"
                  values="0.6;2.5"
                  dur="0.7s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
        </div>

        {/* Loading indicator */}
        <div className="mt-8 flex items-center gap-3">
          <div className="flex gap-1">
            <div
              className="w-1.5 h-1.5 rounded-full bg-[#e63946]"
              style={{ animation: "loadDot 1s ease-in-out infinite" }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full bg-[#e63946]"
              style={{
                animation: "loadDot 1s ease-in-out 0.15s infinite",
              }}
            />
            <div
              className="w-1.5 h-1.5 rounded-full bg-[#e63946]"
              style={{
                animation: "loadDot 1s ease-in-out 0.3s infinite",
              }}
            />
          </div>
          <span className="text-[10px] text-neutral-600 font-mono tracking-[0.3em] uppercase">
            Starting engine
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes loadDot {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}