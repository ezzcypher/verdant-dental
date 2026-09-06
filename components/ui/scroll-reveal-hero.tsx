"use client";

import { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────
// SCROLL-REVEAL HERO — locked scroll-scrub, image sequence
//
// Adapted from ./scroll-locked-video-hero.tsx. Same idea — the page
// is pinned (body position:fixed, the bulletproof technique) and
// wheel / touch / key input is captured to drive a normalised
// `progress` value forward and backward. Instead of scrubbing one
// video's currentTime, `progress` cross-dissolves through a set of
// stills. When the sequence reaches the end and the visitor keeps
// pushing down, the lock releases and the page scrolls on normally;
// scrolling back to the very top re-locks and plays the reveal in
// reverse. Honours prefers-reduced-motion (no lock, last frame shown)
// and ships a visible "Skip intro" control for keyboard users.
// ─────────────────────────────────────────────────────────────

export interface ScrollRevealHeroProps {
  images: string[];
  /** Big brand word shown first, then blurred out as the reveal starts. */
  title?: string;
  /** Resolves into focus as the reveal completes. */
  tagline?: string;
  scrollHint?: string;
  /** Input distance (px) to scrub the whole sequence. Higher = slower. */
  scrubDistance?: number;
  /** Accent used for the progress bar + hint. */
  accent?: string;
  /** CSS selector the "Skip intro" control scrolls to (defaults to the next sibling). */
  skipTo?: string;
  /** object-position for the background image(s). */
  objectPosition?: string;
  className?: string;
}

const SCRIM =
  "linear-gradient(180deg, rgba(8,8,10,0.52), rgba(8,8,10,0.08) 24%, rgba(8,8,10,0.08) 60%, rgba(8,8,10,0.66))";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export default function ScrollRevealHero({
  images,
  title = "VERDANT",
  tagline = "Every detail considered. Every visit calm.",
  scrollHint = "SCROLL",
  scrubDistance = 2600,
  accent = "#98BF0A",
  skipTo,
  objectPosition = "center",
  className,
}: ScrollRevealHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const releaseRef = useRef<(() => void) | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setReduced(true);
      return;
    }

    const n = Math.max(images.length, 1);
    const span = n > 1 ? 1 / (n - 1) : 1;

    let rafId = 0;
    let target = 0;
    let current = 0;
    let started = false;
    let locked = false;
    let lockedScrollY = 0;
    let touchStartY = 0;

    function engageLock() {
      if (locked || typeof document === "undefined") return;
      locked = true;
      lockedScrollY = window.scrollY;
      const b = document.body.style;
      b.position = "fixed";
      b.top = `-${lockedScrollY}px`;
      b.left = "0";
      b.right = "0";
      b.width = "100%";
    }

    function releaseLock() {
      if (!locked || typeof document === "undefined") return;
      locked = false;
      const y = lockedScrollY;
      const b = document.body.style;
      b.position = "";
      b.top = "";
      b.left = "";
      b.right = "";
      b.width = "";
      window.scrollTo(0, y);
      try {
        sessionStorage.setItem("vd-intro-seen", "1");
      } catch {}
    }

    // Play the locked reveal once per session; on later navigations start released.
    let seen = false;
    try {
      seen = sessionStorage.getItem("vd-intro-seen") === "1";
    } catch {}

    if (!seen && window.scrollY < 4) engageLock();
    else {
      target = 1;
      current = 1;
      started = true;
    }

    releaseRef.current = releaseLock;

    function addDelta(deltaY: number) {
      if (!locked) {
        // Released, but back at the very top and pushing up → re-lock at the end
        // of the sequence so the reveal plays in reverse.
        if (deltaY < 0 && window.scrollY <= 0) {
          engageLock();
          target = 1;
          current = 1;
          return true;
        }
        return false;
      }
      // At the end and still pushing forward → hand control back to the page.
      if (deltaY > 0 && target > 0.999) {
        releaseLock();
        window.scrollBy(0, Math.max(deltaY, 24));
        return false;
      }
      target = clamp(target + deltaY / scrubDistance, 0, 1);
      if (target > 0.002) started = true;
      return true;
    }

    const onWheel = (e: WheelEvent) => {
      if (addDelta(e.deltaY)) e.preventDefault();
    };
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchStartY;
      const deltaY = touchStartY - y;
      touchStartY = y;
      if (addDelta(deltaY)) e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      if (!locked) return;
      const step = scrubDistance * 0.16;
      const map: Record<string, number> = {
        ArrowDown: step,
        PageDown: step * 2.2,
        " ": step * 2.2,
        ArrowUp: -step,
        PageUp: -step * 2.2,
        Home: -scrubDistance,
        End: scrubDistance,
      };
      if (e.key in map) {
        if (addDelta(map[e.key])) e.preventDefault();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);

    function frame() {
      current += (target - current) * 0.16;
      const p = current;

      for (let i = 0; i < n; i++) {
        const el = imgRefs.current[i];
        if (!el) continue;
        const d = Math.abs(p - i * span);
        // A lone frame must stay fully opaque (there is nothing to cross-dissolve
        // into) — otherwise a single-image hero fades to black as you scrub.
        const o = n === 1 ? 1 : clamp(1 - d / span, 0, 1);
        el.style.opacity = String(o);
        el.style.transform = `scale(${(1.09 - o * 0.09).toFixed(4)}) translateY(${((1 - o) * 6).toFixed(2)}px)`;
      }

      if (titleRef.current) {
        const t = 1 - clamp(p / 0.32, 0, 1);
        titleRef.current.style.opacity = String(t);
        titleRef.current.style.transform = `translateY(${(1 - t) * -22}px) scale(${0.965 + t * 0.035})`;
        titleRef.current.style.filter = `blur(${(1 - t) * 12}px)`;
      }
      if (taglineRef.current) {
        const t = clamp((p - 0.8) / 0.2, 0, 1);
        taglineRef.current.style.opacity = String(t);
        taglineRef.current.style.transform = `translateY(${(1 - t) * 18}px)`;
        taglineRef.current.style.filter = `blur(${(1 - t) * 9}px)`;
      }
      if (hintRef.current) hintRef.current.style.opacity = started ? "0" : "0.8";
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;

      rafId = requestAnimationFrame(frame);
    }
    rafId = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(rafId);
      releaseLock();
      releaseRef.current = null;
    };
  }, [images, scrubDistance]);

  function skip() {
    // Release the scroll lock through the effect so its internal state stays
    // consistent; fall back to clearing styles directly (reduced-motion path).
    if (releaseRef.current) {
      releaseRef.current();
    } else {
      const b = document.body.style;
      b.position = "";
      b.top = "";
      b.left = "";
      b.right = "";
      b.width = "";
    }
    try {
      sessionStorage.setItem("vd-intro-seen", "1");
    } catch {}
    const target =
      (skipTo && (document.querySelector(skipTo) as HTMLElement | null)) ||
      (sectionRef.current?.closest("section")?.nextElementSibling as HTMLElement | null) ||
      (sectionRef.current?.nextElementSibling as HTMLElement | null);
    (target ?? document.body).scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{
        position: "relative",
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        background: "#0a0a0a",
      }}
    >
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src + i}
          ref={(el) => {
            imgRefs.current[i] = el;
          }}
          src={src}
          alt=""
          aria-hidden
          draggable={false}
          {...(i === 0
            ? { fetchPriority: "high" as const, loading: "eager" as const, decoding: "async" as const }
            : { loading: "lazy" as const, decoding: "async" as const })}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition,
            opacity: reduced ? (i === images.length - 1 ? 1 : 0) : i === 0 ? 1 : 0,
            transformOrigin: "center center",
            willChange: "opacity, transform",
          }}
        />
      ))}

      <div
        style={{ position: "absolute", inset: 0, background: SCRIM, pointerEvents: "none" }}
      />

      <div
        ref={titleRef}
        className="font-display"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 6%",
          textAlign: "center",
          pointerEvents: "none",
          opacity: reduced ? 0 : 1,
        }}
      >
        <span
          style={{
            fontWeight: 500,
            fontSize: "clamp(44px, 12vw, 168px)",
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            color: "#f6f6f4",
            textShadow: "0 6px 40px rgba(0,0,0,0.45)",
            willChange: "transform, filter, opacity",
          }}
        >
          {title}
        </span>
      </div>

      {tagline && (
        <div
          ref={taglineRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 10%",
            textAlign: "center",
            pointerEvents: "none",
            opacity: reduced ? 1 : 0,
            filter: reduced ? "none" : undefined,
          }}
        >
          <span
            style={{
              fontFamily:
                "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
              fontWeight: 400,
              fontSize: "clamp(16px, 2.6vw, 30px)",
              lineHeight: 1.35,
              letterSpacing: "-0.01em",
              color: "#f2f2f0",
              textShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
          >
            {tagline}
          </span>
        </div>
      )}

      <div
        ref={hintRef}
        style={{
          position: "absolute",
          left: "50%",
          bottom: "clamp(46px, 8vh, 84px)",
          transform: "translateX(-50%)",
          display: reduced ? "none" : "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          color: "rgba(246,246,244,0.85)",
          fontFamily: "var(--font-inter), system-ui, sans-serif",
          fontSize: "11px",
          fontWeight: 500,
          letterSpacing: "0.32em",
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      >
        <span>{scrollHint}</span>
        <svg width="13" height="17" viewBox="0 0 14 18" aria-hidden>
          <path
            d="M7 1 L7 17 M2 12 L7 17 L12 12"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <button
        type="button"
        onClick={skip}
        style={{
          position: "absolute",
          right: "clamp(16px, 4vw, 40px)",
          bottom: "clamp(20px, 4vw, 34px)",
          zIndex: 8,
          background: "rgba(255,255,255,0.14)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          border: "1px solid rgba(255,255,255,0.55)",
          color: "#ffffff",
          fontFamily: "var(--font-inter), system-ui, sans-serif",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          padding: "11px 20px",
          borderRadius: "999px",
          cursor: "pointer",
        }}
      >
        Skip intro
      </button>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 2,
          background: "rgba(255,255,255,0.14)",
        }}
      >
        <div
          ref={barRef}
          style={{
            height: "100%",
            width: "100%",
            background: accent,
            transform: `scaleX(${reduced ? 1 : 0})`,
            transformOrigin: "left center",
          }}
        />
      </div>
    </div>
  );
}
