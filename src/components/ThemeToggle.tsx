"use client";

import { Moon, Sun } from "lucide-react";
import { useMode } from "@/components/Providers";

export function ThemeToggle() {
  const { theme, toggleTheme } = useMode();
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
      className="fixed bottom-4 left-4 z-[120] inline-flex items-center gap-2 border-2 border-control bg-surface px-3 py-2 font-mono text-[10px] font-black uppercase tracking-[0.16em] text-foreground shadow-[4px_4px_0_var(--color-accent)] transition-all hover:-translate-y-1 hover:translate-x-1 hover:bg-accent hover:text-accent-foreground hover:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {theme === "dark" ? (
        <Sun className="size-4" aria-hidden="true" />
      ) : (
        <Moon className="size-4" aria-hidden="true" />
      )}
      <span className="hidden sm:inline">{nextTheme} mode</span>
    </button>
  );
}
