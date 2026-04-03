"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ModeContextType {
  isRecruiterMode: boolean;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [isRecruiterMode, setIsRecruiterMode] = useState(false);

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

  return (
    <ModeContext.Provider value={{ isRecruiterMode, toggleMode }}>
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
