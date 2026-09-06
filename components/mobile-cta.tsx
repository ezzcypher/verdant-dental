"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";

import { BookingDialog } from "@/components/booking-dialog";
import { CLINIC } from "@/components/site-data";

/**
 * Sticky bottom action bar on small screens: Book Appointment always within
 * thumb reach, plus a tap-to-call. Appears after the hero scrolls out of view
 * so it never covers the hero's own CTAs. Hidden on lg+.
 */
export function MobileCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.45);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={
        "fixed inset-x-0 bottom-0 z-[65] border-t border-border bg-background/95 backdrop-blur-md transition-transform duration-300 lg:hidden " +
        (show ? "translate-y-0" : "translate-y-full")
      }
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center gap-2.5 px-4 py-2.5">
        <a
          href={CLINIC.phoneHref}
          aria-label={`Call the office at ${CLINIC.phone}`}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-foreground/20 text-foreground"
        >
          <Phone className="h-5 w-5" strokeWidth={1.9} />
        </a>
        <div className="flex-1">
          <BookingDialog label="Book Appointment" className="w-full" />
        </div>
      </div>
    </div>
  );
}
