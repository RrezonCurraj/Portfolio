"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Search, ArrowRight, Download, Mail, Github, Linkedin } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

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
  const listRef = useRef<HTMLUListElement>(null);
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

  const run = useCallback((cmd: Command) => {
    close();
    setTimeout(() => cmd.action(), 50);
  }, [close]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  useEffect(() => {
    if (open) {
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => { setSelected(0); }, [query]);

  // Scroll selected item into view when navigating with keyboard
  useEffect(() => {
    itemRefs.current[selected]?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  // Lock page scroll while palette is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
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
        className="w-full max-w-xl bg-[#0f172a] border-2 border-[var(--color-primary)] shadow-[8px_8px_0_0_rgba(34,197,94,0.3)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-white/10">
          <Search className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent text-white font-mono text-sm placeholder:text-zinc-500 outline-none"
            aria-label="Command palette search"
          />
          <kbd className="hidden sm:inline font-mono text-[10px] text-zinc-500 border border-zinc-700 px-1.5 py-0.5">ESC</kbd>
        </div>

        <ul ref={listRef} className="max-h-72 overflow-y-auto py-2" role="listbox">
          {filtered.length === 0 && (
            <li className="px-4 py-3 text-zinc-500 font-mono text-sm">No commands found.</li>
          )}
          {filtered.map((cmd, i) => (
            <li
              key={cmd.id}
              ref={(el) => { itemRefs.current[i] = el; }}
              role="option"
              aria-selected={i === selected}
              onMouseEnter={() => setSelected(i)}
              onClick={() => run(cmd)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                i === selected
                  ? "bg-[var(--color-primary)] text-[#0f172a]"
                  : "text-zinc-300 hover:bg-white/5"
              }`}
            >
              <span className={i === selected ? "text-[#0f172a]" : "text-[var(--color-primary)]"}>
                {cmd.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-sm font-bold uppercase tracking-wider">{cmd.label}</div>
                {cmd.description && (
                  <div className={`text-xs truncate ${i === selected ? "text-[#0f172a]/70" : "text-zinc-500"}`}>
                    {cmd.description}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="border-t-2 border-white/10 px-4 py-2 flex items-center gap-4 text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
          <span><kbd className="border border-zinc-700 px-1">↑↓</kbd> navigate</span>
          <span><kbd className="border border-zinc-700 px-1">↵</kbd> run</span>
          <span className="ml-auto"><kbd className="border border-zinc-700 px-1">⌘K</kbd> toggle</span>
        </div>
      </div>
    </div>
  );
}
