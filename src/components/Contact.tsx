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
    <section id="contact" className="w-full flex flex-col items-center bg-[#0f172a] text-center px-4 md:px-12 pt-16 md:pt-32 pb-24 md:pb-40 relative overflow-x-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] pointer-events-none opacity-20"
        style={{ background: "radial-gradient(ellipse, var(--color-primary) 0%, transparent 60%)" }}
      />

      <div className="w-full max-w-[1400px] mx-auto z-10">
        <div className="mb-8 md:mb-12 relative">
          <TextReveal activeColor="var(--color-primary)" className="text-5xl sm:text-8xl md:text-[12rem] font-black uppercase tracking-tighter md:whitespace-nowrap text-[#f8fafc] leading-none mx-auto drop-shadow-xl">
            INITIATE
          </TextReveal>
          <div className="text-4xl sm:text-7xl md:text-[9rem] font-mono italic text-[#f8fafc] opacity-50 -mt-4 md:-mt-16 tracking-tighter">
            Contact
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-left mb-16">
          {form.status === "sent" ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 border-2 border-[var(--color-primary)] bg-[#1e293b]">
              <CheckCircle className="w-12 h-12 text-[var(--color-primary)]" />
              <p className="font-mono text-lg text-[var(--color-primary)] uppercase tracking-widest">Signal received.</p>
              <p className="font-mono text-sm text-zinc-400">I'll get back to you within 24 hours.</p>
              <button
                onClick={() => setForm({ status: "idle" })}
                className="mt-4 font-mono text-xs uppercase tracking-widest text-zinc-500 hover:text-white transition-colors underline"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-live="polite">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="name" className="font-mono text-xs uppercase tracking-widest text-zinc-400">
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
                    className="bg-[#1e293b] border-2 border-white/10 text-white font-mono text-sm px-4 py-3 placeholder:text-zinc-600 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-zinc-400">
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
                    className="bg-[#1e293b] border-2 border-white/10 text-white font-mono text-sm px-4 py-3 placeholder:text-zinc-600 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="message" className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  placeholder="Tell me about your project..."
                  className="bg-[#1e293b] border-2 border-white/10 text-white font-mono text-sm px-4 py-3 placeholder:text-zinc-600 focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none"
                />
              </div>

              {form.status === "error" && (
                <div className="flex items-center gap-2 text-red-400 font-mono text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{form.errorMsg ?? "Failed to send. Try emailing me directly."}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <a
                  href={`mailto:${portfolioData.personal.email}`}
                  className="font-mono text-xs text-zinc-500 hover:text-[var(--color-primary)] transition-colors"
                >
                  or: {portfolioData.personal.email}
                </a>
                <button
                  type="submit"
                  disabled={form.status === "sending"}
                  className="w-full sm:w-auto justify-center bg-[var(--color-primary)] text-[#0f172a] px-8 py-4 font-black font-mono uppercase tracking-widest text-sm border-2 border-[var(--color-primary)] hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-4px_4px_0_0_rgba(248,250,252,1)] active:translate-y-0 active:translate-x-0 active:shadow-none transition-all duration-200 flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
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
            className="p-4 border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:text-[#0f172a] hover:bg-[var(--color-primary)] hover:-translate-y-2 transition-all bg-[#1e293b] shadow-[4px_4px_0_0_rgba(34,197,94,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
          >
            <Github className="w-8 h-8 md:w-10 md:h-10" aria-hidden="true" />
          </a>
          <a
            href={portfolioData.personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile (opens in new tab)"
            className="p-4 border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:text-[#0f172a] hover:bg-[var(--color-primary)] hover:-translate-y-2 transition-all bg-[#1e293b] shadow-[4px_4px_0_0_rgba(34,197,94,1)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]"
          >
            <Linkedin className="w-8 h-8 md:w-10 md:h-10" aria-hidden="true" />
          </a>
        </div>
      </div>

      <footer className="md:absolute md:bottom-8 w-full flex justify-between px-4 md:px-12 mt-12 md:mt-0 text-zinc-500 font-mono text-xs uppercase tracking-widest">
        <span>© {new Date().getFullYear()} RREZON_CURRAJ</span>
        <span className="hidden md:inline">SYSTEM: ONLINE</span>
      </footer>
    </section>
  );
}
