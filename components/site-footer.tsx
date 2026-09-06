import Link from "next/link";
import { Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";

import { CLINIC, FOOTER_COLUMNS, LEGAL_LINKS } from "@/components/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          {/* Brand + NAP */}
          <div>
            <p className="font-display text-2xl font-medium tracking-tight">
              {CLINIC.name}
              <span className="text-primary">.</span>
            </p>
            <p className="mt-3 max-w-xs text-[13.5px] leading-relaxed text-background/60">
              Modern family and cosmetic dentistry in South Austin. Comfortable care, clear
              guidance, and one clinician who knows your smile.
            </p>

            <address className="mt-6 grid gap-2 not-italic text-[13.5px] text-background/70">
              <span className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.8} />
                {CLINIC.address}
              </span>
              <a href={CLINIC.phoneHref} className="flex items-center gap-2.5 hover:text-primary">
                <Phone className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.8} />
                {CLINIC.phone}
              </a>
              <a href={CLINIC.emailHref} className="flex items-center gap-2.5 hover:text-primary">
                <Mail className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.8} />
                {CLINIC.email}
              </a>
            </address>

            <div className="mt-6 flex gap-4 text-background/55">
              <a href="#" aria-label="Instagram (demo)" className="hover:text-primary">
                <Instagram className="h-5 w-5" strokeWidth={1.6} />
              </a>
              <a href="#" aria-label="Facebook (demo)" className="hover:text-primary">
                <Facebook className="h-5 w-5" strokeWidth={1.6} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                {col.title}
              </p>
              <ul className="mt-4 grid gap-2.5 text-[13.5px]">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-background/70 hover:text-primary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Hours */}
        <div className="mt-12 grid gap-2 border-t border-background/12 pt-8 text-[12.5px] text-background/60 sm:grid-cols-2 lg:grid-cols-4">
          {CLINIC.hours.map(([d, h]) => (
            <div key={d} className="flex justify-between gap-4 sm:block">
              <span className="font-medium text-background/80">{d}</span>
              <span className="tabular-nums sm:mt-0.5 sm:block">{h}</span>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-background/12 pt-6 text-[12px] text-background/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {CLINIC.full}. Portfolio demonstration — not a real
            practice.
          </p>
          <div className="flex gap-5">
            {LEGAL_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="hover:text-background">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
