"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");
  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || "dark");
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("raj-theme", next);
    } catch {
      /* ignore */
    }
    setTheme(next);
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted transition hover:border-accent hover:text-accent"
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
