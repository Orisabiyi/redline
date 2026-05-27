"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function AnimatedCounter({
  target,
  suffix = "",
  duration = 2,
  inView = false,
}: {
  target: number;
  suffix?: string;
  duration?: number;
  inView: boolean;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef({ val: 0 });

  useEffect(() => {
    if (!inView) return;
    gsap.to(ref.current, {
      val: target,
      duration,
      ease: "power2.out",
      onUpdate: () => setValue(Math.round(ref.current.val)),
    });
  }, [inView, target, duration]);

  return (
    <span className="rpm-digit font-display text-7xl md:text-8xl tracking-wider">
      {value.toLocaleString()}
      <span className="text-[#e63946]">{suffix}</span>
    </span>
  );
}

const stats = [
  { value: 10, suffix: "+", label: "Iconic cars", sublabel: "and counting" },
  { value: 40, suffix: "+", label: "Variants", sublabel: "trims & editions" },
  { value: 3, suffix: "", label: "Categories", sublabel: "JDM • Super • Classic" },
  { value: 100, suffix: "%", label: "Open source", sublabel: "free forever" },
];

const features = [
  {
    title: "Deep specs",
    description: "Engine codes, displacement, horsepower, torque, drivetrain, weight, 0-60 — every number that matters.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "The real stories",
    description: "Why the R34 was banned. How Senna shaped the NSX. What makes the F40 Enzo's last masterpiece.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    title: "Every variant",
    description: "V-Spec, Type R, Spirit R, LM — browse every trim and special edition with production numbers.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    title: "Compare head to head",
    description: "Supra vs Skyline. F40 vs Countach. Stack any two cars and see how they measure up.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
];

export default function StatsFeatures() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useGSAP(
    () => {
      // Stats trigger
      ScrollTrigger.create({
        trigger: ".stats-row",
        start: "top 75%",
        onEnter: () => setInView(true),
      });

      // Feature cards stagger
      gsap.fromTo(
        ".feature-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 80%",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-32 px-6 md:px-12 relative noise-bg overflow-x-hidden">
      {/* Stats row */}
      <div className="stats-row md:max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-32">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <AnimatedCounter
              target={stat.value}
              suffix={stat.suffix}
              inView={inView}
            />
            <div className="text-sm text-white mt-2 font-medium tracking-wide">
              {stat.label}
            </div>
            <div className="text-xs text-neutral-600 mt-1">{stat.sublabel}</div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
      </div>

      {/* Features heading */}
      <div className="max-w-7xl mx-auto mb-16">
        <p className="text-[#e63946] text-xs uppercase tracking-[0.3em] mb-4 font-medium">
          What you get
        </p>
        <h2 className="font-display text-5xl md:text-7xl tracking-wider">
          NOT JUST SPECS
        </h2>
        <p className="text-neutral-500 text-lg mt-4 max-w-xl">
          The whole picture. Every car&apos;s story, every variant, every number.
        </p>
      </div>

      {/* Features grid */}
      <div className="features-grid max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="feature-card group relative p-8 md:p-10 rounded-2xl border border-neutral-800/50 bg-neutral-950/50 hover:bg-neutral-900/50 transition-all duration-700 overflow-hidden"
          >
            {/* Hover accent */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#e63946] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

            <div className="text-[#e63946] mb-5 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
              {feature.icon}
            </div>
            <h3 className="font-display text-2xl tracking-wider mb-3">
              {feature.title.toUpperCase()}
            </h3>
            <p className="text-neutral-400 leading-relaxed text-[15px]">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}