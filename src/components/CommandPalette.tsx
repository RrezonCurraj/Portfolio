"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Search, ArrowRight, Download, Mail, Github, Linkedin } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

let _openPalette: (() => void) | null = null;
export function openCommandPalette() { _openPalette?.(); }

type Command = {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
};

const commands: Command[] = [
  {
    id: "view-work",
    label: "View Projects",
    description: "Jump to the projects section",
    icon: <ArrowRight className="w-4 h-4" />,
    action: () => { document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }); },
  },
  {
    id: "about",
    label: "About Me",
    description: "Jump to the about section",
    icon: <ArrowRight className="w-4 h-4" />,
    action: () => { document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); },
  },
  {
    id: "skills",
    label: "Skills",
    description: "Jump to the skills section",
    icon: <ArrowRight className="w-4 h-4" />,
    action: () => { document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" }); },
  },
  {
    id: "experience",
    label: "Experience",
    description: "Jump to the experience section",
    icon: <ArrowRight className="w-4 h-4" />,
    action: () => { document.getElementById("experience")?.scrollIntoView({ behavior: "smooth" }); },
  },
  {
    id: "contact",
    label: "Contact",
    description: "Jump to the contact section",
    icon: <Mail className="w-4 h-4" />,
    action: () => { document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); },
  },
  {
    id: "download-cv",
    label: "Download CV",
    description: "Download Rrezon Curraj's CV as PDF",
    icon: <Download className="w-4 h-4" />,
    action: () => {
      const a = document.createElement("a");
      a.href = "/Rrezon_Curraj_CV.pdf";
      a.download = "Rrezon_Curraj_CV.pdf";
      a.click();
    },
  },
  {
    id: "copy-email",
    label: "Copy Email",
    description: portfolioData.personal.email,
    icon: <Mail className="w-4 h-4" />,
    action: () => { navigator.clipboard.writeText(portfolioData.personal.email); },
  },
  {
    id: "github",
    label: "GitHub",
    description: "Open GitHub profile in new tab",
    icon: <Github className="w-4 h-4" />,
    action: () => { window.open(portfolioData.personal.github, "_blank", "noopener,noreferrer"); },
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    description: "Open LinkedIn profile in new tab",
    icon: <Linkedin className="w-4 h-4" />,
    action: () => { window.open(portfolioData.personal.linkedin, "_blank", "noopener,noreferrer"); },
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const filtered = query.trim()
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description?.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelected(0);
  }, []);

  const openPalette = useCallback(() => {
    setSelected(0);
    setOpen(true);
  }, []);

  const run = useCallback((cmd: Command) => {
    close();
    setTimeout(() => cmd.action(), 50);
  }, [close]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) close();
        else openPalette();
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close, open, openPalette]);

  useEffect(() => {
    _openPalette = openPalette;
    return () => { _openPalette = null; };
  }, [openPalette]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    itemRefs.current[selected]?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && filtered[selected]) {
      run(filtered[selected]);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh] px-4 bg-black/50 backdrop-blur-sm"
      onClick={close}
      onWheel={(e) => e.stopPropagation()}
    >
      <div
        className="w-full max-w-xl overflow-hidden border-2 border-primary bg-background shadow-[8px_8px_0_0_rgba(34,197,94,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b-2 border-border px-4 py-3">
          <Search className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-soft"
            aria-label="Command palette search"
          />
          <kbd className="hidden border border-border-strong px-1.5 py-0.5 font-mono text-[10px] text-muted-soft sm:inline">ESC</kbd>
        </div>

        <ul className="max-h-72 overflow-y-auto py-2" role="listbox">
          {filtered.length === 0 && (
            <li className="px-4 py-3 font-mono text-sm text-muted-soft">No commands found.</li>
          )}
          {filtered.map((cmd, i) => (
            <li
              key={cmd.id}
              ref={(el) => {
                itemRefs.current[i] = el;
                if (i === filtered.length - 1) itemRefs.current.length = filtered.length;
              }}
              role="option"
              aria-selected={i === selected}
              onMouseEnter={() => setSelected(i)}
              onClick={() => run(cmd)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                i === selected
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-strong hover:bg-foreground/5"
              }`}
            >
              <span className={i === selected ? "text-accent-foreground" : "text-primary"}>
                {cmd.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm font-bold uppercase tracking-wider">{cmd.label}</div>
                {cmd.description && (
                  <div className={`truncate text-xs ${i === selected ? "text-accent-foreground/70" : "text-muted-soft"}`}>
                    {cmd.description}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 border-t-2 border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-soft">
          <span><kbd className="border border-border-strong px-1">↑↓</kbd> navigate</span>
          <span><kbd className="border border-border-strong px-1">↵</kbd> run</span>
          <span className="ml-auto"><kbd className="border border-border-strong px-1">⌘K</kbd> toggle</span>
        </div>
      </div>
    </div>
  );
}
