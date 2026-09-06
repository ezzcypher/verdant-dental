"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { MessageCircle, X, Send, Check, Phone } from "lucide-react";

import { cn } from "@/lib/utils";
import { CHAT_QUICK_ACTIONS, CLINIC } from "@/components/site-data";

/**
 * Floating AI receptionist. Talks to POST /api/chat, which persists the whole
 * conversation server-side — this component only holds what is needed to render.
 *
 * The session id is kept in sessionStorage so a page navigation continues the
 * same conversation, but closing the tab starts fresh (no long-lived tracking).
 */

interface Booking {
  reference: string;
  treatment: string;
  preferredDate: string | null;
  preferredTime: string | null;
}

interface Bubble {
  role: "user" | "assistant";
  content: string;
  urgent?: boolean;
  booking?: Booking | null;
}

const SESSION_KEY = "vd-chat-session";

const GREETING =
  "Hi! I'm the Verdant reception assistant. I can help you book an appointment, find a service, or answer questions about new patients, insurance and the office. How can I help?";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Keep the transcript pinned to the newest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [bubbles, busy]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;

    setInput("");
    setError(null);
    setBubbles((b) => [...b, { role: "user", content: message }]);
    setBusy(true);

    let sessionId: string | null = null;
    try {
      sessionId = sessionStorage.getItem(SESSION_KEY);
    } catch {
      /* private mode — just start a fresh session each turn */
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, ...(sessionId ? { sessionId } : {}) }),
      });

      const data = (await res.json().catch(() => null)) as
        | { sessionId?: string; reply?: string; booking?: Booking | null; urgent?: boolean; error?: string }
        | null;

      if (!res.ok || !data?.reply) {
        setError(data?.error ?? "I couldn't reach the clinic system. Please try again.");
        return;
      }

      if (data.sessionId) {
        try {
          sessionStorage.setItem(SESSION_KEY, data.sessionId);
        } catch {
          /* ignore */
        }
      }

      setBubbles((b) => [
        ...b,
        {
          role: "assistant",
          content: data.reply!,
          urgent: data.urgent,
          booking: data.booking ?? null,
        },
      ]);
    } catch {
      setError(`Connection lost. Please try again, or call us on ${CLINIC.phone}.`);
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void send(input);
  }

  return (
    <>
      {/* Launcher — a single round button that also closes the panel, so it is
          always reachable even when the panel is full-screen on a phone. */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="vd-chat-panel"
        aria-label={open ? "Close the chat" : "Chat with our receptionist"}
        className={cn(
          "fixed right-4 z-[70] flex h-14 w-14 items-center justify-center rounded-full",
          // Sits above the sticky mobile action bar on phones.
          "bottom-24 lg:bottom-5",
          "bg-primary text-primary-foreground shadow-[0_12px_40px_-8px_rgba(20,20,25,0.45)]",
          "transition-transform duration-200 hover:scale-105 focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2",
        )}
      >
        {open ? (
          <X className="h-6 w-6" strokeWidth={1.9} />
        ) : (
          <MessageCircle className="h-6 w-6" strokeWidth={1.8} />
        )}
      </button>

      {/* Panel — conditionally rendered, never just `hidden`. The hidden
          attribute is a UA-stylesheet `display:none`, which any author
          `display:flex` overrides, so the panel would sit permanently open. */}
      {open && (
      <div
        id="vd-chat-panel"
        ref={panelRef}
        role="dialog"
        aria-label="Chat with the Verdant receptionist"
        aria-modal="false"
        className={cn(
          "fixed z-[75] flex flex-col overflow-hidden border border-border bg-card shadow-2xl",
          "animate-fade-up",
          // Mobile: a full-screen sheet that covers the launcher and the sticky bar.
          "inset-0 rounded-none",
          // Desktop: a floating panel above the launcher.
          "sm:inset-auto sm:bottom-6 sm:right-5 sm:h-[min(620px,calc(100dvh-7rem))] sm:w-[min(400px,calc(100vw-2.5rem))] sm:rounded-2xl",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-background px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
              <MessageCircle className="h-4 w-4" strokeWidth={1.8} />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
            </span>
            <div>
              <p className="font-display text-[15px] font-medium tracking-tightest text-foreground">
                Verdant reception
              </p>
              <p className="text-[11px] text-muted-foreground">Typically replies instantly</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close the chat"
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Transcript */}
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {bubbles.map((b, i) => (
            <div key={i} className={cn("flex", b.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[14.5px] leading-relaxed",
                  b.role === "user"
                    ? "rounded-br-sm bg-foreground text-background"
                    : "rounded-bl-sm bg-secondary text-foreground",
                  b.urgent && "border border-red-300 bg-red-50 text-red-900",
                )}
              >
                {b.content}
                {b.booking && (
                  <span className="mt-3 flex items-center gap-2 rounded-xl bg-primary/15 px-3 py-2 text-[12px] font-medium text-foreground">
                    <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                    Reference {b.booking.reference} · {b.booking.treatment}
                  </span>
                )}
              </div>
            </div>
          ))}

          {busy && (
            <div className="flex justify-start">
              <div className="flex gap-1.5 rounded-2xl rounded-bl-sm bg-secondary px-4 py-3.5">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                    style={{ animationDelay: `${d * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-[13px] text-red-700">{error}</p>
          )}

          {bubbles.length === 1 && !busy && (
            <div className="pt-1">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Quick options
              </p>
              <div className="flex flex-col gap-2">
                {CHAT_QUICK_ACTIONS.map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    onClick={() => void send(a.message)}
                    className="flex items-center justify-between rounded-xl border border-border bg-background px-3.5 py-2.5 text-left text-[13px] font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    {a.label}
                    <Send className="h-3.5 w-3.5 shrink-0 opacity-40" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        <form onSubmit={onSubmit} className="border-t border-border bg-background px-3 py-3">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about treatments, prices or booking…"
              maxLength={2000}
              disabled={busy}
              aria-label="Your message"
              className="h-11 flex-1 rounded-full border border-border bg-card px-4 text-[14.5px] text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
            >
              <Send className="h-4 w-4" strokeWidth={1.9} />
            </button>
          </div>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[10.5px] text-muted-foreground">
            <Phone className="h-3 w-3 shrink-0" />
            Urgent? Call {CLINIC.phone} · demo assistant, not medical advice
          </p>
        </form>
      </div>
      )}
    </>
  );
}
