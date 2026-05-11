/** Home page curated content — replace or fetch from MongoDB later */

export interface HeroSlide {
  id: string;
  headline: string;
  src: string;
  poster: string;
}

export interface FeaturedWork {
  id: string;
  title: string;
  tag: string;
  href: string;
  image: string;
  imageAlt: string;
}

export interface HomeProductPreview {
  id: string;
  slug: string;
  title: string;
  priceCents: number;
  currency: string;
  image: string;
  imageAlt: string;
  inStock: boolean;
}

/** Demo CDN sources — swap for self-hosted, compressed clips in `public/` for production. */
export const heroSlides: readonly HeroSlide[] = [
  {
    id: "depth",
    headline: "Depth in silence.",
    src: "https://res.cloudinary.com/demo/video/upload/sea_turtle.mp4",
    poster:
      "https://images.unsplash.com/photo-1505118389757-d68c8622c4cf?w=1920&q=80&auto=format&fit=crop",
  },
  {
    id: "horizon",
    headline: "Light on the horizon.",
    src: "https://res.cloudinary.com/demo/video/upload/elephants.mp4",
    poster:
      "https://images.unsplash.com/photo-1544735716-392fe2489fad?w=1920&q=80&auto=format&fit=crop",
  },
  {
    id: "still",
    headline: "Still frames.",
    src: "https://res.cloudinary.com/demo/video/upload/snow_deer.mp4",
    poster:
      "https://images.unsplash.com/photo-1448375240586-882707db888f?w=1920&q=80&auto=format&fit=crop",
  },
];

export const featuredWorks: FeaturedWork[] = [
  {
    id: "fw-1",
    title: "Nocturnal streets",
    tag: "Photography",
    href: "/photography",
    image:
      "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Urban street at night with neon reflections",
  },
  {
    id: "fw-2",
    title: "Reel seventeen",
    tag: "Videography",
    href: "/videography",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Vintage cinema seats facing a lit screen",
  },
  {
    id: "fw-3",
    title: "Highland mist",
    tag: "Photography",
    href: "/photography",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80&auto=format&fit=crop",
    imageAlt: "Mountain ridge through soft clouds",
  },
];

export const latestProducts: HomeProductPreview[] = [
  {
    id: "p-1",
    slug: "archival-print-01",
    title: "Archival print — Nocturne I",
    priceCents: 12000,
    currency: "USD",
    image:
      "https://images.unsplash.com/photo-1542037104857-ffbb0b915467?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Framed monochrome photograph on a wall",
    inStock: true,
  },
  {
    id: "p-2",
    slug: "grade-pack-aurum",
    title: "Color grade pack — Aurum",
    priceCents: 4900,
    currency: "USD",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Abstract gold and black gradient texture",
    inStock: true,
  },
  {
    id: "p-3",
    slug: "field-notes-zine",
    title: "Field notes zine",
    priceCents: 2800,
    currency: "USD",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80&auto=format&fit=crop",
    imageAlt: "Open magazine on a dark surface",
    inStock: false,
  },
];
