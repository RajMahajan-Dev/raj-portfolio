"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MORE_PROJECTS, TOP_PROJECTS, type Project } from "@/data/portfolio";
import { Reveal } from "./Reveal";

function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-6 transition hover:border-accent/60">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-bold leading-snug">{p.name}</h3>
        <span className="shrink-0 font-mono text-[11px] text-dim">{p.period}</span>
      </div>
      {p.funded && <p className="mt-1 font-mono text-[11px] text-accent">{p.funded}</p>}
      <p className="mt-3 text-sm leading-relaxed text-muted">{p.desc}</p>
      <p className="mt-3 text-sm leading-relaxed">{p.keyImpl}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {p.skills.map((s) => (
          <span key={s} className="rounded-full border border-border bg-card2 px-2.5 py-0.5 font-mono text-[11px] text-muted">
            {s}
          </span>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        {p.github && (
          <a href={p.github} target="_blank" rel="noreferrer" className="font-medium text-accent hover:underline">
            GitHub →
          </a>
        )}
        {p.liveApp && (
          <a href={p.liveApp} target="_blank" rel="noreferrer" className="font-medium text-accent hover:underline">
            Live →
          </a>
        )}
        {p.showcased?.map((s) => (
          <span key={s} className="text-muted">
            ★ {s}
          </span>
        ))}
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {TOP_PROJECTS.map((p, i) => (
          <Reveal key={p.name} delay={(i % 2) * 0.08}>
            <ProjectCard p={p} />
          </Reveal>
        ))}
      </div>
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium transition hover:border-accent hover:text-accent"
        >
          {open ? "Show fewer builds ↑" : `More builds (${MORE_PROJECTS.length}) ↓`}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {MORE_PROJECTS.map((p) => (
                <ProjectCard key={p.name} p={p} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
