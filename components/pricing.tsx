import { Check } from "lucide-react";

import { BENEFITS, A_LA_CARTE, CLINIC } from "@/components/site-data";
import { BookingDialog } from "@/components/booking-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tel = `tel:${CLINIC.phone.replace(/[^+\d]/g, "")}`;

export function Pricing() {
  return (
    <section id="pricing" className="bg-secondary py-24 md:py-32">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Pricing &amp; benefits</p>
          <h2 className="mt-4 font-display text-4xl font-medium leading-[1.08] tracking-tightest text-foreground md:text-5xl">
            What the good ones charge, written down.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            Fixed, itemised quotes before any treatment begins — no surprises on
            the way out.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <article
              key={b.title}
              className={cn(
                "flex flex-col rounded-2xl border p-7",
                b.featured
                  ? "border-primary/30 bg-primary/10"
                  : "border-border bg-card",
              )}
            >
              <span
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  b.featured
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/12 text-primary",
                )}
              >
                <b.icon className="h-6 w-6" strokeWidth={1.5} />
              </span>

              <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {b.eyebrow}
              </p>

              {b.price ? (
                <p className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-display text-4xl font-medium tracking-tightest text-foreground">
                    {b.price}
                  </span>
                  {b.priceNote && (
                    <span className="text-[12px] text-muted-foreground">
                      {b.priceNote}
                    </span>
                  )}
                </p>
              ) : (
                <h3 className="mt-1 font-display text-xl font-medium tracking-tightest text-foreground">
                  {b.title}
                </h3>
              )}

              {b.price && (
                <h3 className="mt-2 font-display text-lg font-medium tracking-tightest text-foreground">
                  {b.title}
                </h3>
              )}

              <ul className="mt-4 flex-1 space-y-2.5 text-[13px] leading-relaxed text-muted-foreground">
                {b.lines.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                {i === 1 ? (
                  <Button asChild variant="outline" className="w-full">
                    <a href="#team">{b.cta}</a>
                  </Button>
                ) : i === 3 ? (
                  <Button asChild variant="outline" className="w-full">
                    <a href={tel}>{b.cta}</a>
                  </Button>
                ) : (
                  <BookingDialog
                    label={b.cta}
                    variant={b.ctaVariant}
                    className="w-full"
                  />
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Plain à-la-carte list */}
        <div className="mx-auto mt-16 max-w-3xl">
          <p className="eyebrow mb-5 text-center">À la carte</p>
          <dl className="grid border-t border-border sm:grid-cols-2">
            {A_LA_CARTE.map((row) => (
              <div
                key={row.item}
                className="flex items-baseline justify-between gap-6 border-b border-border py-4 sm:odd:pr-8 sm:even:border-l sm:even:border-border sm:even:pl-8"
              >
                <dt className="text-[14px] text-foreground/80">{row.item}</dt>
                <dd className="font-display text-lg tracking-tightest text-foreground">
                  {row.price}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-center text-[12px] text-muted-foreground">
            Indicative pricing. Personal quotes follow your consultation and 3D
            scan. Payment plans over 3–24 months.
          </p>
        </div>
      </div>
    </section>
  );
}
