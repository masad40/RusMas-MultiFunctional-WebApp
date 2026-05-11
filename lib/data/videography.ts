import type { VideographyEntry } from "@/types";

/**
 * Showcase + library — `featured: true` drives the showreel block.
 * Swap URLs with your commissions; parsers accept youtube.com / youtu.be / vimeo.com.
 */
export const videographyEntries: VideographyEntry[] = [
  {
    id: "showreel",
    title: "Signature showreel",
    description:
      "Tone, pacing, and contrast distilled into one hero cut.",
    url: "https://www.youtube.com/watch?v=aqz-KE-bwKQ",
    featured: true,
  },
  {
    id: "ocean-vibes",
    title: "Ocean air — brand edit",
    description: "Narrative cut with score-led rhythm.",
    url: "https://vimeo.com/76979871",
    featured: false,
  },
  {
    id: "spring-spot",
    title: "Festival teaser",
    description: "Character-led trailer pacing on a cinematic grade.",
    url: "https://www.youtube.com/watch?v=WhWc3b3TkHc",
    featured: false,
  },
  {
    id: "doc-excerpt",
    title: "Documentary excerpt",
    description: "Long lens compression and natural sound bed.",
    url: "https://www.youtube.com/watch?v=86YLFOogwh8",
    featured: false,
  },
];

export function getShowreel(entries: VideographyEntry[]): VideographyEntry | undefined {
  return entries.find((e) => e.featured) ?? entries[0];
}

export function getLibrary(entries: VideographyEntry[]): VideographyEntry[] {
  const show = getShowreel(entries);
  return entries.filter((e) => e.id !== show?.id);
}
