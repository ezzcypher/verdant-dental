"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV, CLINIC } from "@/components/site-data";
import { BookingDialog } from "@/components/booking-dialog";

export function SiteHeader() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(!overHero);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    if (!overHero) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero]);

  useEffect(() => {
    document.body.style.overflow = openMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openMenu]);

  const solid = scrolled || openMenu;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        solid
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          "container-x flex items-center justify-between transition-[height] duration-300",
          solid ? "h-16" : "h-20",
        )}
      >
        <Link
          href="/"
          className={cn(
            "font-display text-xl font-medium tracking-tight transition-colors",
            solid ? "text-foreground" : "text-white",
          )}
          aria-label="Verdant Dental — home"
        >
          {CLINIC.name}
          <span className="text-primary">.</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => {
            const active = n.href.startsWith("/") && !n.href.includes("#") && pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-[14px] font-medium tracking-wide transition-colors hover:text-primary",
                  active && "text-primary",
                  !active && (solid ? "text-foreground/75" : "text-white/85"),
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={CLINIC.phoneHref}
            className={cn(
              "flex items-center gap-1.5 text-[14px] font-medium transition-colors hover:text-primary",
              solid ? "text-foreground/75" : "text-white/85",
            )}
          >
            <Phone className="h-4 w-4" strokeWidth={1.8} />
            {CLINIC.phone}
          </a>
          <BookingDialog label="Book Appointment" size="sm" />
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <a
            href={CLINIC.phoneHref}
            aria-label={`Call the office at ${CLINIC.phone}`}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              solid ? "text-foreground" : "text-white",
            )}
          >
            <Phone className="h-5 w-5" strokeWidth={1.9} />
          </a>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={openMenu}
            onClick={() => setOpenMenu(true)}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              solid ? "text-foreground" : "text-white",
            )}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {openMenu && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="container-x flex h-16 items-center justify-between">
            <span className="font-display text-xl font-medium tracking-tight">
              {CLINIC.name}
              <span className="text-primary">.</span>
            </span>
            <button type="button" aria-label="Close menu" onClick={() => setOpenMenu(false)}>
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav aria-label="Primary" className="container-x mt-4 flex flex-col">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpenMenu(false)}
                className="border-b border-border py-4 font-display text-2xl tracking-tight"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="container-x mt-8 space-y-3">
            <div onClick={() => setOpenMenu(false)}>
              <BookingDialog label="Book Appointment" className="w-full" size="lg" />
            </div>
            <a
              href={CLINIC.phoneHref}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-foreground/20 text-[15px] font-medium"
            >
              <Phone className="h-4 w-4" strokeWidth={1.8} />
              Call {CLINIC.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
