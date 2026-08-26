"use client";

import { createContext, useContext, useState, useSyncExternalStore, ReactNode } from "react";

type Theme = "light" | "dark";

interface ModeContextType {
  isRecruiterMode: boolean;
  toggleMode: () => void;
  theme: Theme;
  toggleTheme: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);
const themeListeners = new Set<() => void>();

function subscribeToTheme(listener: () => void) {
  themeListeners.add(listener);
  return () => {
    themeListeners.delete(listener);
  };
}

function getTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch {
    // The theme still works for this visit if storage is unavailable.
  }
  themeListeners.forEach((listener) => listener());
}

export function ModeProvider({ children }: { children: ReactNode }) {
  const [isRecruiterMode, setIsRecruiterMode] = useState(false);
  const theme = useSyncExternalStore<Theme>(subscribeToTheme, getTheme, () => "dark");

  const toggleMode = () => {
    setIsRecruiterMode((prev) => {
      // Small visual feedback when toggling
      if (!prev) {
        document.documentElement.classList.add("recruiter-mode");
      } else {
        document.documentElement.classList.remove("recruiter-mode");
      }
      return !prev;
    });
  };

  const toggleTheme = () => applyTheme(theme === "dark" ? "light" : "dark");

  return (
    <ModeContext.Provider value={{ isRecruiterMode, toggleMode, theme, toggleTheme }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return context;
}
