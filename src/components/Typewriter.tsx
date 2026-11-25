"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Typewriter: types a phrase character by character, pauses, deletes it,
 * then types the next one, with a blinking cursor. It starts only once its
 * hero layer has been built by the agent swarm (the `swarm-hidden` class
 * is removed from the layer) — or immediately when the swarm is off
 * (touch / reduced motion), where the class is never applied.
 */
const PHRASES = ["AI & Robotics", "Edge AI", "Computer Vision", "ROS2 & SLAM", "Robot Perception"];

export default function Typewriter() {
  const [text, setText] = useState("");
  const wrapRef = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      let phrase = 0;
      let char = 0;
      let deleting = false;
      let timer = 0;
      const step = () => {
        const current = PHRASES[phrase];
        if (!deleting) {
          char++;
          setText(current.slice(0, char));
          if (char === current.length) {
            deleting = true;
            timer = window.setTimeout(step, 1700);
            return;
          }
          timer = window.setTimeout(step, 75);
        } else {
          char--;
          setText(current.slice(0, char));
          if (char === 0) {
            deleting = false;
            phrase = (phrase + 1) % PHRASES.length;
            timer = window.setTimeout(step, 350);
            return;
          }
          timer = window.setTimeout(step, 32);
        }
      };
      timer = window.setTimeout(step, 250);
      return () => window.clearTimeout(timer);
    };

    let cleanup: (() => void) | undefined;
    let fallback = 0;
    const layer = wrapRef.current?.closest("[data-swarm-layer]");
    if (layer && layer.classList.contains("swarm-hidden")) {
      const obs = new MutationObserver(() => {
        if (!layer.classList.contains("swarm-hidden")) {
          cleanup = start();
          obs.disconnect();
        }
      });
      obs.observe(layer, { attributes: true, attributeFilter: ["class"] });
      cleanup = () => obs.disconnect();
      // Safety net: never wait forever.
      fallback = window.setTimeout(() => {
        cleanup = start();
      }, 7000);
    } else {
      cleanup = start();
    }
    return () => {
      cleanup?.();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <span ref={wrapRef} className="mt-2 block text-3xl text-accent sm:text-4xl" aria-live="polite">
      {text}
      <span className="type-cursor ml-0.5 inline-block h-[1em] w-[3px] translate-y-[0.15em] bg-accent" aria-hidden="true" />
    </span>
  );
}
