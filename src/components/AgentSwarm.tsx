"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Agent Cursor Swarm — built to match the Framer "Cursor" template
 * (cursorswarm.framer.website) as closely as a scrolling portfolio allows:
 *
 * - SCAN PRELOADER: pure black full screen. Centre: a charcoal rounded
 *   square holding a white dashed square with a blue cursor inside, ringed
 *   by 14 coloured cursor arrows orbiting with faint trails. Bottom-centre
 *   HUD reads "Scanning page… N layers" with a progress bar while the
 *   counter climbs fast to the page's real element count (~2s).
 * - BUILD: the preloader fades and the 6 named agents fly in and drag out
 *   thin blue selection rectangles that grow from "0 × 0" to the element's
 *   real size, with a live blue dimension label. Rulers across the top
 *   (100–1900) and down the left (100–2900), blue dashed gridlines, and a
 *   red BUILD LINE across the viewport. Text is typed in as the agents
 *   build it; nothing is visible before its agents build it.
 * - SCROLL: sections below the hero stay empty black until they scroll
 *   into view, then build the same way. Hint under the hero buttons:
 *   "Scroll to build · Stop and the swarm comes to your cursor · Esc skips".
 * - IDLE POINTER: when the mouse stops moving, the swarm flies to it and
 *   rings around it; it fades away when the mouse moves again.
 * - HUD: bottom-centre pill with agent dots, "6 agents", "built / total
 *   layers", progress track, Tour button, 1×/2×/4× speed, and × to skip.
 *   Esc skips too. After a build: "Rebuilt N layers in Xs" with REBUILD.
 * - Touch / reduced-motion: swarm off, everything visible, no HUD.
 */

export const AGENTS = [
  { label: "Perception", color: "#c9a227" },
  { label: "Navigation", color: "#e8820a" },
  { label: "Vision", color: "#7b5ea7" },
  { label: "Control", color: "#4a8fe8" },
  { label: "Learning", color: "#4ade80" },
  { label: "Safety", color: "#e879a8" },
];

const RING_COLORS = ["#facc15", "#ec4899", "#a78bfa", "#2dd4bf", "#4ade80", "#3b82f6", "#fb923c", "#ef4444", "#e879f9", "#22d3ee", "#f472b6", "#a3e635", "#60a5fa", "#f97316"];

type Vec = { x: number; y: number };
type Rect = { left: number; top: number; width: number; height: number };
type Phase = "scan" | "build" | "done";
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
  const [phase, setPhase] = useState<Phase>("scan");
  const [scanCount, setScanCount] = useState(0);
  const [scanTotal, setScanTotal] = useState(0);
  const [hud, setHud] = useState<HudState>({ built: 0, total: 0, building: false, finished: false, elapsed: 0, speed: 1 });
  const [sel, setSel] = useState<Rect | null>(null);
  const [dim, setDim] = useState("");
  const [rulers, setRulers] = useState(false);
  const [buildLineY, setBuildLineY] = useState<number | null>(null);
  const [agentsVisible, setAgentsVisible] = useState(false);
  const [hudHidden, setHudHidden] = useState(false);

  const agentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const posRef = useRef<Vec[]>(AGENTS.map(() => ({ x: -100, y: -100 })));
  const targetRef = useRef<Vec[]>(AGENTS.map(() => ({ x: -100, y: -100 })));
  const builtRef = useRef<Set<HTMLElement>>(new Set());
  const layersRef = useRef<HTMLElement[]>([]);
  const speedRef = useRef<1 | 2 | 4>(1);
  const runIdRef = useRef(0);
  const startRef = useRef(0);
  const buildingRef = useRef(false);
  const phaseRef = useRef<Phase>("scan");

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    phaseRef.current = "scan";

    const vw = () => window.innerWidth;
    const vh = () => window.innerHeight;

    const layers = Array.from(document.querySelectorAll<HTMLElement>("[data-swarm-layer]"));
    layersRef.current = layers;
    layers.forEach((el) => el.classList.add("swarm-layer", "swarm-hidden"));
    const total = document.querySelectorAll("body *").length;
    setScanTotal(total);
    setHud((h) => ({ ...h, total: layers.length }));

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
      // Box grows from 0 × 0, like the agents dragging it out.
      setSel({ left: rect.left, top: rect.top, width: 0, height: 0 });
      setDim("0 × 0");
      setBuildLineY(rect.top + rect.height / 2);
      const pts = pointsAround(rect);
      AGENTS.forEach((_, i) => {
        targetRef.current[i] = pts[i % pts.length];
      });
      await sleep(60 / speed);
      if (runId !== runIdRef.current) return false;
      setSel(rect);
      await sleep(360 / speed);
      if (runId !== runIdRef.current) return false;
      setDim(`${Math.round(rect.width)} × ${Math.round(rect.height)}`);
      el.classList.remove("swarm-hidden");
      builtRef.current.add(el);
      setHud((h) => ({ ...h, built: h.built + 1 }));
      await sleep(160 / speed);
      return runId === runIdRef.current;
    };

    const runBuild = async (queue: HTMLElement[], withRulers: boolean) => {
      const runId = ++runIdRef.current;
      if (queue.length === 0) return;
      buildingRef.current = true;
      startRef.current = performance.now();
      setPhase("build");
      phaseRef.current = "build";
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
      setHud((h) => ({ ...h, building: false, finished: true, elapsed }));
      setPhase("done");
      phaseRef.current = "done";
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
      setPhase("done");
      phaseRef.current = "done";
      setAgentsVisible(false);
      setSel(null);
      setBuildLineY(null);
      setRulers(false);
    };

    const rebuild = () => {
      runIdRef.current++;
      builtRef.current.clear();
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      layersRef.current.forEach((el) => el.classList.add("swarm-hidden"));
      setHud((h) => ({ ...h, built: 0, finished: false }));
      setPhase("scan");
      phaseRef.current = "scan";
      void scanThenBuild();
    };

    const tour = () => {
      rebuild();
      const sections = layersRef.current.filter((el) => el.tagName === "SECTION");
      sections.forEach((el, i) => {
        window.setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 4500 + i * 1600);
      });
    };

    // Scan phase: counter climbs fast to the real element count, ~2s.
    const scanThenBuild = async () => {
      const t0 = performance.now();
      const dur = 2000;
      await new Promise<void>((resolve) => {
        const step = () => {
          const p = Math.min(1, (performance.now() - t0) / dur);
          setScanCount(Math.round(total * (1 - Math.pow(1 - p, 2))));
          if (p < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
      const inView = layersRef.current.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0;
      });
      void runBuild(inView, true);
    };
    void scanThenBuild();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          if (builtRef.current.has(el)) continue;
          if (buildingRef.current || phaseRef.current === "scan") {
            window.setTimeout(() => {
              if (!builtRef.current.has(el) && !buildingRef.current && phaseRef.current !== "scan") {
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

    // Esc skips the build, like the template.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);

    // Idle pointer: when the mouse stops, the swarm flies to it and rings
    // around it; it fades away again when the mouse moves.
    let idleTimer = 0;
    let lastX = -1;
    let lastY = -1;
    const onMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      setAgentsVisible(false);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        if (phaseRef.current !== "done" || buildingRef.current) return;
        AGENTS.forEach((_, i) => {
          const a = (Math.PI * 2 * i) / AGENTS.length - Math.PI / 2;
          targetRef.current[i] = { x: lastX + Math.cos(a) * 74, y: lastY + Math.sin(a) * 74 };
        });
        AGENTS.forEach((_, i) => {
          posRef.current[i] = { x: lastX + (Math.random() - 0.5) * 300, y: lastY + (Math.random() - 0.5) * 300 };
        });
        setAgentsVisible(true);
      }, 1500);
    };
    window.addEventListener("mousemove", onMove);

    const onSwarm = (ev: Event) => {
      const type = (ev as CustomEvent<string>).detail;
      if (type === "skip") skip();
      if (type === "rebuild") rebuild();
      if (type === "tour") tour();
      if (type === "close-hud") setHudHidden(true);
      if (type === "speed") {
        const next = SPEEDS[(SPEEDS.indexOf(speedRef.current) + 1) % SPEEDS.length];
        speedRef.current = next;
        setHud((h) => ({ ...h, speed: next }));
      }
    };
    window.addEventListener("swarm-control", onSwarm as EventListener);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("swarm-control", onSwarm as EventListener);
      window.clearTimeout(idleTimer);
    };
  }, []);

  if (!enabled) return null;

  const fire = (detail: string) => window.dispatchEvent(new CustomEvent("swarm-control", { detail }));
  const rulerTicks = Array.from({ length: 19 }, (_, i) => (i + 1) * 100);
  const vTicks = Array.from({ length: 29 }, (_, i) => (i + 1) * 100);
  const scanPct = scanTotal ? Math.min(100, (scanCount / scanTotal) * 100) : 0;

  return (
    <>
      {/* SCAN PRELOADER */}
      {phase === "scan" && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black">
          <div className="relative flex h-64 w-64 items-center justify-center">
            {/* Orbiting ring of 14 cursors */}
            <div className="swarm-orbit absolute inset-0">
              {RING_COLORS.map((c, i) => {
                const a = (Math.PI * 2 * i) / RING_COLORS.length;
                return (
                  <span
                    key={i}
                    className="absolute left-1/2 top-1/2"
                    style={{ transform: `translate(-50%, -50%) rotate(${a}rad) translateY(-118px)` }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={c} aria-hidden="true">
                      <path d="M4 2 L20 12 L13 13.5 L10 20 Z" stroke="white" strokeWidth="1.4" />
                    </svg>
                  </span>
                );
              })}
            </div>
            {/* Centre logo: charcoal square, dashed white square, blue cursor */}
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#1a1a1a] shadow-2xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-dashed border-white/80">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#3b82f6" aria-hidden="true">
                  <path d="M4 2 L20 12 L13 13.5 L10 20 Z" stroke="white" strokeWidth="1.4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rulers + dashed grid, while building */}
      {rulers && (
        <>
          <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 opacity-60"
            style={{ backgroundImage: "linear-gradient(to right, rgba(59,130,246,.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,.12) 1px, transparent 1px)", backgroundSize: "100px 100px" }} />
          <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-40 h-6 border-b border-blue-500/30 bg-black/60">
            <div className="relative h-full">
              {rulerTicks.map((n) => (
                <span key={n} className="absolute top-0 font-mono text-[9px] text-blue-400/80" style={{ left: `${(n / 2000) * 100}%` }}>
                  {n}
                </span>
              ))}
              <span className="absolute inset-y-0 bg-blue-500/25" style={{ left: "18%", width: "22%" }} />
            </div>
          </div>
          <div aria-hidden="true" className="pointer-events-none fixed inset-y-0 left-0 z-40 w-6 border-r border-blue-500/30 bg-black/60">
            <div className="relative h-full">
              {vTicks.map((n) => (
                <span key={n} className="absolute left-0.5 font-mono text-[9px] text-blue-400/80" style={{ top: `${(n / 3000) * 100}%` }}>
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

      {/* Selection outline — grows from 0 × 0 — with handles + dimension pill */}
      {sel && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-40 rounded-[4px] border-[1.5px] border-blue-500 transition-all duration-300 ease-out"
          style={{ left: sel.left - 4, top: sel.top - 4, width: sel.width + 8, height: sel.height + 8 }}
        >
          <span className="absolute -top-6 left-0 rounded bg-blue-500 px-1.5 py-0.5 font-mono text-[10px] font-medium text-white">{dim}</span>
          {[
            "-left-1 -top-1",
            "left-1/2 -top-1 -translate-x-1/2",
            "-right-1 -top-1",
            "-right-1 top-1/2 -translate-y-1/2",
            "-right-1 -bottom-1",
            "left-1/2 -bottom-1 -translate-x-1/2",
            "-left-1 -bottom-1",
            "-left-1 top-1/2 -translate-y-1/2",
          ].map((pos, i) => (
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

      {/* HUD — bottom centre */}
      {!hudHidden && (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#1a1a1a]/95 px-4 py-2 font-mono text-[11px] text-white shadow-2xl backdrop-blur">
            <span className="flex gap-1">
              {AGENTS.slice(0, 5).map((a) => (
                <span key={a.label} className="h-2 w-2 rounded-full" style={{ background: a.color }} />
              ))}
            </span>
            {phase === "scan" ? (
              <>
                <span className="whitespace-nowrap text-white/80">Scanning page… {scanCount} layers</span>
                <span className="h-1 w-20 overflow-hidden rounded-full bg-white/15 sm:w-28">
                  <span className="block h-full bg-blue-500 transition-all duration-150" style={{ width: `${scanPct}%` }} />
                </span>
              </>
            ) : (
              <>
                <span className="whitespace-nowrap text-white/80">6 agents</span>
                <span className="whitespace-nowrap">
                  {hud.finished
                    ? `Rebuilt ${hud.total} layers in ${hud.elapsed.toFixed(1)}s`
                    : `${hud.built} / ${hud.total} layers`}
                </span>
                <span className="h-1 w-20 overflow-hidden rounded-full bg-white/15 sm:w-28">
                  <span className="block h-full bg-blue-500 transition-all duration-300" style={{ width: `${hud.total ? (hud.built / hud.total) * 100 : 0}%` }} />
                </span>
              </>
            )}
            <button type="button" onClick={() => fire("tour")} className="rounded-full border border-white/20 px-2.5 py-1 text-white/80 transition hover:text-white">
              Tour
            </button>
            {hud.building || phase === "scan" ? (
              <button type="button" onClick={() => fire("skip")} className="rounded-full bg-blue-500 px-3 py-1 font-semibold text-white transition hover:bg-blue-400" title="Skip the build (Esc)">
                ×
              </button>
            ) : hud.finished ? (
              <>
                <button type="button" onClick={() => fire("rebuild")} className="rounded-full bg-blue-500 px-3 py-1 font-semibold text-white transition hover:bg-blue-400">
                  REBUILD
                </button>
                <button type="button" onClick={() => fire("close-hud")} className="rounded-full border border-white/20 px-2 py-1 text-white/80 transition hover:text-white" title="Dismiss">
                  ×
                </button>
              </>
            ) : null}
            <button type="button" onClick={() => fire("speed")} className="rounded-full border border-white/20 px-2.5 py-1 text-white/80 transition hover:text-white" title="Animation speed">
              {hud.speed}×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
