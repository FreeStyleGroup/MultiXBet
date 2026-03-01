import { HeroSection } from "@/components/hero-section";
import { MatchList } from "@/components/match-list";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <HeroSection />

      <section>
        <h2 className="text-xl font-semibold mb-4">Все матчи</h2>
        <MatchList />
      </section>
    </div>
  );
}
