"use client";

import { useEffect, useRef, useState, useCallback, useId } from "react";
import { Search, ArrowRight, Download, Mail, Github, Linkedin, GitPullRequest } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";
import { portfolioData } from "@/data/portfolio";

let _openPalette: (() => void) | null = null;
export function openCommandPalette() { _openPalette?.(); }

type Command = {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void | Promise<void>;
};

const commands: Command[] = [
  {
    id: "view-work",
    label: "View Projects",
    description: "Jump to the projects section",
    icon: <ArrowRight className="w-4 h-4" />,
    action: () => { document.getElementById("projects")?.scrollIntoView({ behavior: prefersReducedMotion() ? "instant" : "smooth" }); },
  },
  {
    id: "about",
    label: "About Me",
    description: "Jump to the about section",
    icon: <ArrowRight className="w-4 h-4" />,
    action: () => { document.getElementById("about")?.scrollIntoView({ behavior: prefersReducedMotion() ? "instant" : "smooth" }); },
  },
  {
    id: "skills",
    label: "Skills",
    description: "Jump to the skills section",
    icon: <ArrowRight className="w-4 h-4" />,
    action: () => { document.getElementById("skills")?.scrollIntoView({ behavior: prefersReducedMotion() ? "instant" : "smooth" }); },
  },
  {
    id: "experience",
    label: "Experience",
    description: "Jump to the experience section",
    icon: <ArrowRight className="w-4 h-4" />,
    action: () => { document.getElementById("experience")?.scrollIntoView({ behavior: prefersReducedMotion() ? "instant" : "smooth" }); },
  },
  {
    id: "contributions",
    label: "Open Source Contributions",
    description: "Jump to Codenotch contributions",
    icon: <GitPullRequest className="w-4 h-4" />,
    action: () => { document.getElementById("contributions")?.scrollIntoView({ behavior: prefersReducedMotion() ? "instant" : "smooth" }); },
  },
  {
    id: "contact",
    label: "Contact",
    description: "Jump to the contact section",
    icon: <Mail className="w-4 h-4" />,
    action: () => { document.getElementById("contact")?.scrollIntoView({ behavior: prefersReducedMotion() ? "instant" : "smooth" }); },
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
    action: () => navigator.clipboard.writeText(portfolioData.personal.email),
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
  const [error, setError] = useState("");
  const listId = useId();
  const commandRun = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = normalizedQuery
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(normalizedQuery) ||
          c.description?.toLowerCase().includes(normalizedQuery)
      )
    : commands;

  const close = useCallback(() => {
    commandRun.current += 1;
    setOpen(false);
    setQuery("");
    setSelected(0);
  }, []);

  const openPalette = useCallback(() => {
    commandRun.current += 1;
    setSelected(0);
    setError("");
    setOpen(true);
  }, []);

  const run = useCallback((cmd: Command) => {
    const currentRun = ++commandRun.current;
    setError("");
    try {
      const result = cmd.action();
      if (result) {
        void result.then(() => {
          if (commandRun.current === currentRun) close();
        }).catch(() => {
          if (commandRun.current === currentRun) setError("Unable to complete this command. Please try again.");
        });
      } else {
        close();
      }
    } catch {
      setError("Unable to complete this command. Please try again.");
    }
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
    return () => {
      _openPalette = null;
      commandRun.current += 1;
    };
  }, [openPalette]);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement;
    inputRef.current?.focus();
    const keepFocus = (event: FocusEvent) => {
      if (event.target !== inputRef.current) inputRef.current?.focus();
    };
    document.addEventListener("focusin", keepFocus);
    return () => {
      document.removeEventListener("focusin", keepFocus);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    itemRefs.current[selected]?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.max(0, Math.min(s + 1, filtered.length - 1)));
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
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      data-lenis-prevent
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
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-controls={listId}
            aria-activedescendant={filtered[selected] ? `${listId}-${filtered[selected].id}` : undefined}
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

        <p role="status" className="px-4 font-mono text-sm text-red-400">{error}</p>
        <ul id={listId} aria-label="Commands" className="max-h-72 overflow-y-auto py-2" role="listbox">
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
              id={`${listId}-${cmd.id}`}
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
