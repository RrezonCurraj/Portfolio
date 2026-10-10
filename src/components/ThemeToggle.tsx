"use client";

import { Moon, Sun } from "lucide-react";
import { useMode } from "@/components/Providers";
import { portfolioCopy } from "@/data/portfolio";

export function ThemeToggle() {
  const { theme, toggleTheme } = useMode();
  const label =
    theme === "dark"
      ? portfolioCopy.header.lightTheme
      : portfolioCopy.header.darkTheme;
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="icon-button theme-toggle"
    >
      {theme === "dark" ? (
        <Sun size={17} aria-hidden="true" />
      ) : (
        <Moon size={17} aria-hidden="true" />
      )}
    </button>
  );
}
