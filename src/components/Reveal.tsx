"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <Reveal>
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">{kicker}</p>
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
    </Reveal>
  );
}
