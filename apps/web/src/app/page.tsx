"use client";

import { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import IntroOverlay from "@/components/IntroOverlay";
import Hero from "@/components/Hero";
import CategoryReveal from "@/components/CategoryReveal";
import CarShowcase from "@/components/CarShowcase";
import StatsFeatures from "@/components/StatsFeatures";
import Waitlist from "@/components/Waitlist";
import Footer from "@/components/Footer";

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      <IntroOverlay onComplete={() => setIntroComplete(true)} />
      <div className={introComplete ? '' : 'overflow-hidden h-screen'}>
        <SmoothScroll>
          <main>
            <Hero />
            <CategoryReveal />
            <CarShowcase />
            <StatsFeatures />
            <Waitlist />
            <Footer />
          </main>
        </SmoothScroll>
      </div>
    </>
  );
}