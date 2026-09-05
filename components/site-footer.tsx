import Image from "next/image";
import { Instagram, Facebook, Linkedin, ArrowUpRight } from "lucide-react";

import { NAV, CLINIC } from "@/components/site-data";
import { BookingDialog } from "@/components/booking-dialog";

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden">
      {/* Pic 7 — full-bleed footer background */}
      <Image
        src="/footer-bg.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-right"
      />
      {/* Readability scrim: solid canvas on the left, clearing to the artwork on the right */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/90 to-background/25 md:to-transparent"
      />

      <div className="container-x py-20 md:py-28">
        <div className="max-w-xl">
          <p className="font-display text-5xl font-medium tracking-tightest text-foreground md:text-6xl">
            {CLINIC.name}
            <span className="text-primary">.</span>
          </p>
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-foreground/70">
            A dental atelier in the centre of the city. Precision work, designed
            around calm.
          </p>
          <div className="mt-7">
            <BookingDialog label="Book a visit" />
          </div>

          <div className="mt-14 grid gap-10 sm:grid-cols-2">
            <nav>
              <p className="eyebrow">Explore</p>
              <ul className="mt-4 grid gap-2.5 text-[14px]">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <a
                      href={n.href}
                      className="text-foreground/75 hover:text-primary"
                    >
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="eyebrow">Visit</p>
              <address className="mt-4 not-italic text-[14px] leading-relaxed text-foreground/75">
                {CLINIC.address}
                <br />
                <a
                  href={`tel:${CLINIC.phone.replace(/[^+\d]/g, "")}`}
                  className="hover:text-primary"
                >
                  {CLINIC.phone}
                </a>
                <br />
                <a href={`mailto:${CLINIC.email}`} className="hover:text-primary">
                  {CLINIC.email}
                </a>
              </address>
              <div className="mt-5 flex gap-4 text-foreground/55">
                <a href="#" aria-label="Instagram" className="hover:text-primary">
                  <Instagram className="h-5 w-5" strokeWidth={1.5} />
                </a>
                <a href="#" aria-label="Facebook" className="hover:text-primary">
                  <Facebook className="h-5 w-5" strokeWidth={1.5} />
                </a>
                <a href="#" aria-label="LinkedIn" className="hover:text-primary">
                  <Linkedin className="h-5 w-5" strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex max-w-xl flex-col gap-3 border-t border-foreground/15 pt-8 text-[12px] text-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {CLINIC.full}.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Patient terms
            </a>
            <a href="#top" className="flex items-center gap-1 hover:text-foreground">
              Back to top <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
