import type { Metadata } from "next";
import { Check, ShieldCheck, Wallet, HandCoins } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { Faq } from "@/components/faq";
import { Reveal } from "@/components/reveal";
import { INSURANCE, FEES, FAQ } from "@/components/site-data";

export const metadata: Metadata = {
  title: "Insurance & Financing",
  description:
    "How insurance, payment and financing work at Verdant Dental in Austin, TX. We bill most PPO plans as a courtesy and offer flexible payment options. Demo content.",
  alternates: { canonical: "/insurance" },
};

const INS_FAQ = FAQ.filter((f) => f.q === "Do you accept dental insurance?");

export default function InsurancePage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Insurance & financing"
        title={INSURANCE.heading}
        sub={INSURANCE.intro}
        image="/ambience/suite.jpg"
        imageAlt="A modern dental treatment room at Verdant"
        crumbs={[{ label: "Home", href: "/" }, { label: "Insurance & Financing" }]}
      />

      <section className="section bg-background">
        <div className="container-x">
          <div className="grid gap-5 md:grid-cols-3">
            <Reveal>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-card">
                <ShieldCheck className="h-6 w-6 text-primary" strokeWidth={1.6} />
                <h2 className="mt-5 font-display text-lg font-medium tracking-tight text-foreground">
                  {INSURANCE.accepted.title}
                </h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
                  {INSURANCE.accepted.copy}
                </p>
                <ul className="mt-4 grid gap-2 text-[13px] text-foreground/80">
                  {INSURANCE.accepted.examplePlans.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2.4} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-card">
                <Wallet className="h-6 w-6 text-primary" strokeWidth={1.6} />
                <h2 className="mt-5 font-display text-lg font-medium tracking-tight text-foreground">
                  {INSURANCE.payment.title}
                </h2>
                <ul className="mt-3 grid gap-2.5 text-[14.5px] text-foreground/80">
                  {INSURANCE.payment.items.map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2.4} />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-card">
                <HandCoins className="h-6 w-6 text-primary" strokeWidth={1.6} />
                <h2 className="mt-5 font-display text-lg font-medium tracking-tight text-foreground">
                  {INSURANCE.financing.title}
                </h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
                  {INSURANCE.financing.copy}
                </p>
              </div>
            </Reveal>
          </div>

          <p className="mt-6 text-[12px] italic text-muted-foreground">{INSURANCE.demoNote}</p>
        </div>
      </section>

      {/* Illustrative fee list */}
      <section className="section bg-secondary/50">
        <div className="container-x max-w-3xl">
          <Reveal as="h2" className="font-display text-2xl font-medium tracking-tight text-foreground">
            Typical fees
          </Reveal>
          <Reveal as="p" className="mt-3 text-[14px] text-muted-foreground" delay={60}>
            A guide to common treatments. Every plan comes with a written, itemized estimate before
            anything is scheduled.
          </Reveal>
          <dl className="mt-8 divide-y divide-border border-y border-border">
            {FEES.map((row) => (
              <div key={row.item} className="flex items-baseline justify-between gap-6 py-4">
                <dt className="text-[14px] text-foreground/85">{row.item}</dt>
                <dd className="font-display text-lg tracking-tight text-foreground">{row.price}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[12px] italic text-muted-foreground">
            Fee ranges are illustrative demonstration content and do not represent an offer of
            treatment.
          </p>
        </div>
      </section>

      <Faq items={INS_FAQ} eyebrow="Insurance" heading="Insurance questions" />

      <CtaBand
        title="Questions about coverage?"
        sub="Bring your insurance card to your first visit and we'll give you a clear estimate before treatment."
      />
    </PageShell>
  );
}
