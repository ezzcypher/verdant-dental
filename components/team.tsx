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

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((d, i) => (
            <Reveal as="li" key={d.name} delay={(i % 3) * 90} className="group">
              <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-background/[0.06] ring-1 ring-background/10 transition-[transform,background-color,box-shadow] duration-500 ease-silk group-hover:bg-background/[0.09] group-hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.55)] motion-safe:group-hover:-translate-y-1.5">
                <Reveal
                  variant="image"
                  as="div"
                  delay={(i % 3) * 90 + 130}
                  className="relative aspect-[5/4] w-full overflow-hidden bg-background/10"
                >
                  <Image
                    src={d.photo}
                    alt={`${d.name}, ${d.credentials} — ${d.specialty} at Verdant Dental`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    style={{ animationDelay: `${i * -3}s` }}
                    className="object-cover object-[50%_18%] saturate-[1.03] transition-[filter] duration-700 ease-silk group-hover:brightness-[1.04] group-hover:saturate-[1.12] motion-safe:animate-kenburns"
                  />
                  {/* Warm floor gradient so the name plate below reads cleanly against the photo edge. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-foreground/40 to-transparent"
                  />
                  {/* Accent bar draws across the top of the photo on hover. */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-primary transition-transform duration-700 ease-silk group-hover:scale-x-100"
                  />
                </Reveal>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-[19px] font-medium leading-tight tracking-tight">
                    {d.name}
                    <span className="ml-2 align-middle text-[12px] font-semibold uppercase tracking-[0.12em] text-primary">
                      {d.credentials}
                    </span>
                  </h3>
                  {/* Underline extends under the name on hover. */}
                  <span
                    aria-hidden
                    className="mt-2 block h-px w-8 origin-left bg-primary/40 transition-all duration-500 ease-silk group-hover:w-14 group-hover:bg-primary"
                  />
                  <p className="mt-2 text-[13px] text-background/60">{d.specialty}</p>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-background/75">{d.intro}</p>
                </div>
              </article>
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
