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
            <p className="max-w-sm text-[14px] leading-relaxed text-background/65">
              General, cosmetic, restorative, endodontic and surgical care — provided by
              clinicians who chose to practice together.
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {TEAM.map((d, i) => (
            <Reveal as="li" key={d.name} delay={(i % 5) * 70} className="group">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-background/10">
                <span className="absolute left-0 right-0 top-0 z-10 h-[3px] origin-left scale-x-0 bg-primary transition-transform duration-500 ease-silk group-hover:scale-x-100" />
                <Image
                  src={d.photo}
                  alt={`${d.name}, ${d.credentials} — ${d.specialty}`}
                  fill
                  sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
                  className="object-cover object-top grayscale transition-all duration-700 ease-silk group-hover:grayscale-0"
                />
              </div>
              <div className="mt-4">
                <h3 className="font-display text-[17px] font-medium leading-tight tracking-tight">
                  {d.name}
                </h3>
                <p className="mt-1 text-[11.5px] font-semibold uppercase tracking-[0.13em] text-primary">
                  {d.credentials}
                </p>
                <p className="mt-0.5 text-[12.5px] text-background/60">{d.specialty}</p>
                <div className="grid transition-all duration-500 ease-silk md:grid-rows-[0fr] md:opacity-0 md:group-hover:grid-rows-[1fr] md:group-hover:opacity-100">
                  <p className="mt-2.5 overflow-hidden text-[12.5px] leading-relaxed text-background/70">
                    {d.intro}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>

        <div className="mt-14 flex flex-col items-start gap-5 border-t border-background/15 pt-9 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-[13.5px] text-background/60">
            Not sure who you need? Request a visit and we&apos;ll match you with the right
            clinician. <span className="text-background/40">{TEAM_DEMO_NOTE}</span>
          </p>
          <div className="flex shrink-0 items-center gap-4">
            <BookingDialog label="Book a Consultation" />
            <Link
              href="/#contact"
              className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold uppercase tracking-[0.13em] text-background/80 hover:text-primary"
            >
              Meet the Full Team
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
