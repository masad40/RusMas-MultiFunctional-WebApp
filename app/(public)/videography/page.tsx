import type { Metadata } from "next";
import { VideographyPageContent } from "@/components/videography/VideographyPageContent";

export const metadata: Metadata = {
  title: "Videography",
  description:
    "Showreels and client work via YouTube and Vimeo embeds with motion-led transitions.",
};

export default function VideographyPage() {
  return <VideographyPageContent />;
}
