import Link from "next/link";
import { ArrowRight, ShieldCheck, Wallet, HandCoins } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { INSURANCE } from "@/components/site-data";

const CARDS = [
  { icon: ShieldCheck, title: INSURANCE.accepted.title, copy: INSURANCE.accepted.copy },
  {
    icon: Wallet,
    title: INSURANCE.payment.title,
    copy: "Cards, HSA/FSA, cash and check — plus a written estimate before every treatment.",
  },
  { icon: HandCoins, title: INSURANCE.financing.title, copy: INSURANCE.financing.copy },
];

export function InsuranceFinancing() {
  return (
    <section id="insurance-financing" className="section bg-secondary/50">
      <div className="container-x">
        <SectionHeading eyebrow="Insurance & financing" title={INSURANCE.heading} lead={INSURANCE.intro} />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {CARDS.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-card">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <c.icon className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <h3 className="mt-5 font-display text-lg font-medium tracking-tight text-foreground">
                  {c.title}
                </h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">{c.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex flex-col items-center gap-4 text-center" delay={120}>
          <Link
            href="/insurance"
            className="inline-flex items-center gap-2 text-[14.5px] font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:text-primary"
          >
            See Insurance &amp; Payment Details
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-[12px] italic text-muted-foreground">{INSURANCE.demoNote}</p>
        </Reveal>
      </div>
    </section>
  );
}
