import { FeaturedWorks } from "@/components/home/FeaturedWorks";
import { LatestProducts } from "@/components/home/LatestProducts";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <FeaturedWorks />
      <LatestProducts />
    </main>
  );
}
