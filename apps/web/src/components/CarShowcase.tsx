"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

interface Car {
  id: string;
  name: string;
  slug: string;
  make: string;
  year: number;
  category: string;
  horsepower: number;
  engine: string;
  tagline: string;
  topSpeed: number;
  zeroToSixty: number;
}

export default function CarShowcase() {
  const [cars, setCars] = useState<Car[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("https://redline-api.orisabiyidavid.workers.dev/api/v1/cars")
      .then((res) => res.json())
      .then((data) => setCars(data.cars || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!cars.length || !scrollRef.current || !sectionRef.current) return;

    const scrollWidth = scrollRef.current.scrollWidth - window.innerWidth;

    gsap.to(scrollRef.current, {
      x: -scrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${scrollWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [cars]);

  const categoryColor: Record<string, string> = {
    JDM: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    SUPERCAR: "bg-red-500/10 text-red-400 border-red-500/20",
    CLASSIC: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      {/* Section header — visible before scroll starts */}
      <div className="absolute top-12 left-8 z-10">
        <p className="text-[#e63946] text-sm uppercase tracking-[0.2em] mb-2">
          The collection
        </p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          Scroll to explore
        </h2>
      </div>

      <div
        ref={scrollRef}
        className="flex items-center gap-8 pl-8 pr-[50vw] pt-32 pb-12 min-h-screen"
      >
        {cars.map((car, i) => (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="flex-shrink-0 w-[400px] md:w-[480px] group"
          >
            <div className="relative rounded-2xl border border-neutral-800 bg-neutral-950 p-6 hover:border-neutral-600 transition-all duration-500 h-full">
              {/* Car image placeholder — gradient based on category */}
              <div
                className={`w-full h-56 rounded-xl mb-6 flex items-center justify-center ${car.category === "JDM"
                    ? "bg-gradient-to-br from-blue-950 to-blue-900/50"
                    : car.category === "SUPERCAR"
                      ? "bg-gradient-to-br from-red-950 to-red-900/50"
                      : "bg-gradient-to-br from-amber-950 to-amber-900/50"
                  }`}
              >
                <span className="text-6xl font-bold text-white/5">
                  {car.make.charAt(0)}
                </span>
              </div>

              {/* Category badge */}
              <span
                className={`inline-block text-xs px-3 py-1 rounded-full border mb-4 ${categoryColor[car.category] || ""
                  }`}
              >
                {car.category}
              </span>

              <h3 className="text-2xl font-bold mb-1">{car.name}</h3>
              <p className="text-neutral-500 text-sm mb-4 italic">
                {car.tagline}
              </p>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-800">
                <div>
                  <div className="text-lg font-bold">{car.horsepower}</div>
                  <div className="text-xs text-neutral-500 uppercase">HP</div>
                </div>
                <div>
                  <div className="text-lg font-bold">{car.zeroToSixty}s</div>
                  <div className="text-xs text-neutral-500 uppercase">
                    0-60
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold">{car.topSpeed}</div>
                  <div className="text-xs text-neutral-500 uppercase">
                    MPH
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}