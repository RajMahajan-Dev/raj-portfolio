"use client";

import { useEffect, useRef } from "react";

export const AGENTS = [
  { label: "Perception", color: "#c9a227" },
  { label: "Navigation", color: "#e8820a" },
  { label: "Vision", color: "#7b5ea7" },
  { label: "Control", color: "#4a8fe8" },
  { label: "Learning", color: "#4ade80" },
  { label: "Safety", color: "#e879a8" },
];

type Vec = { x: number; y: number };

/**
 * Agent Cursor Swarm: 6 labelled cursors that build each section as it
 * scrolls into view. A selection frame grows over the section, the cursors
 * ride its corners, then the frame settles and the cursors drift away.
 * Desktop (fine pointer) only; disabled for touch and reduced motion.
 */
export default function AgentSwarm() {
  const layerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const agentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const posRef = useRef<Vec[]>(AGENTS.map(() => ({ x: -100, y: -100 })));
  const targetRef = useRef<Vec[]>(AGENTS.map(() => ({ x: -100, y: -100 })));
  const builtRef = useRef<Set<string>>(new Set());
  const busyRef = useRef(false);
  const enabledRef = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    enabledRef.current = true;

    const vw = () => window.innerWidth;
    const vh = () => window.innerHeight;
    // Start off-screen at the edges, fly in on load.
    AGENTS.forEach((_, i) => {
      posRef.current[i] = { x: i % 2 === 0 ? -60 : vw() + 60, y: vh() * (0.2 + i * 0.12) };
      targetRef.current[i] = { x: vw() / 2 + (i - 2.5) * 70, y: vh() * 0.32 };
    });

    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 0.016;
      const layer = layerRef.current;
      if (layer) {
        // Idle conga: when not building, agents follow a slow Lissajous drift.
        if (!busyRef.current) {
          AGENTS.forEach((_, i) => {
            const lag = i * 0.45;
            targetRef.current[i] = {
              x: vw() / 2 + Math.sin(t * 0.45 + lag) * vw() * 0.28,
              y: vh() * 0.42 + Math.sin(t * 0.7 + lag * 1.3) * vh() * 0.16,
            };
          });
        }
        AGENTS.forEach((_, i) => {
          const p = posRef.current[i];
          const tg = targetRef.current[i];
          p.x += (tg.x - p.x) * 0.07;
          p.y += (tg.y - p.y) * 0.07;
          const el = agentRefs.current[i];
          if (el) el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const buildSection = (el: HTMLElement) => {
      if (busyRef.current) return;
      busyRef.current = true;
      const r = el.getBoundingClientRect();
      const frame = frameRef.current;
      if (frame) {
        frame.style.opacity = "1";
        frame.style.transform = `translate3d(${r.left}px, ${r.top}px, 0)`;
        frame.style.width = `${Math.max(r.width, 120)}px`;
        frame.style.height = `${Math.max(r.height, 80)}px`;
        frame.style.transition = "width .5s cubic-bezier(.16,1,.3,1), height .5s cubic-bezier(.16,1,.3,1), transform .5s cubic-bezier(.16,1,.3,1), opacity .3s";
      }
      const corners: Vec[] = [
        { x: r.left + r.width - 10, y: r.top + r.height - 10 },
        { x: r.left + 10, y: r.top + 10 },
        { x: r.left + r.width * 0.5, y: r.top + 10 },
        { x: r.left + 10, y: r.top + r.height * 0.5 },
        { x: r.left + r.width - 10, y: r.top + r.height * 0.5 },
        { x: r.left + r.width * 0.5, y: r.top + r.height - 10 },
      ];
      AGENTS.forEach((_, i) => {
        targetRef.current[i] = corners[i % corners.length];
      });
      window.setTimeout(() => {
        if (frame) frame.style.opacity = "0";
        busyRef.current = false;
      }, 1100);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          const id = el.id || el.dataset.build || "";
          if (builtRef.current.has(id)) continue;
          builtRef.current.add(id);
          buildSection(el);
        }
      },
      { rootMargin: "0px 0px -38% 0px", threshold: 0 }
    );
    document.querySelectorAll<HTMLElement>("[data-build]").forEach((el) => observer.observe(el));

    const onReplay = () => {
      builtRef.current.clear();
      const hero = document.querySelector<HTMLElement>("[data-build]");
      if (hero) {
        hero.scrollIntoView({ behavior: "smooth", block: "start" });
        window.setTimeout(() => buildSection(hero), 450);
      }
    };
    window.addEventListener("swarm-replay", onReplay);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("swarm-replay", onReplay);
    };
  }, []);

  return (
    <>
      <div
        ref={layerRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50 hidden [@media(pointer:fine)]:block [@media(prefers-reduced-motion:reduce)]:hidden"
      >
        <div
          ref={frameRef}
          className="absolute left-0 top-0 rounded-lg border-2 border-dashed opacity-0"
          style={{ borderColor: "#c9a227", boxShadow: "0 0 0 1px rgba(201,162,39,.25)" }}
        >
          <span className="absolute -top-6 left-0 rounded bg-[#c9a227] px-2 py-0.5 font-mono text-[10px] font-medium text-black">
            building…
          </span>
        </div>
        {AGENTS.map((a, i) => (
          <div
            key={a.label}
            ref={(el) => {
              agentRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 will-change-transform"
            style={{ transform: "translate3d(-200px, -200px, 0)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={a.color} aria-hidden="true">
              <path d="M4 2 L20 12 L13 13.5 L10 20 Z" stroke="white" strokeWidth="1.4" />
            </svg>
            <span
              className="ml-4 -mt-1 inline-block whitespace-nowrap rounded-full px-2 py-0.5 font-mono text-[10px] font-medium text-white shadow"
              style={{ background: a.color }}
            >
              {a.label}
            </span>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => window.dispatchEvent(new Event("swarm-replay"))}
        className="fixed bottom-5 right-5 z-50 hidden rounded-full border border-border bg-card px-3 py-1.5 font-mono text-[11px] text-muted shadow-lg transition hover:text-accent [@media(pointer:fine)]:block [@media(prefers-reduced-motion:reduce)]:hidden"
        title="Replay the agent swarm build"
      >
        ↻ Replay swarm
      </button>
    </>
  );
}
