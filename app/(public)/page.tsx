import { CinematicHero } from "@/components/home/CinematicHero";
import { FeaturedWorks } from "@/components/home/FeaturedWorks";
import { LatestProducts } from "@/components/home/LatestProducts";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <CinematicHero />
      <FeaturedWorks />
      <LatestProducts />
    </main>
  );
}
