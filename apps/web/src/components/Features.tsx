"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const features = [
  {
    icon: "🔍",
    title: "Deep specs",
    description:
      "Engine codes, displacement, horsepower, torque, drivetrain, weight, 0-60 — every number that matters.",
  },
  {
    icon: "📖",
    title: "The real stories",
    description:
      "Why the R34 was banned. How Senna shaped the NSX. What makes the F40 Enzo's last masterpiece.",
  },
  {
    icon: "🔀",
    title: "Every variant",
    description:
      "V-Spec, Type R, Spirit R, LM — browse every trim and special edition with production numbers.",
  },
  {
    icon: "⚡",
    title: "Compare side by side",
    description:
      "Supra vs Skyline. F40 vs Countach. Stack any two cars and see how they measure up.",
  },
];

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-[#e63946] text-sm uppercase tracking-[0.2em] mb-4"
        >
          Built for enthusiasts
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold tracking-tight mb-20"
        >
          Not just specs.
          <br />
          <span className="text-neutral-500">The whole picture.</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.15 }}
              className="group relative p-8 rounded-2xl border border-neutral-800 bg-neutral-950 hover:border-neutral-700 transition-all duration-500 hover:bg-neutral-900"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#e63946]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <span className="text-3xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}