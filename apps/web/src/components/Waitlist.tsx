"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section ref={ref} className="py-32 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#e63946]/5 to-transparent" />

      <div className="max-w-2xl mx-auto text-center relative">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-[#e63946] text-sm uppercase tracking-[0.2em] mb-4"
        >
          Coming soon
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
        >
          Be first on
          <br />
          <span className="text-gradient-red">the grid</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-neutral-400 mb-10 text-lg"
        >
          Join the waitlist and be the first to explore Redline when it launches.
          Free. Open source. Built for car people.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {status === "success" ? (
            <div className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border border-green-500/20 bg-green-500/5">
              <span className="text-green-400 text-lg">✓</span>
              <span className="text-green-300">
                You&apos;re on the list. We&apos;ll be in touch.
              </span>
            </div>
          ) : (
            <div
              className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl border border-neutral-800 bg-neutral-950"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="flex-1 bg-transparent px-5 py-4 text-white placeholder:text-neutral-600 outline-none text-lg rounded-xl"
                disabled={status === "loading"}
              />
              <button
                onClick={handleSubmit}
                disabled={status === "loading" || !email}
                className="px-8 py-4 bg-[#e63946] text-white font-semibold rounded-xl hover:bg-[#c1303b] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {status === "loading" ? "Joining..." : "Join waitlist"}
              </button>
            </div>
          )}

          {status === "error" && (
            <p className="text-red-400 text-sm mt-3">
              Something went wrong. Try again.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}