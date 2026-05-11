import type { Metadata } from "next";
import { ContactPage } from "@/components/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch via WhatsApp, email, or social media.",
};

export default function Contact() {
  return <ContactPage />;
}
