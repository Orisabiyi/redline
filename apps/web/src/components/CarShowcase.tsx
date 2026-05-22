"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Car {
  id: string;
  name: string;
  slug: string;
  make: string;
  model: string;
  year: number;
  endYear: number | null;
  category: string;
  engine: string;
  horsepower: number;
  torque: number;
  topSpeed: number;
  zeroToSixty: number;
  weight: number;
  drivetrain: string;
  tagline: string;
  unitsProduced: number;
}

const categoryStyle: Record<
  string,
  { gradient: string; border: string; text: string; badge: string }
> = {
  JDM: {
    gradient: "from-blue-950/80 via-blue-900/30 to-transparent",
    border: "border-blue-500/20 hover:border-blue-500/40",
    text: "text-blue-400",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  SUPERCAR: {
    gradient: "from-red-950/80 via-red-900/30 to-transparent",
    border: "border-red-500/20 hover:border-red-500/40",
    text: "text-red-400",
    badge: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  CLASSIC: {
    gradient: "from-amber-950/80 via-amber-900/30 to-transparent",
    border: "border-amber-500/20 hover:border-amber-500/40",
    text: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
};

export default function CarShowcase() {
  const [cars, setCars] = useState<Car[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("https://redline-api.orisabiyidavid.workers.dev/api/v1/cars")
      .then((res) => res.json())
      .then((data) => setCars(data.cars || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!cars.length || !trackRef.current || !sectionRef.current) return;

    const scrollWidth =
      trackRef.current.scrollWidth - window.innerWidth + 100;

    // Horizontal scroll
    const scrollTween = gsap.to(trackRef.current, {
      x: -scrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${scrollWidth * 1.2}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Cards scale up as they enter viewport
    const cards = gsap.utils.toArray<HTMLElement>(".showcase-card");
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { scale: 0.85, opacity: 0.3, rotateY: -5 },
        {
          scale: 1,
          opacity: 1,
          rotateY: 0,
          scrollTrigger: {
            trigger: card,
            containerAnimation: scrollTween,
            start: "left 80%",
            end: "left 40%",
            scrub: 1,
          },
        }
      );
    });

    // Header fades out as scroll progresses
    gsap.to(headerRef.current, {
      opacity: 0,
      x: -100,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "top -20%",
        scrub: 1,
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [cars]);

  if (!cars.length) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black"
    >
      {/* Section header */}
      <div
        ref={headerRef}
        className="absolute top-12 left-8 md:left-16 z-20"
      >
        <p className="text-[#e63946] text-xs uppercase tracking-[0.3em] mb-2 font-medium">
          The collection
        </p>
        <h2 className="font-display text-4xl md:text-6xl tracking-wider">
          10 LEGENDS
        </h2>
        <p className="text-neutral-600 text-sm mt-2 uppercase tracking-widest">
          Scroll →
        </p>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={trackRef}
        className="flex items-center gap-8 pl-8 md:pl-16 pr-[40vw] min-h-screen pt-32"
        style={{ perspective: "1200px" }}
      >
        {cars.map((car, i) => {
          const style = categoryStyle[car.category] || categoryStyle.JDM;
          return (
            <div
              key={car.id}
              className={`showcase-card car-card flex-shrink-0 w-[380px] md:w-[440px] rounded-2xl border ${style.border} bg-neutral-950/80 backdrop-blur-sm overflow-hidden`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Image placeholder with gradient */}
              <div
                className={`relative w-full h-52 bg-gradient-to-br ${style.gradient} flex items-end p-6`}
              >
                {/* Large letter watermark */}
                <span className="absolute top-4 right-6 font-display text-[8rem] leading-none text-white/[0.03]">
                  {car.make.charAt(0)}
                </span>

                {/* Category + Year */}
                <div className="relative z-10 flex items-center gap-3">
                  <span
                    className={`text-[10px] px-3 py-1 rounded-full border ${style.badge} uppercase tracking-wider font-medium`}
                  >
                    {car.category}
                  </span>
                  <span className="text-neutral-500 text-xs">
                    {car.year}
                    {car.endYear ? `–${car.endYear}` : ""}
                  </span>
                </div>
              </div>

              {/* Card content */}
              <div className="p-6">
                <h3 className="font-display text-3xl tracking-wider mb-1">
                  {car.name}
                </h3>
                <p className="text-neutral-500 text-sm italic mb-1">
                  &ldquo;{car.tagline}&rdquo;
                </p>
                <p className="text-neutral-600 text-xs mb-6 font-mono">
                  {car.engine}
                </p>

                {/* Stats grid */}
                <div className="grid grid-cols-4 gap-3 py-4 border-t border-neutral-800/50">
                  {[
                    { value: car.horsepower, unit: "hp", label: "Power" },
                    { value: car.torque, unit: "ft-lb", label: "Torque" },
                    {
                      value: car.zeroToSixty,
                      unit: "s",
                      label: "0-60",
                    },
                    {
                      value: car.topSpeed,
                      unit: "mph",
                      label: "Top",
                    },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-white font-semibold text-sm">
                        {stat.value}
                        <span className="text-neutral-600 text-[10px] ml-0.5">
                          {stat.unit}
                        </span>
                      </div>
                      <div className="text-[9px] text-neutral-600 uppercase tracking-wider mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-800/30">
                  <div className="text-[10px] text-neutral-600 uppercase tracking-wider">
                    {car.drivetrain} •{" "}
                    {car.unitsProduced.toLocaleString()} built
                  </div>
                  <div className="text-neutral-700 text-xs">
                    #{String(i + 1).padStart(2, "0")}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
    </section>
  );
}