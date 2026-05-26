"use client";

import { useRef, useState, useCallback } from "react";
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
  const [soundPlayed, setSoundPlayed] = useState(false);

  const userInteracted = useRef(false);
  const warmupDone = useRef(false);

  const tryPlaySound = useCallback(() => {
    if (soundPlayed) return;
    if (!userInteracted.current || !warmupDone.current) return;

    setSoundPlayed(true);
    const audio = new Audio("/audio/engine.mp3");
    audio.volume = 0.6;
    audio.play().catch(() => { });

    setTimeout(() => {
      const fadeOut = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume = Math.max(0, audio.volume - 0.05);
        } else {
          audio.pause();
          clearInterval(fadeOut);
        }
      }, 50);
    }, 3500);
  }, [soundPlayed]);

  const handleInteraction = useCallback(() => {
    userInteracted.current = true;
    tryPlaySound();
  }, [tryPlaySound]);

  const onWarmupComplete = useCallback(() => {
    warmupDone.current = true;
    tryPlaySound();
  }, [tryPlaySound]);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        onComplete: () => {
          setDone(true);
          onComplete();
        },
      });

      // WARMUP
      tl.fromTo(".warmup-text", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0);
      tl.fromTo(
        ".warmup-bar-fill",
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 1.2, ease: "power1.inOut" },
        0.2
      );
      tl.fromTo(
        ".warmup-dot",
        { opacity: 0.2 },
        { opacity: 1, duration: 0.3, stagger: { each: 0.15, repeat: 3, yoyo: true } },
        0
      );
      tl.to(".warmup-phase", {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.in",
        onComplete: onWarmupComplete,
      }, 1.4);

      // MAIN
      tl.fromTo(
        ".intro-char",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" },
        1.8
      );
      tl.fromTo(".intro-sub", { opacity: 0 }, { opacity: 1, duration: 0.4 }, 2.5);
      tl.fromTo(".sound-hint", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.8);

      const trackEl = document.querySelector(".intro-track") as HTMLElement;
      const trackWidth = trackEl ? trackEl.offsetWidth - 60 : 300;

      tl.set(carRef.current, { x: 0 }, 2.7);
      tl.set(trailRef.current, { width: 0 }, 2.7);

      const updateTrail = () => {
        if (carRef.current && trailRef.current) {
          const carX = gsap.getProperty(carRef.current, "x") as number;
          trailRef.current.style.width = `${Math.max(0, carX)}px`;
        }
      };

      tl.to(carRef.current, {
        x: trackWidth, duration: 2, ease: "power2.inOut", onUpdate: updateTrail,
      }, 2.7);
      tl.to(carRef.current, {
        x: trackWidth + 30, duration: 0.25, ease: "power2.in", onUpdate: updateTrail,
      });
      tl.to(carRef.current, {
        x: trackWidth + 10, duration: 0.2, ease: "power2.out", onUpdate: updateTrail,
      });

      tl.to({}, { duration: 0.4 });
      tl.to(".intro-content", { scale: 1.6, opacity: 0, duration: 0.6, ease: "power3.in" });
      tl.to(".sound-hint", { opacity: 0, duration: 0.2 }, "<");
      tl.to(overlayRef.current, { clipPath: "inset(0 0 100% 0)", duration: 0.8, ease: "power4.inOut" });
    },
    { scope: overlayRef }
  );

  return (
    <div
      ref={overlayRef}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      className={`fixed inset-0 z-[100] bg-black flex items-center justify-center cursor-pointer ${done ? "pointer-events-none" : ""}`}
      style={{ clipPath: "inset(0 0 0 0)" }}
    >
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: "linear-gradient(rgba(230,57,70,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(230,57,70,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </div>

      {/* Sound hint */}
      <div className={`sound-hint absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20 flex items-center gap-2 opacity-0 ${soundPlayed ? "!opacity-0" : ""}`}>
        <svg className="w-3.5 h-3.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
        <span className="text-[9px] text-neutral-600 font-mono tracking-[0.2em] uppercase">Tap for sound</span>
      </div>

      {/* WARMUP */}
      <div className="warmup-phase absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <div className="warmup-text flex flex-col items-center gap-4 opacity-0">
          <svg className="w-6 h-6 md:w-8 md:h-8 text-[#e63946]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-[10px] md:text-[11px] text-neutral-500 font-mono tracking-[0.4em] uppercase">Warming up</span>
          <div className="w-32 md:w-40 h-[2px] bg-white/[0.06] rounded-full overflow-hidden">
            <div className="warmup-bar-fill h-full bg-gradient-to-r from-[#e63946]/50 to-[#e63946] rounded-full" />
          </div>
          <div className="flex gap-1.5 mt-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="warmup-dot w-1 h-1 rounded-full bg-[#e63946]" />
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="intro-content flex flex-col items-center relative px-4 pointer-events-none">
        <div className="flex overflow-hidden">
          {"REDLINE".split("").map((char, i) => (
            <span key={i} className="intro-char font-display text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tight text-white leading-none opacity-0"
              style={{ textShadow: i === 0 || i === 6 ? "0 0 60px rgba(230,57,70,0.3)" : "none" }}>
              {char}
            </span>
          ))}
        </div>
        <p className="intro-sub text-neutral-600 text-[10px] sm:text-xs md:text-sm tracking-[0.3em] md:tracking-[0.4em] uppercase mt-2 opacity-0">
          Every car has a story
        </p>
        <div className="intro-track relative mt-6 sm:mt-8 md:mt-10 w-[85vw] sm:w-[75vw] md:w-[65vw] max-w-[600px] h-12">
          <div className="absolute bottom-[12px] left-0 right-0 h-[1px] bg-white/[0.04]" />
          <div ref={trailRef} className="absolute bottom-[11px] left-0 h-[3px]"
            style={{ width: 0, background: "linear-gradient(90deg, rgba(230,57,70,0.1), #e63946)", boxShadow: "0 0 12px rgba(230,57,70,0.3)" }} />
          <div ref={carRef} className="absolute bottom-0 left-0" style={{ transform: "translateX(0px)" }}>
            <svg width="52" height="24" viewBox="0 0 52 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[36px] h-[18px] sm:w-[44px] sm:h-[20px] md:w-[52px] md:h-[24px]">
              <path d="M2 16 C2 16 4 16 6 16 L8 12 L14 8 L20 6 L34 6 L40 8 L46 12 L48 16 L50 16" fill="rgba(255,255,255,0.08)" stroke="white" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M14 8 L17 2 L33 2 L36 6" fill="rgba(255,255,255,0.04)" stroke="white" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M14 8 L17 2.5 L22 2.5 L19 8 Z" fill="rgba(230,57,70,0.15)" />
              <path d="M30 2.5 L33 2.5 L36 6 L32 6 Z" fill="rgba(230,57,70,0.1)" />
              <line x1="6" y1="16" x2="48" y2="16" stroke="white" strokeWidth="1.2" />
              <circle cx="14" cy="17.5" r="4.5" fill="black" stroke="white" strokeWidth="1.2" />
              <circle cx="14" cy="17.5" r="1.8" fill="#e63946" />
              <line x1="14" y1="14" x2="14" y2="21" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5">
                <animateTransform attributeName="transform" type="rotate" from="0 14 17.5" to="360 14 17.5" dur="0.3s" repeatCount="indefinite" />
              </line>
              <circle cx="40" cy="17.5" r="4.5" fill="black" stroke="white" strokeWidth="1.2" />
              <circle cx="40" cy="17.5" r="1.8" fill="#e63946" />
              <line x1="40" y1="14" x2="40" y2="21" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5">
                <animateTransform attributeName="transform" type="rotate" from="0 40 17.5" to="360 40 17.5" dur="0.3s" repeatCount="indefinite" />
              </line>
              <circle cx="49" cy="14" r="1.2" fill="#e63946">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="0.8s" repeatCount="indefinite" />
              </circle>
              <rect x="1" y="12" width="2" height="3.5" rx="0.5" fill="#e63946" opacity="0.7" />
              <circle cx="-2" cy="16" r="1" fill="white" opacity="0.1">
                <animate attributeName="cx" values="-2;-12" dur="0.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.15;0" dur="0.5s" repeatCount="indefinite" />
                <animate attributeName="r" values="1;3" dur="0.5s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}