"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV, CLINIC } from "@/components/site-data";
import { BookingDialog } from "@/components/booking-dialog";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = openMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openMenu]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        scrolled
          ? "border-b border-foreground/10 bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          "container-x flex items-center justify-between transition-[height] duration-300",
          scrolled ? "h-16" : "h-20",
        )}
      >
        <a
          href="#top"
          className={cn(
            "font-display text-xl font-medium tracking-tightest transition-colors",
            scrolled ? "text-foreground" : "text-white",
          )}
        >
          {CLINIC.name}
          <span className="text-primary">.</span>
        </a>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={cn(
                "text-[13px] font-medium tracking-wide transition-colors hover:text-primary",
                scrolled ? "text-foreground/70" : "text-white/80",
              )}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <BookingDialog label="Book now" size="sm" />
        </div>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpenMenu(true)}
          className={cn(
            "md:hidden",
            scrolled ? "text-foreground" : "text-white",
          )}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {openMenu && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background md:hidden">
          <div className="container-x flex h-20 items-center justify-between">
            <span className="font-display text-xl font-medium tracking-tightest">
              {CLINIC.name}
              <span className="text-primary">.</span>
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpenMenu(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="container-x mt-6 flex flex-col gap-2">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpenMenu(false)}
                className="border-b border-foreground/10 py-4 font-display text-2xl tracking-tightest"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="container-x mt-8">
            <BookingDialog label="Book a visit" className="w-full" />
          </div>
        </div>
      )}
    </header>
  );
}
