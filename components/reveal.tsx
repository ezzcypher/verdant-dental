"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/**
 * Reveal-on-scroll wrapper.
 *
 * SSR / no-JS: children render fully visible (the `.reveal` class is inert
 * until `<html class="js">` is set). With JS + motion allowed, the element
 * starts hidden and fades up the first time it enters the viewport.
 * `prefers-reduced-motion` is handled in globals.css.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  variant = "up",
  className = "",
  amount = 0.15,
}: {
  children: ReactNode;
  as?: ElementType;
  /** Stagger, in ms. */
  delay?: number;
  variant?: "up" | "image";
  className?: string;
  /** IntersectionObserver threshold. */
  amount?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: amount, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown, amount]);

  const base = variant === "image" ? "reveal-img" : "reveal";

  return (
    <Tag
      ref={ref as never}
      className={`${base}${shown ? " is-visible" : ""} ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
