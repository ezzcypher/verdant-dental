import Image from "next/image";
import { Phone } from "lucide-react";

import { BookingDialog } from "@/components/booking-dialog";
import { HERO_STATS } from "@/components/site-data";
import { Button } from "@/components/ui/button";

export function Statement() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-background pb-16 pt-28 md:pb-24 md:pt-36"
    >
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
        {/* Copy — Pic 1 layout: badge, split headline, stats row */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-[12px] font-medium text-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Trusted care. Better health.
          </span>

          <h1 className="mt-6 font-display text-[clamp(2.75rem,7.4vw,5.25rem)] font-medium leading-[1.02] tracking-tightest text-foreground">
            Your smile,
            <br />
            <span className="text-primary">our priority.</span>
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Compassionate dentistry, next-generation diagnostics and a team of
            specialists — all under one roof, all tuned for a calmer visit.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <BookingDialog label="Book appointment" />
            <Button asChild variant="outline">
              <a href="#services">Our services</a>
            </Button>
          </div>

          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-6">
            {HERO_STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <s.icon className="h-5 w-5" strokeWidth={1.6} />
                </span>
                <div>
                  <dt className="font-display text-xl font-medium tracking-tightest text-foreground">
                    {s.value}
                  </dt>
                  <dd className="text-[12px] text-muted-foreground">{s.label}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        {/* Portrait with organic shape + floating emergency card */}
        <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
          <div
            aria-hidden
            className="absolute -inset-x-4 bottom-0 top-8 bg-primary/90"
            style={{ borderRadius: "46% 54% 43% 57% / 57% 42% 58% 43%" }}
          />
          <div
            aria-hidden
            className="absolute -right-4 top-4 hidden h-24 w-24 text-primary/40 sm:block"
            style={{
              backgroundImage:
                "radial-gradient(currentColor 1.4px, transparent 1.4px)",
              backgroundSize: "13px 13px",
            }}
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem]">
            <Image
              src="/doctors/luca-moretti.jpg"
              alt="A Verdant clinician"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-xl sm:-right-5 sm:left-auto">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Phone className="h-5 w-5" strokeWidth={1.7} />
            </span>
            <div>
              <p className="font-display text-lg font-medium tracking-tightest text-foreground">
                24/7
              </p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                Emergency support
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
