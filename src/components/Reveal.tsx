"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

/**
 * Types a heading out letter by letter with a blinking caret, starting
 * when the agents build its section — the Cursor template types its
 * headlines as it builds them. Without the swarm (touch / reduced
 * motion) the full title shows immediately.
 */
function TypedTitle({ title }: { title: string }) {
  const [text, setText] = useState("");
  const ref = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      let i = 0;
      const id = window.setInterval(() => {
        i++;
        setText(title.slice(0, i));
        if (i >= title.length) window.clearInterval(id);
      }, 42);
      return () => window.clearInterval(id);
    };
    let cleanup: (() => void) | undefined;
    let fallback = 0;
    const layer = ref.current?.closest("[data-swarm-layer]");
    if (layer && layer.classList.contains("swarm-hidden")) {
      const obs = new MutationObserver(() => {
        if (!layer.classList.contains("swarm-hidden")) {
          cleanup = start();
          obs.disconnect();
        }
      });
      obs.observe(layer, { attributes: true, attributeFilter: ["class"] });
      cleanup = () => obs.disconnect();
      fallback = window.setTimeout(() => {
        cleanup = start();
      }, 9000);
    } else {
      setText(title);
    }
    return () => {
      cleanup?.();
      window.clearTimeout(fallback);
    };
  }, [title]);

  const done = text === title;
  return (
    <span ref={ref}>
      {text}
      {!done && <span className="type-cursor ml-0.5 inline-block h-[0.9em] w-[3px] translate-y-[0.1em] bg-accent" aria-hidden="true" />}
    </span>
  );
}

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
      <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        <TypedTitle title={title} />
      </h2>
    </Reveal>
  );
}
