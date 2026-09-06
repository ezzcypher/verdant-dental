import type { Metadata } from "next";
import { Check, FileText, ClipboardList } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { Faq } from "@/components/faq";
import { Reveal } from "@/components/reveal";
import { BookingDialog } from "@/components/booking-dialog";
import { NEW_PATIENTS, JOURNEY, INSURANCE, FAQ } from "@/components/site-data";

export const metadata: Metadata = {
  title: "New Patients",
  description:
    "What to expect, what to bring, and how your first visit works at Verdant Family & Cosmetic Dentistry in Austin, TX. New patients seen within the week.",
  alternates: { canonical: "/new-patients" },
};

const NP_FAQ = FAQ.filter((f) =>
  ["Do you accept new patients?", "What should I bring to my first appointment?", "What happens during my first visit?", "How can I request an appointment?"].includes(f.q),
);

export default function NewPatientsPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="New patients"
        title="Welcome to Verdant."
        sub="Your first visit is about getting a clear, honest picture of your dental health — with no pressure to decide anything on the spot."
        image="/ambience/lounge.jpg"
        imageAlt="The welcoming front-of-house area at Verdant Dental"
        crumbs={[{ label: "Home", href: "/" }, { label: "New Patients" }]}
      />

      {/* First visit steps */}
      <section className="section bg-background">
        <div className="container-x">
          <Reveal as="h2" className="font-display text-2xl font-medium tracking-tight text-foreground">
            Your first visit, step by step
          </Reveal>
          <ol className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {JOURNEY.map((s, i) => (
              <Reveal as="li" key={s.n} delay={(i % 4) * 80}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-card">
                  <span className="font-display text-3xl font-medium text-primary/35">{s.n}</span>
                  <h3 className="mt-3 font-display text-[17px] font-medium tracking-tight text-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{s.copy}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Expect / Bring */}
      <section className="section bg-secondary/50">
        <div className="container-x grid gap-12 md:grid-cols-2">
          <Reveal>
            <h2 className="flex items-center gap-3 font-display text-xl font-medium tracking-tight text-foreground">
              <ClipboardList className="h-5 w-5 text-primary" strokeWidth={1.7} />
              What to expect
            </h2>
            <ul className="mt-5 grid gap-3">
              {NEW_PATIENTS.whatToExpect.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[14px] text-foreground/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.2} />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="flex items-center gap-3 font-display text-xl font-medium tracking-tight text-foreground">
              <FileText className="h-5 w-5 text-primary" strokeWidth={1.7} />
              What to bring
            </h2>
            <ul className="mt-5 grid gap-3">
              {NEW_PATIENTS.whatToBring.map((t) => (
                <li key={t} className="flex items-start gap-3 text-[14px] text-foreground/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.2} />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Forms + insurance summary */}
      <section className="section bg-background">
        <div className="container-x grid gap-8 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-border bg-card p-7 shadow-card">
              <h2 className="font-display text-xl font-medium tracking-tight text-foreground">
                Patient forms
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                {NEW_PATIENTS.forms}
              </p>
              <div className="mt-6">
                <BookingDialog label="Book Your First Appointment" className="w-full" />
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="h-full rounded-2xl border border-border bg-card p-7 shadow-card">
              <h2 className="font-display text-xl font-medium tracking-tight text-foreground">
                Insurance &amp; payment
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                {INSURANCE.accepted.copy} {INSURANCE.financing.copy}
              </p>
              <p className="mt-4 text-[12px] italic text-muted-foreground">{INSURANCE.demoNote}</p>
              <a
                href="/insurance"
                className="mt-5 inline-flex text-[13px] font-semibold uppercase tracking-[0.13em] text-primary hover:underline"
              >
                Full insurance details →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <Faq items={NP_FAQ} eyebrow="New patients" heading="New patient questions" />

      <CtaBand
        title="Book your first appointment"
        sub="New patients are usually seen within the week. It only takes a minute to request a time."
      />
    </PageShell>
  );
}
