"use client";

import { useState } from "react";
import { portfolioData } from "@/data/portfolio";
import { Linkedin, Github, Send, CheckCircle, AlertCircle } from "lucide-react";
import { TextReveal } from "@/components/ui/TextReveal";

type Status = "idle" | "sending" | "sent" | "error";
type FormState = { status: Status; errorMsg?: string };

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<FormState>({ status: "idle" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForm({ status: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setForm({ status: "error", errorMsg: data.error });
        return;
      }
      setForm({ status: "sent" });
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setForm({ status: "error", errorMsg: "Network error. Try emailing directly." });
    }
  };

  return (
    <section id="contact" className="relative flex w-full flex-col items-center overflow-x-hidden bg-background px-4 pt-16 pb-24 text-center md:px-12 md:pt-32 md:pb-40">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] pointer-events-none opacity-20"
        style={{ background: "radial-gradient(ellipse, var(--color-accent) 0%, transparent 60%)" }}
      />

      <div className="w-full max-w-[1400px] mx-auto z-10">
        <div className="mb-8 md:mb-12 relative">
          <TextReveal activeColor="var(--color-primary)" className="mx-auto text-5xl font-black leading-none tracking-tighter text-foreground uppercase drop-shadow-xl sm:text-8xl md:text-[12rem] md:whitespace-nowrap">
            INITIATE
          </TextReveal>
          <div className="-mt-4 font-mono text-4xl tracking-tighter text-foreground opacity-50 italic sm:text-7xl md:-mt-16 md:text-[9rem]">
            Contact
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-left mb-16">
          {form.status === "sent" ? (
            <div className="flex flex-col items-center justify-center gap-4 border-2 border-primary bg-surface py-16">
              <CheckCircle className="w-12 h-12 text-[var(--color-primary)]" />
              <p className="font-mono text-lg text-[var(--color-primary)] uppercase tracking-widest">Signal received.</p>
              <p className="font-mono text-sm text-muted">I&apos;ll get back to you within 24 hours.</p>
              <button
                onClick={() => setForm({ status: "idle" })}
                className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-soft underline transition-colors hover:text-foreground"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="name" className="font-mono text-xs uppercase tracking-widest text-muted">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className="border-2 border-border bg-surface px-4 py-3 font-mono text-sm text-foreground transition-colors placeholder:text-muted-soft focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-muted">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="your@email.com"
                    className="border-2 border-border bg-surface px-4 py-3 font-mono text-sm text-foreground transition-colors placeholder:text-muted-soft focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="message" className="font-mono text-xs uppercase tracking-widest text-muted">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  placeholder="Tell me about your project..."
                  className="resize-none border-2 border-border bg-surface px-4 py-3 font-mono text-sm text-foreground transition-colors placeholder:text-muted-soft focus:border-primary focus:outline-none"
                />
              </div>

              <div aria-live="polite" aria-atomic="true">
                {form.status === "error" && (
                  <div className="flex items-center gap-2 text-red-400 font-mono text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{form.errorMsg ?? "Failed to send. Try emailing me directly."}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <a
                  href={`mailto:${portfolioData.personal.email}`}
                  className="font-mono text-xs text-muted-soft transition-colors hover:text-primary"
                >
                  or: {portfolioData.personal.email}
                </a>
                <button
                  type="submit"
                  disabled={form.status === "sending"}
                  className="flex w-full items-center justify-center gap-3 border-2 border-control bg-accent px-8 py-4 font-mono text-sm font-black uppercase tracking-widest text-accent-foreground transition-all duration-200 hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-4px_4px_0_0_var(--color-foreground)] active:translate-x-0 active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:transform-none disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-foreground sm:w-auto"
                >
                  {form.status === "sending" ? "Sending..." : "Send Message"}
                  <Send className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="flex justify-center gap-8 mb-8">
          <a
            href={portfolioData.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile (opens in new tab)"
            className="border-2 border-primary bg-surface p-4 text-primary shadow-[4px_4px_0_0_var(--color-accent)] transition-all hover:-translate-y-2 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Github className="w-8 h-8 md:w-10 md:h-10" aria-hidden="true" />
          </a>
          <a
            href={portfolioData.personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile (opens in new tab)"
            className="border-2 border-primary bg-surface p-4 text-primary shadow-[4px_4px_0_0_var(--color-accent)] transition-all hover:-translate-y-2 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Linkedin className="w-8 h-8 md:w-10 md:h-10" aria-hidden="true" />
          </a>
        </div>
      </div>

      <footer className="mt-12 flex w-full justify-between px-4 font-mono text-xs uppercase tracking-widest text-muted-soft md:absolute md:bottom-8 md:mt-0 md:px-12">
        <span>© {new Date().getFullYear()} RREZON_CURRAJ</span>
        <span className="hidden md:inline">SYSTEM: ONLINE</span>
      </footer>
    </section>
  );
}
