import { Phone } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { BookingDialog } from "@/components/booking-dialog";
import { Button } from "@/components/ui/button";
import { CLINIC } from "@/components/site-data";

export function CtaBand({
  title = "Ready to take care of your smile?",
  sub = "Request an appointment with the Verdant dental team.",
}: {
  title?: string;
  sub?: string;
}) {
  return (
    <section className="bg-secondary/60">
      <div className="container-x py-16 text-center md:py-20">
        <Reveal>
          <h2 className="mx-auto max-w-[20ch] font-display text-[clamp(1.7rem,4vw,2.5rem)] font-medium leading-[1.1] tracking-tight text-foreground">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-muted-foreground">
            {sub}
          </p>
        </Reveal>
        <Reveal delay={140} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <BookingDialog label="Book an Appointment" size="lg" />
          <Button asChild variant="outline" size="lg">
            <a href={CLINIC.phoneHref}>
              <Phone className="h-4 w-4" strokeWidth={1.9} />
              Call {CLINIC.phone}
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
