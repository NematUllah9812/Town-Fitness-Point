"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { ButtonLink, Button } from "@/components/ui/button";
import { useTrialModal } from "@/components/marketing/trial-modal-provider";

/**
 * Full-screen hero. Subtle parallax on the background image (the one
 * place parallax is used — restraint is part of the design language).
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const { openTrial } = useTrialModal();

  return (
    <section ref={ref} className="relative flex min-h-svh items-center overflow-hidden">
      {/* Background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <Image
          src="/images/hero.jpg"
          alt="Athlete training on the Town Fitness Point floor"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-obsidian/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/60" />

      {/* Content */}
      <motion.div
        className="container-x relative z-10 pt-28 pb-24"
        style={{ opacity: fade }}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        <p className="kicker">Town Fitness Point — [ADD CITY]</p>
        <h1 className="mt-5 max-w-3xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
          Strength Is <span className="text-lime">Built</span> Here.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist md:text-xl">
          Premium coaching, pro-grade equipment and a training floor built
          for people who show up. Your first session is on us.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button size="lg" onClick={openTrial}>
            Book Your Free Session
          </Button>
          <ButtonLink size="lg" variant="outline" href="/membership">
            View Membership
          </ButtonLink>
        </div>
        <p className="mt-6 text-sm text-faint">
          Free 60-minute trial · No pressure · No obligation
        </p>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <ChevronDown className="size-6 animate-bounce text-faint" aria-hidden />
        <span className="sr-only">Scroll for more</span>
      </motion.div>
    </section>
  );
}
