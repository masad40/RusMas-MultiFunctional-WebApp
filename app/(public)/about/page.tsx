import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about Rusmas - Premium photography, videography, and curated products.",
};

export default function About() {
  return <AboutPage />;
}
