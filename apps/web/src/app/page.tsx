import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/Hero";
import CategoryReveal from "@/components/CategoryReveal";
import CarShowcase from "@/components/CarShowcase";
import StatsFeatures from "@/components/StatsFeatures";
import Waitlist from "@/components/Waitlist";
import Footer from "@/components/Footer";

export default function Home() {
  return (
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
  );
}