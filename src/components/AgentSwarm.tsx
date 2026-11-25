"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Agent Cursor Swarm — rebuilt to match the Framer "Agent Cursor Swarm"
 * template's exact behaviour, adapted to a scrolling portfolio:
 *
 * - Load IS the build: the page starts on black with empty outlines.
 *   Nothing is visible before its agents build it — each layer starts as a
 *   blue selection outline with white handles and a "W × H" dimension pill.
 * - Horizontal ruler across the top (100–1100) and vertical ruler down the
 *   left (100–700), with blue highlighted segments at the active target.
 * - A thin red BUILD LINE sweeps across the viewport at the height of the
 *   element being built, labelled "BUILD LINE" at its right end.
 * - Six labelled agent cursors cluster on the element being built, in a
 *   diagonal chain. Text appears last on each element.
 * - HUD pill, fixed bottom centre: coloured agent dots, "6 agents",
 *   "built / total layers", progress track, blue SKIP (during a build) and
 *   a 1× → 2× → 4× speed button. When a build finishes it reads
 *   "Rebuilt N layers in Xs" with a REBUILD button.
 * - When a build finishes, the cursors fan out into an arc above the HUD
 *   and fade away completely — they never linger over the text.
 * - Scrolling builds each section the same way when it enters view.
 * - Touch devices and prefers-reduced-motion: swarm off, everything
 *   visible immediately, no HUD.
 */

export const AGENTS = [
  { label: "Perception", color: "#c9a227" },
  { label: "Navigation", color: "#e8820a" },
  { label: "Vision", color: "#7b5ea7" },
  { label: "Control", color: "#4a8fe8" },
  { label: "Learning", color: "#4ade80" },
  { label: "Safety", color: "#e879a8" },
];

type Vec = { x: number; y: number };
type Rect = { left: number; top: number; width: number; height: number };
type HudState = {
  built: number;
  total: number;
  building: boolean;
  finished: boolean;
  elapsed: number;
  speed: 1 | 2 | 4;
};

const SPEEDS: (1 | 2 | 4)[] = [1, 2, 4];
const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

export default function AgentSwarm() {
  const [enabled, setEnabled] = useState(false);
  const [hud, setHud] = useState<HudState>({ built: 0, total: 0, building: false, finished: false, elapsed: 0, speed: 1 });
  const [sel, setSel] = useState<Rect | null>(null);
  const [dim, setDim] = useState("");
  const [rulers, setRulers] = useState(false);
  const [buildLineY, setBuildLineY] = useState<number | null>(null);
  const [agentsVisible, setAgentsVisible] = useState(false);

  const layerRef = useRef<HTMLDivElement>(null);
  const agentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const posRef = useRef<Vec[]>(AGENTS.map(() => ({ x: -100, y: -100 })));
  const targetRef = useRef<Vec[]>(AGENTS.map(() => ({ x: -100, y: -100 })));
  const builtRef = useRef<Set<HTMLElement>>(new Set());
  const layersRef = useRef<HTMLElement[]>([]);
  const speedRef = useRef<1 | 2 | 4>(1);
  const runIdRef = useRef(0);
  const startRef = useRef(0);
  const finishedRef = useRef(false);
  const buildingRef = useRef(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const vw = () => window.innerWidth;
    const vh = () => window.innerHeight;

    // Collect build layers in DOM order and hide them. Hiding is applied
    // by JS only, so touch / reduced-motion visitors always see everything.
    const layers = Array.from(document.querySelectorAll<HTMLElement>("[data-swarm-layer]"));
    layersRef.current = layers;
    layers.forEach((el) => el.classList.add("swarm-layer", "swarm-hidden"));
    setHud((h) => ({ ...h, total: layers.length }));

    // Cursor physics loop: agents ease toward their targets.
    let raf = 0;
    const tick = () => {
      AGENTS.forEach((_, i) => {
        const p = posRef.current[i];
        const tg = targetRef.current[i];
        p.x += (tg.x - p.x) * 0.08;
        p.y += (tg.y - p.y) * 0.08;
        const el = agentRefs.current[i];
        if (el) el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const pointsAround = (r: Rect): Vec[] => [
      { x: r.left + r.width - 14, y: r.top + r.height - 14 },
      { x: r.left + 14, y: r.top + 14 },
      { x: r.left + r.width * 0.5, y: r.top + 12 },
      { x: r.left + 12, y: r.top + r.height * 0.5 },
      { x: r.left + r.width - 12, y: r.top + r.height * 0.5 },
      { x: r.left + r.width * 0.5, y: r.top + r.height - 12 },
    ];

    const fanOut = async (runId: number, speed: number) => {
      const cx = vw() / 2;
      const cy = vh() - 130;
      AGENTS.forEach((_, i) => {
        const a = (Math.PI * (i + 0.5)) / AGENTS.length;
        targetRef.current[i] = { x: cx + Math.cos(Math.PI - a) * 190, y: cy - Math.sin(a) * 110 };
      });
      await sleep(650 / speed);
      if (runId !== runIdRef.current) return;
      setAgentsVisible(false);
      setSel(null);
      setBuildLineY(null);
      setRulers(false);
    };

    const buildOne = async (el: HTMLElement, runId: number): Promise<boolean> => {
      const speed = speedRef.current;
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) {
        el.classList.remove("swarm-hidden");
        return true;
      }
      const rect: Rect = { left: r.left, top: r.top, width: r.width, height: r.height };
      setAgentsVisible(true);
      setSel(rect);
      setDim(`${Math.round(r.width)} × ${Math.round(r.height)}`);
      setBuildLineY(r.top + r.height / 2);
      const pts = pointsAround(rect);
      AGENTS.forEach((_, i) => {
        targetRef.current[i] = pts[i % pts.length];
      });
      await sleep(420 / speed);
      if (runId !== runIdRef.current) return false;
      // Text appears last: reveal the layer only after the agents arrive.
      el.classList.remove("swarm-hidden");
      builtRef.current.add(el);
      setHud((h) => ({ ...h, built: h.built + 1 }));
      await sleep(180 / speed);
      return runId === runIdRef.current;
    };

    const runBuild = async (queue: HTMLElement[], withRulers: boolean) => {
      const runId = ++runIdRef.current;
      if (queue.length === 0) return;
      buildingRef.current = true;
      startRef.current = performance.now();
      finishedRef.current = false;
      setHud((h) => ({ ...h, building: true, finished: false }));
      if (withRulers) setRulers(true);
      for (const el of queue) {
        if (runId !== runIdRef.current) {
          buildingRef.current = false;
          return;
        }
        if (builtRef.current.has(el)) continue;
        const ok = await buildOne(el, runId);
        if (!ok) {
          buildingRef.current = false;
          return;
        }
      }
      if (runId !== runIdRef.current) {
        buildingRef.current = false;
        return;
      }
      const elapsed = (performance.now() - startRef.current) / 1000;
      finishedRef.current = true;
      setHud((h) => ({ ...h, building: false, finished: true, elapsed }));
      await fanOut(runId, speedRef.current);
      buildingRef.current = false;
    };

    const skip = () => {
      runIdRef.current++;
      buildingRef.current = false;
      layersRef.current.forEach((el) => {
        el.classList.remove("swarm-hidden");
        builtRef.current.add(el);
      });
      const elapsed = startRef.current ? (performance.now() - startRef.current) / 1000 : 0;
      setHud((h) => ({ ...h, built: h.total, building: false, finished: true, elapsed }));
      setAgentsVisible(false);
      setSel(null);
      setBuildLineY(null);
      setRulers(false);
      finishedRef.current = true;
    };

    const rebuild = () => {
      runIdRef.current++;
      builtRef.current.clear();
      finishedRef.current = false;
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      layersRef.current.forEach((el) => el.classList.add("swarm-hidden"));
      setHud((h) => ({ ...h, built: 0, finished: false }));
      const hero = layersRef.current.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0;
      });
      void runBuild(hero, true);
    };

    // Initial build: only the layers already in the viewport (nav + hero).
    const inView = layers.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    });
    const t0 = window.setTimeout(() => void runBuild(inView, true), 250);

    // Scroll builds: each section builds when it enters view.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          if (builtRef.current.has(el)) continue;
          // Never cancel a build already in flight (e.g. the hero build):
          // wait for it to finish, then build this section.
          if (buildingRef.current) {
            window.setTimeout(() => {
              if (!builtRef.current.has(el) && !buildingRef.current) {
                observer.unobserve(el);
                void runBuild([el], false);
              }
            }, 900);
            continue;
          }
          observer.unobserve(el);
          void runBuild([el], false);
        }
      },
      { rootMargin: "0px 0px -25% 0px", threshold: 0 }
    );
    layers.forEach((el) => observer.observe(el));

    const onSwarm = (ev: Event) => {
      const type = (ev as CustomEvent<string>).detail;
      if (type === "skip") skip();
      if (type === "rebuild") rebuild();
      if (type === "speed") {
        const next = SPEEDS[(SPEEDS.indexOf(speedRef.current) + 1) % SPEEDS.length];
        speedRef.current = next;
        setHud((h) => ({ ...h, speed: next }));
      }
    };
    window.addEventListener("swarm-control", onSwarm as EventListener);
    return () => {
      window.clearTimeout(t0);
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("swarm-control", onSwarm as EventListener);
    };
  }, []);

  if (!enabled) return null;

  const fire = (detail: string) => window.dispatchEvent(new CustomEvent("swarm-control", { detail }));
  const rulerTicks = Array.from({ length: 12 }, (_, i) => (i + 1) * 100);
  const vTicks = Array.from({ length: 8 }, (_, i) => (i + 1) * 100);

  return (
    <>
      {/* Rulers — top and left, like the template */}
      {rulers && (
        <>
          <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-40 h-6 border-b border-blue-500/30 bg-black/60">
            <div className="relative mx-auto h-full max-w-5xl">
              {rulerTicks.map((n) => (
                <span key={n} className="absolute top-0 font-mono text-[9px] text-blue-400/80" style={{ left: `${(n / 1200) * 100}%` }}>
                  {n}
                </span>
              ))}
              <span className="absolute inset-y-0 bg-blue-500/25" style={{ left: "18%", width: "22%" }} />
            </div>
          </div>
          <div aria-hidden="true" className="pointer-events-none fixed inset-y-0 left-0 z-40 w-6 border-r border-blue-500/30 bg-black/60">
            <div className="relative h-full">
              {vTicks.map((n) => (
                <span key={n} className="absolute left-0.5 font-mono text-[9px] text-blue-400/80" style={{ top: `${(n / 800) * 100}%` }}>
                  {n}
                </span>
              ))}
              <span className="absolute inset-x-0 bg-blue-500/25" style={{ top: "30%", height: "18%" }} />
            </div>
          </div>
        </>
      )}

      {/* BUILD LINE */}
      {buildLineY !== null && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 z-40" style={{ top: buildLineY }}>
          <div className="h-px w-full bg-red-500/80" />
          <span className="absolute right-3 -top-2 font-mono text-[10px] tracking-widest text-red-500">BUILD LINE</span>
        </div>
      )}

      {/* Selection outline with handles + dimension pill */}
      {sel && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-40 rounded-[4px] border-[1.5px] border-blue-500"
          style={{ left: sel.left - 4, top: sel.top - 4, width: sel.width + 8, height: sel.height + 8 }}
        >
          <span className="absolute -top-6 left-0 rounded bg-blue-500 px-1.5 py-0.5 font-mono text-[10px] font-medium text-white">{dim}</span>
          {[
            ["-left-1 -top-1", ""],
            ["left-1/2 -top-1 -translate-x-1/2", ""],
            ["-right-1 -top-1", ""],
            ["-right-1 top-1/2 -translate-y-1/2", ""],
            ["-right-1 -bottom-1", ""],
            ["left-1/2 -bottom-1 -translate-x-1/2", ""],
            ["-left-1 -bottom-1", ""],
            ["-left-1 top-1/2 -translate-y-1/2", ""],
          ].map(([pos], i) => (
            <span key={i} className={`absolute ${pos} h-2 w-2 bg-white shadow`} />
          ))}
        </div>
      )}

      {/* Agent cursors */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50" style={{ opacity: agentsVisible ? 1 : 0, transition: "opacity .45s" }}>
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

      {/* HUD — bottom centre, like the template */}
      <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#1a1a1a]/95 px-4 py-2 font-mono text-[11px] text-white shadow-2xl backdrop-blur">
          <span className="flex gap-1">
            {AGENTS.slice(0, 5).map((a) => (
              <span key={a.label} className="h-2 w-2 rounded-full" style={{ background: a.color }} />
            ))}
          </span>
          <span className="whitespace-nowrap text-white/80">6 agents</span>
          <span className="whitespace-nowrap">
            {hud.finished
              ? `Rebuilt ${hud.total} layers in ${hud.elapsed.toFixed(1)}s`
              : `${hud.built} / ${hud.total} layers`}
          </span>
          <span className="h-1 w-20 overflow-hidden rounded-full bg-white/15 sm:w-28">
            <span className="block h-full bg-blue-500 transition-all duration-300" style={{ width: `${hud.total ? (hud.built / hud.total) * 100 : 0}%` }} />
          </span>
          {hud.building ? (
            <button type="button" onClick={() => fire("skip")} className="rounded-full bg-blue-500 px-3 py-1 font-semibold text-white transition hover:bg-blue-400">
              SKIP
            </button>
          ) : (
            <button type="button" onClick={() => fire("rebuild")} className="rounded-full bg-blue-500 px-3 py-1 font-semibold text-white transition hover:bg-blue-400">
              REBUILD
            </button>
          )}
          <button type="button" onClick={() => fire("speed")} className="rounded-full border border-white/20 px-2.5 py-1 text-white/80 transition hover:text-white" title="Animation speed">
            {hud.speed}×
          </button>
        </div>
      </div>
    </>
  );
}
