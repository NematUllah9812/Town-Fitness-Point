"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useTrialModal } from "@/components/marketing/trial-modal-provider";

export function FinalCta() {
  const { openTrial } = useTrialModal();

  return (
    <section className="relative overflow-hidden border-t border-hairline">
      {/* subtle lime glow — restrained, not a gradient wash */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-lime/60 to-transparent"
        aria-hidden
      />
      <Container className="py-24 text-center md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <p className="kicker">Free trial</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            Your First Session Is On Us.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-mist">
            Walk in, train free, and feel the difference. No pressure, no
            obligation — just a session that shows you what this place is
            made of.
          </p>
          <Button size="lg" onClick={openTrial} className="mt-10">
            Book Your Free Session
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
