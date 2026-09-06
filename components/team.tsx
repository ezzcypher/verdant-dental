import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { BookingDialog } from "@/components/booking-dialog";
import { TEAM, TEAM_DEMO_NOTE } from "@/components/site-data";

export function Team() {
  return (
    <section id="team" className="section border-y border-foreground/10 bg-foreground text-background">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Reveal as="p" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Meet the team
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-3 max-w-[18ch] font-display text-[clamp(1.9rem,4vw,2.75rem)] font-medium leading-[1.1] tracking-tight">
                Meet your dental care team.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <p className="max-w-sm text-[14.5px] leading-relaxed text-background/70">
              General, cosmetic, restorative, endodontic and surgical care — provided by
              clinicians who chose to practice together.
            </p>
          </Reveal>
        </div>

        {/* One clean row of providers. The photo carries the motion; the name,
            credential and specialty stay legible at every width, and the short
            bio rides in over the photo on hover. */}
        <ul className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-4">
          {TEAM.map((d, i) => (
            <Reveal as="li" key={d.name} delay={(i % 5) * 80} className="group">
              <Reveal
                variant="image"
                as="div"
                delay={(i % 5) * 80 + 110}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-background/10 transition-shadow duration-500 ease-silk group-hover:shadow-[0_26px_54px_-26px_rgba(0,0,0,0.75)]"
              >
                <Image
                  src={d.photo}
                  alt={`${d.name}, ${d.credentials} — ${d.specialty} at Verdant Dental`}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                  style={{ animationDelay: `${i * -4}s` }}
                  className="object-cover object-[50%_14%] grayscale-[0.88] transition-[filter] duration-700 ease-silk group-hover:grayscale-0 motion-safe:animate-kenburns"
                />
                {/* Short bio rises over the photo on hover / keyboard focus. */}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#14170f]/95 via-[#14170f]/60 to-transparent p-4 opacity-0 transition-opacity duration-500 ease-silk group-focus-within:opacity-100 group-hover:opacity-100">
                  <p className="text-[12.5px] leading-relaxed text-background/90">{d.intro}</p>
                </div>
                {/* Accent bar draws across the top of the photo on hover. */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-primary transition-transform duration-700 ease-silk group-hover:scale-x-100"
                />
              </Reveal>

              <h3 className="mt-4 font-display text-[16.5px] font-medium leading-tight tracking-tight">
                {d.name}
              </h3>
              <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                {d.credentials}
              </p>
              <p className="mt-1 text-[13px] leading-snug text-background/60">{d.specialty}</p>
              {/* Underline extends under the name on hover. */}
              <span
                aria-hidden
                className="mt-3 block h-px w-7 bg-primary/35 transition-all duration-500 ease-silk group-hover:w-12 group-hover:bg-primary"
              />
            </Reveal>
          ))}
        </ul>

        <div className="mt-14 flex flex-col items-start gap-5 border-t border-background/15 pt-9 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-[14.5px] text-background/60">
            Not sure who you need? Request a visit and we&apos;ll match you with the right
            clinician. <span className="text-background/40">{TEAM_DEMO_NOTE}</span>
          </p>
          <div className="flex shrink-0 items-center gap-5">
            <BookingDialog label="Book a Consultation" />
            <Link
              href="/#contact"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.13em] text-background/80 hover:text-primary"
            >
              Contact the Office
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
