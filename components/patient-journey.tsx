import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { BookingDialog } from "@/components/booking-dialog";
import { JOURNEY } from "@/components/site-data";

export function PatientJourney() {
  return (
    <section id="journey" className="section bg-background">
      <div className="container-x">
        <SectionHeading
          eyebrow="New here?"
          title="Your first visit, made simple."
          lead="Four steps from “I should probably see a dentist” to a plan you feel good about."
        />

        <ol className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {JOURNEY.map((s, i) => (
            <Reveal as="li" key={s.n} delay={(i % 4) * 90}>
              <div className="relative flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-card">
                <span className="font-display text-4xl font-medium tracking-tight text-primary/35">
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-lg font-medium tracking-tight text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
                  {s.copy}
                </p>
                {i < JOURNEY.length - 1 && (
                  <ArrowRight
                    aria-hidden
                    className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-border lg:block"
                  />
                )}
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-12 flex flex-wrap items-center justify-center gap-4" delay={120}>
          <BookingDialog label="Book Your First Visit" size="lg" />
          <Link
            href="/new-patients"
            className="inline-flex items-center gap-2 text-[14.5px] font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:text-primary"
          >
            New Patient Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
