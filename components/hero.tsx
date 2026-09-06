import Link from "next/link";
import { ArrowRight } from "lucide-react";

import ScrollRevealHero from "@/components/ui/scroll-reveal-hero";
import { BookingDialog } from "@/components/booking-dialog";
import { Button } from "@/components/ui/button";
import { HERO, REVEAL_IMAGES } from "@/components/site-data";

/**
 * Homepage hero.
 *
 * The cinematic scroll-reveal (locked-scroll image cross-dissolve, once per
 * session, "Skip intro" for keyboard users, disabled under reduced-motion) is
 * kept as the atmospheric background layer. A patient-focused headline, two
 * CTAs and a trust line sit on top and are visible and tappable immediately —
 * so a visitor understands "dental practice · book an appointment" at a glance
 * even if they never scroll the reveal.
 */
export function Hero() {
  return (
    <section id="top" className="relative">
      <ScrollRevealHero
        images={REVEAL_IMAGES}
        title=""
        tagline=""
        scrollHint="Scroll"
        scrubDistance={1500}
        accent="#5f9a78"
        skipTo="#trust"
      />

      <div className="pointer-events-none absolute inset-0 z-[6] flex items-end">
        {/* Extra bottom-weighted scrim so the copy is always legible on the photo. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/75 via-black/35 to-transparent"
        />

        <div className="container-x relative w-full pb-24 pt-28 md:pb-28">
          <div className="max-w-2xl">
            <p className="pointer-events-auto text-[12px] font-semibold uppercase tracking-[0.2em] text-white/85">
              {HERO.trustLine}
            </p>

            <h1 className="mt-4 font-display text-[clamp(2.4rem,6.2vw,4.25rem)] font-medium leading-[1.03] tracking-tight text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.45)]">
              {HERO.heading}
            </h1>

            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/85 md:text-base">
              {HERO.sub}
            </p>

            <div className="pointer-events-auto mt-8 flex flex-wrap items-center gap-3">
              <BookingDialog label="Book an Appointment" size="lg" />
              <Button asChild variant="outline" size="lg" className="border-white/40 bg-white/10 text-white hover:border-white/70 hover:bg-white/15">
                <Link href="/services">
                  Explore Our Services
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
