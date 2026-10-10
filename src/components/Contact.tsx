"use client";

import { useRef, useState } from "react";
import { portfolioCopy, portfolioData } from "@/data/portfolio";
import { ArrowUpRight, ArrowUp, Send, CheckCircle } from "lucide-react";
import { useMode } from "@/components/Providers";

import { contactLimits, validateContact } from "@/lib/contact";

type Status = "idle" | "sending" | "sent" | "error";
type FormState = { status: Status; errorMsg?: string };

export function Contact() {
  const copy = portfolioCopy.contact;
  const { toggleMode } = useMode();
  const submitting = useRef(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<FormState>({ status: "idle" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting.current) return;
    const result = validateContact({ name, email, message });
    if (result.error) {
      setForm({ status: "error", errorMsg: result.error });
      return;
    }
    submitting.current = true;
    setForm({ status: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const data = await res.json();
      if (!res.ok) {
        setForm({
          status: "error",
          errorMsg:
            typeof data?.error === "string" ? data.error : copy.deliveryError,
        });
        return;
      }
      setForm({ status: "sent" });
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setForm({
        status: "error",
        errorMsg: copy.networkError,
      });
    } finally {
      submitting.current = false;
    }
  };

  return (
    <section
      id="contact"
      className="section-shell content-section divided-section contact-section"
      aria-labelledby="contact-heading"
    >
      <div className="eyebrow">
        {copy.number} / {copy.title}
      </div>
      <h2 id="contact-heading" className="contact-heading">
        {copy.lines.map((line, index) => (
          <span key={line}>
            {line}
            {index === copy.lines.length - 1 && (
              <span className="accent-period">.</span>
            )}
          </span>
        ))}
      </h2>
      <div className="contact-grid">
        <div>
          <p className="contact-intro">{copy.intro}</p>
          <a
            href={`mailto:${portfolioData.personal.email}`}
            className="text-link contact-email"
          >
            {portfolioData.personal.email}
            <ArrowUpRight size={24} aria-hidden="true" />
          </a>
          <div className="contact-socials">
            <a
              href={portfolioData.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              {copy.github}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <a
              href={portfolioData.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              {copy.linkedin}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
        {form.status === "sent" ? (
          <div className="contact-success" role="status">
            <CheckCircle
              size={25}
              className="text-primary"
              aria-hidden="true"
            />
            <h3>{copy.success}</h3>
            <p>{copy.successNote}</p>
            <button
              type="button"
              onClick={() => setForm({ status: "idle" })}
              className="text-link"
            >
              {copy.another}
              <ArrowUpRight size={15} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="contact-form"
            aria-busy={form.status === "sending"}
          >
            <div className="contact-fields">
              <div className="form-field">
                <label htmlFor="contact-name">{copy.name}</label>
                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  maxLength={contactLimits.name}
                  autoComplete="name"
                  placeholder={copy.namePlaceholder}
                />
              </div>
              <div className="form-field">
                <label htmlFor="contact-email">{copy.email}</label>
                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  maxLength={contactLimits.email}
                  autoComplete="email"
                  placeholder={copy.emailPlaceholder}
                />
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="contact-message">{copy.message}</label>
              <textarea
                id="contact-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                required
                maxLength={contactLimits.message}
                rows={4}
                placeholder={copy.messagePlaceholder}
              />
            </div>
            <div aria-live="polite" aria-atomic="true">
              {form.status === "error" && (
                <p className="form-error">
                  {form.errorMsg ?? copy.deliveryError}
                </p>
              )}
            </div>
            <div className="form-actions">
              <span className="form-direct">
                {copy.direct}{" "}
                <a
                  href={`mailto:${portfolioData.personal.email}`}
                  className="underline underline-offset-4"
                >
                  {portfolioData.personal.email}
                </a>
              </span>
              <button
                type="submit"
                disabled={form.status === "sending"}
                className="send-button"
              >
                {form.status === "sending" ? copy.sending : copy.send}
                <Send size={15} aria-hidden="true" />
              </button>
            </div>
          </form>
        )}
      </div>
      <footer className="site-footer">
        <span>
          © {new Date().getFullYear()} {portfolioData.personal.name}
        </span>
        <div className="footer-actions">
          <button type="button" onClick={toggleMode} className="text-link">
            {portfolioCopy.header.resume}
          </button>
          <a href="#home" className="text-link">
            {copy.backToTop}
            <ArrowUp size={13} aria-hidden="true" />
          </a>
        </div>
      </footer>
    </section>
  );
}
