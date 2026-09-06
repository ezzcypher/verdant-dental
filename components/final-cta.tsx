import { Phone } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { BookingDialog } from "@/components/booking-dialog";
import { Button } from "@/components/ui/button";
import { CLINIC } from "@/components/site-data";

export function FinalCta() {
  return (
    <section id="book" className="relative overflow-hidden bg-primary text-primary-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-foreground/10 blur-2xl"
      />
      <div className="container-x relative py-20 text-center md:py-28">
        <Reveal>
          <h2 className="mx-auto max-w-[18ch] font-display text-[clamp(2rem,5vw,3.25rem)] font-medium leading-[1.05] tracking-tight">
            Ready to take care of your smile?
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-primary-foreground/85">
            Request an appointment with the Verdant dental team. New patients are seen within the
            week.
          </p>
        </Reveal>
        <Reveal delay={140} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <BookingDialog label="Book an Appointment" variant="solid" size="lg" />
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:border-primary-foreground/70 hover:bg-primary-foreground/10"
          >
            <a href={CLINIC.phoneHref}>
              <Phone className="h-4 w-4" strokeWidth={1.9} />
              Call {CLINIC.phone}
            </a>
          </Button>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-5 text-[13px] text-primary-foreground/75">
            New patients welcome · Same-week appointments · Free on-site parking
          </p>
        </Reveal>
      </div>
    </section>
  );
}
