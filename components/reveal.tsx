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
 * fades up the first time it enters the viewport. `prefers-reduced-motion`
 * is handled in globals.css.
 *
 * All instances share ONE IntersectionObserver (registered lazily) rather
 * than one per component — cheaper on a long page with many reveals.
 */

type Cb = () => void;

let sharedObserver: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, Cb>();

function observe(el: Element, cb: Cb) {
  if (typeof IntersectionObserver === "undefined") {
    cb();
    return () => {};
  }
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const fn = callbacks.get(e.target);
            if (fn) {
              fn();
              callbacks.delete(e.target);
              sharedObserver!.unobserve(e.target);
            }
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
  }
  callbacks.set(el, cb);
  sharedObserver.observe(el);
  return () => {
    callbacks.delete(el);
    sharedObserver?.unobserve(el);
  };
}

export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  variant = "up",
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  /** Stagger, in ms. */
  delay?: number;
  variant?: "up" | "image";
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    return observe(el, () => setShown(true));
  }, [shown]);

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
