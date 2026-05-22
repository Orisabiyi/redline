import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import CarShowcase from "@/components/CarShowcase";
import Waitlist from "@/components/Waitlist";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <SmoothScroll>
      <main>
        <Hero />
        <Features />
        <CarShowcase />
        <Waitlist />
        <Footer />
      </main>
    </SmoothScroll>
  );
}