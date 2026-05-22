"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    name: "JDM",
    fullName: "Japanese Domestic Market",
    description: "Skylines, Supras, and the legends that defined a generation of tuning culture.",
    accent: "#3b82f6",
    cars: "R34 GT-R • Supra MK4 • RX-7 FD • NSX",
    stat: "4",
  },
  {
    name: "SUPERCAR",
    fullName: "The untouchables",
    description: "The fastest, rarest, most extreme machines ever built. No compromises.",
    accent: "#e63946",
    cars: "F40 • McLaren F1 • Countach",
    stat: "3",
  },
  {
    name: "CLASSIC",
    fullName: "Timeless icons",
    description: "Before tech. Before downforce. When a car's beauty was its engineering.",
    accent: "#f59e0b",
    cars: "GT500 • E-Type • 300SL Gullwing",
    stat: "3",
  },
];

export default function CategoryReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>(".cat-panel");

      panels.forEach((panel) => {
        const name = panel.querySelector(".cat-name");
        const line = panel.querySelector(".cat-line");
        const desc = panel.querySelector(".cat-desc");
        const cars = panel.querySelector(".cat-cars");
        const number = panel.querySelector(".cat-number");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
        });

        tl.fromTo(
          line,
          { scaleX: 0, transformOrigin: "left" },
          { scaleX: 1, duration: 1 }
        );

        tl.fromTo(
          name,
          { x: -80, opacity: 0 },
          { x: 0, opacity: 1, duration: 1 },
          0.2
        );

        tl.fromTo(
          number,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 0.05, duration: 1 },
          0
        );

        tl.fromTo(
          desc,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          0.4
        );

        tl.fromTo(
          cars,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          0.6
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-32 px-6 md:px-12 noise-bg">
      <div className="max-w-7xl mx-auto">
        {/* Section label */}
        <div className="mb-24">
          <p className="text-[#e63946] text-xs uppercase tracking-[0.3em] mb-4 font-medium">
            Three worlds
          </p>
          <h2 className="font-display text-5xl md:text-7xl tracking-wider">
            CHOOSE YOUR ERA
          </h2>
        </div>

        {/* Category panels */}
        <div className="space-y-2">
          {categories.map((cat, i) => (
            <div
              key={cat.name}
              className="cat-panel relative group py-12 md:py-16 px-6 md:px-12 rounded-2xl border border-neutral-800/50 hover:border-neutral-700 transition-all duration-700 overflow-hidden cursor-pointer"
            >
              {/* Giant background number */}
              <div
                className="cat-number absolute right-8 top-1/2 -translate-y-1/2 font-display text-[20rem] leading-none pointer-events-none select-none"
                style={{ color: cat.accent, opacity: 0.05 }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(ellipse at 20% 50%, ${cat.accent}08, transparent 70%)`,
                }}
              />

              {/* Accent line */}
              <div
                className="cat-line h-[2px] w-full mb-8"
                style={{
                  background: `linear-gradient(90deg, ${cat.accent}, transparent)`,
                }}
              />

              <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                  {/* Category name */}
                  <h3
                    className="cat-name font-display text-6xl md:text-8xl tracking-wider mb-2"
                    style={{
                      WebkitTextStroke: `1px ${cat.accent}`,
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {cat.name}
                  </h3>
                  <p className="cat-desc text-neutral-400 text-lg max-w-lg">
                    {cat.description}
                  </p>
                </div>

                <div className="cat-cars text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-neutral-600 mb-2">
                    Featured
                  </p>
                  <p
                    className="text-sm font-medium tracking-wide"
                    style={{ color: cat.accent }}
                  >
                    {cat.cars}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}