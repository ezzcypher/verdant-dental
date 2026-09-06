import Link from "next/link";
import { ArrowRight, Phone, Check } from "lucide-react";

import ScrollRevealHero from "@/components/ui/scroll-reveal-hero";
import { BookingDialog } from "@/components/booking-dialog";
import { Button } from "@/components/ui/button";
import { HERO, REVEAL_IMAGES, CLINIC } from "@/components/site-data";

const REASSURANCE = ["New patients welcome", "Same-week appointments", "We call to confirm"];

/**
 * Homepage hero. Full-bleed dental image (public/hero/verdant-hero.jpg) behind a
 * patient-focused headline in the left copy space. The scroll-reveal chrome
 * (scroll-lock, progress, "Skip intro", disabled under reduced-motion) is kept
 * as the intro treatment; the headline, CTAs and phone are visible and tappable
 * from the first frame.
 */
export function Hero() {
  return (
    <section id="top" className="relative">
      <ScrollRevealHero
        images={REVEAL_IMAGES}
        title=""
        tagline=""
        scrollHint="Scroll"
        scrubDistance={1400}
        accent="#3C6A50"
        skipTo="#trust"
      />

      <div className="pointer-events-none absolute inset-0 z-[6] flex items-center">
        {/* Left-anchored scrim so the copy is crisp on any hero photo. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-[#18241c]/90 via-[#18241c]/55 to-[#18241c]/10 md:to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#18241c]/70 to-transparent"
        />

        <div className="container-x relative w-full pb-14 pt-28 md:py-24">
          <div className="max-w-2xl">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/90">
              {HERO.trustLine}
            </p>

            <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.25rem)] font-medium leading-[1.02] tracking-tight text-white [text-shadow:0_2px_36px_rgba(0,0,0,0.5)]">
              {HERO.heading}
            </h1>

            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-white/90 md:text-[17px]">
              {HERO.sub}
            </p>

            <div className="pointer-events-auto mt-8 flex flex-wrap items-center gap-3">
              <BookingDialog label="Book an Appointment" size="lg" />
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/45 bg-white/10 text-white hover:border-white/75 hover:bg-white/20"
              >
                <Link href="/services">
                  Explore Our Services
                  <ArrowRight />
                </Link>
              </Button>
            </div>

            {/* Click-to-call — always present, prominent on mobile. */}
            <a
              href={CLINIC.phoneHref}
              className="pointer-events-auto mt-4 inline-flex items-center gap-2 text-[15px] font-medium text-white sm:mt-5"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                <Phone className="h-4 w-4" strokeWidth={2} />
              </span>
              Call {CLINIC.phone}
            </a>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-white/80">
              {REASSURANCE.map((r) => (
                <li key={r} className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-white/90" strokeWidth={2.6} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
