import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { BookingDialog } from "@/components/booking-dialog";
import { FEES, FEES_DEMO_NOTE } from "@/components/site-data";

/** What every patient gets regardless of the treatment — the real product. */
const INCLUDED = [
  "A written, itemized estimate before anything is scheduled",
  "Scans and X-rays read through with you, on screen",
  "Nothing added on the day without your say-so",
];

/**
 * Homepage fees section. Deliberately an editorial price list rather than
 * tiered "plan" cards — a dental practice quotes treatments, not packages.
 * Figures mirror the illustrative list on /insurance and are demo content.
 */
export function Pricing() {
  return (
    <section id="pricing" className="section bg-secondary/50">
      <div className="container-x grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <Reveal as="p" className="eyebrow">
            Fees &amp; transparency
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-3 max-w-[16ch] font-display text-[clamp(1.9rem,4vw,2.75rem)] font-medium leading-[1.08] tracking-tight text-foreground">
              Clear prices, agreed before we start.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Cost should never be the reason you put off care. You&apos;ll know the number
              before you sit down, and it won&apos;t move without a conversation.
            </p>
          </Reveal>

          <ul className="mt-8 grid gap-3.5">
            {INCLUDED.map((t, i) => (
              <Reveal as="li" key={t} delay={160 + i * 70} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="text-[14.5px] leading-relaxed text-foreground/85">{t}</span>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={400}>
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
    </section>
  );
}
