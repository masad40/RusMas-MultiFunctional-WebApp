"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-16 sm:py-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <p className="text-[0.65rem] tracking-[0.4em] text-gold uppercase">Our Story</p>
        <h1 className="font-display mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          About Rusmas
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
          Crafting cinematic moments and curating premium products with precision and artistry.
        </p>
      </motion.div>

      {/* Mission Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-20"
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Our Mission
            </h2>
            <p className="mt-6 text-base leading-relaxed text-white/80">
              At Rusmas, we believe in capturing life&apos;s most precious moments with a cinematic touch. 
              Our passion for photography and videography drives us to create timeless memories that 
              tell your unique story.
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              Beyond visual storytelling, we curate a collection of premium products—from mobile cases 
              to earphones and apparel—designed to complement your lifestyle with elegance and quality.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden border border-gold/30">
            <Image
              src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1600&q=85&auto=format&fit=crop"
              alt="Rusmas Studio"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-24"
      >
        <h2 className="font-display text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Our Values
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: (
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Quality First",
              description: "Every project receives meticulous attention to detail, ensuring exceptional results that exceed expectations.",
            },
            {
              icon: (
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ),
              title: "Creative Vision",
              description: "We bring a unique artistic perspective to every shoot, transforming ordinary moments into extraordinary memories.",
            },
            {
              icon: (
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: "Timely Delivery",
              description: "We respect your time and ensure all projects are delivered promptly without compromising quality.",
            },
            {
              icon: (
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ),
              title: "Client-Focused",
              description: "Your satisfaction is our priority. We work closely with you to bring your vision to life.",
            },
            {
              icon: (
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: "Innovation",
              description: "We stay ahead of trends, using cutting-edge techniques and equipment to deliver modern, stunning results.",
            },
            {
              icon: (
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              ),
              title: "Premium Quality",
              description: "From photography to products, we curate only the finest offerings that reflect excellence.",
            },
          ].map((value, idx) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + idx * 0.1 }}
              className="group border border-border-subtle bg-surface/20 px-6 py-8 transition-all duration-300 hover:border-gold/40 hover:bg-surface/30"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-gold transition-transform duration-300 group-hover:scale-110">
                  {value.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-white">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-24"
      >
        <h2 className="font-display text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
          What We Offer
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Photography",
              description: "Wedding, portrait, and event photography with a cinematic touch. We capture emotions and moments that last forever.",
              link: "/photography",
            },
            {
              title: "Videography",
              description: "Professional video production for weddings, events, and commercial projects. Storytelling through motion.",
              link: "/videography",
            },
            {
              title: "Premium Shop",
              description: "Curated collection of mobile cases, earphones, apparel, and accessories designed with style and quality.",
              link: "/shop",
            },
          ].map((service, idx) => (
            <motion.a
              key={service.title}
              href={service.link}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 + idx * 0.1 }}
              className="group border border-gold/30 bg-gold/5 px-6 py-8 transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]"
            >
              <h3 className="font-display text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-gold">
                {service.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/70">
                {service.description}
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs tracking-widest uppercase text-gold transition-transform duration-300 group-hover:translate-x-2">
                Explore
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-24 border border-gold/30 bg-gold/5 px-8 py-16 text-center"
      >
        <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Let&apos;s Create Together
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-white/80">
          Ready to capture your special moments or explore our premium collection? Get in touch with us today.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/contact"
            className="bg-gold px-8 py-4 text-sm font-semibold tracking-widest text-black uppercase transition-all duration-300 hover:bg-gold/90 hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
          >
            Contact Us
          </a>
          <a
            href="/shop"
            className="border border-gold/30 px-8 py-4 text-sm font-semibold tracking-widest text-gold uppercase transition-all duration-300 hover:border-gold hover:bg-gold/10"
          >
            Browse Shop
          </a>
        </div>
      </motion.section>
    </main>
  );
}
