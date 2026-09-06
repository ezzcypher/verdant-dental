"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { BookingDialog } from "@/components/booking-dialog";
import { FEES, FEES_DEMO_NOTE, MEMBERSHIP } from "@/components/site-data";
import { cn } from "@/lib/utils";

/** What every patient gets regardless of the treatment — the real product. */
const INCLUDED = [
  "A written, itemized estimate before anything is scheduled",
  "Scans and X-rays read through with you, on screen",
  "Nothing added on the day without your say-so",
];

type Cycle = "monthly" | "yearly";

/**
 * Homepage fees section: in-house membership plans up top (a real dental
 * product for uninsured patients — not insurance), then the itemized
 * treatment fees underneath for everyone else. Figures are demo content.
 */
export function Pricing() {
  const [cycle, setCycle] = useState<Cycle>("monthly");
  const yearly = cycle === "yearly";

  return (
    <section id="pricing" className="section bg-secondary/50">
      <div className="container-x">
        {/* Heading + billing toggle */}
        <div className="mx-auto max-w-2xl text-center">
          <Reveal as="p" className="eyebrow">
            {MEMBERSHIP.eyebrow}
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4.4vw,3rem)] font-medium leading-[1.08] tracking-tight text-foreground">
              {MEMBERSHIP.heading}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              {MEMBERSHIP.lead}
            </p>
          </Reveal>

          <Reveal delay={180}>
            <div
              role="group"
              aria-label="Billing period"
              className="mt-9 inline-flex rounded-full border border-border bg-card p-1 shadow-card"
            >
              {(["monthly", "yearly"] as Cycle[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCycle(c)}
                  aria-pressed={cycle === c}
                  className={cn(
                    "rounded-full px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300",
                    cycle === c
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {c === "monthly" ? "Monthly" : "Yearly"}
                </button>
              ))}
            </div>
            <p className="mt-3 text-[12.5px] text-muted-foreground">
              {yearly ? "Roughly two months free versus paying monthly." : "Switch to yearly and save."}
            </p>
          </Reveal>
        </div>

        {/* Plan cards — the middle one sits proud, like the reference layout. */}
        <ul className="mt-14 grid items-center gap-6 lg:grid-cols-3 lg:gap-5">
          {MEMBERSHIP.plans.map((p, i) => (
            <Reveal as="li" key={p.name} delay={i * 90}>
              <article
                className={cn(
                  "flex h-full flex-col rounded-[1.75rem] p-8 transition-[transform,box-shadow] duration-500 ease-silk",
                  p.featured
                    ? "bg-primary text-primary-foreground shadow-lift lg:scale-[1.045] lg:p-9"
                    : "border border-border bg-card shadow-card hover:-translate-y-1 hover:shadow-lift",
                )}
              >
                {p.featured && (
                  <span className="mb-5 inline-flex w-fit rounded-full bg-primary-foreground/15 px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-primary-foreground">
                    {MEMBERSHIP.badge}
                  </span>
                )}

                <div className="flex items-baseline gap-1.5">
                  <span
                    className={cn(
                      "font-display text-[2.75rem] font-medium leading-none tracking-tight",
                      p.featured ? "text-primary-foreground" : "text-foreground",
                    )}
                  >
                    ${yearly ? p.yearly : p.monthly}
                  </span>
                  <span
                    className={cn(
                      "text-[14px]",
                      p.featured ? "text-primary-foreground/70" : "text-muted-foreground",
                    )}
                  >
                    /{yearly ? "year" : "month"}
                  </span>
                </div>

                <h3
                  className={cn(
                    "mt-5 font-display text-[1.4rem] font-medium tracking-tight",
                    p.featured ? "text-primary-foreground" : "text-foreground",
                  )}
                >
                  {p.name}
                </h3>
                <p
                  className={cn(
                    "mt-2 text-[14px] leading-relaxed",
                    p.featured ? "text-primary-foreground/75" : "text-muted-foreground",
                  )}
                >
                  {p.tagline}
                </p>

                <ul className="mt-7 grid flex-1 gap-3.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span
                        className={cn(
                          "mt-px flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full",
                          p.featured
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-primary/12 text-primary",
                        )}
                      >
                        <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                      </span>
                      <span
                        className={cn(
                          "text-[14px] leading-snug",
                          p.featured ? "text-primary-foreground/90" : "text-foreground/85",
                        )}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <BookingDialog
                    label={p.featured ? "Join Verdant" : `Ask About ${p.name}`}
                    className={cn(
                      "w-full",
                      p.featured &&
                        "bg-primary-foreground text-primary hover:bg-primary-foreground/90",
                    )}
                  />
                </div>
              </article>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={330}>
          <p className="mx-auto mt-7 max-w-2xl text-center text-[12px] italic leading-relaxed text-muted-foreground">
            {MEMBERSHIP.note}
          </p>
        </Reveal>

        {/* Pay-as-you-go fees for everyone else. */}
        <div className="mt-20 grid gap-14 border-t border-border pt-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <Reveal>
              <h3 className="max-w-[16ch] font-display text-[clamp(1.5rem,3vw,2rem)] font-medium leading-[1.1] tracking-tight text-foreground">
                Prefer to pay as you go?
              </h3>
            </Reveal>
            <Reveal delay={70}>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
                No membership needed. You&apos;ll know the number before you sit down, and it
                won&apos;t move without a conversation.
              </p>
            </Reveal>

            <ul className="mt-7 grid gap-3.5">
              {INCLUDED.map((t, i) => (
                <Reveal as="li" key={t} delay={140 + i * 70} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="text-[14.5px] leading-relaxed text-foreground/85">{t}</span>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={380}>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <BookingDialog label="Get Your Estimate" />
                <Link
                  href="/insurance"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.13em] text-foreground transition-colors hover:text-primary"
                >
                  Insurance &amp; Financing
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>
          </div>

          <div>
            <dl className="border-t border-border">
              {FEES.map((row, i) => (
                <Reveal
                  as="div"
                  key={row.item}
                  delay={i * 70}
                  className="group flex items-baseline justify-between gap-6 border-b border-border py-5 transition-colors duration-300 hover:border-primary/40"
                >
                  <dt className="text-[14.5px] leading-snug text-foreground/85 transition-colors duration-300 group-hover:text-foreground">
                    {row.item}
                  </dt>
                  <dd className="shrink-0 font-display text-[19px] tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                    {row.price}
                  </dd>
                </Reveal>
              ))}
            </dl>
            <Reveal delay={480}>
              <p className="mt-5 text-[12px] italic leading-relaxed text-muted-foreground">
                {FEES_DEMO_NOTE}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
