import type { Metadata } from "next";
import { PhotographyGallery } from "@/components/photography/PhotographyGallery";

export const metadata: Metadata = {
  title: "Photography",
  description:
    "Wedding, portrait, and event photography with a cinematic lightbox gallery.",
};

export default function PhotographyPage() {
  return <PhotographyGallery />;
}
