import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { Reveal } from "@/components/reveal";
import { SERVICES } from "@/components/site-data";

export const metadata: Metadata = {
  title: "Dental Services",
  description:
    "General, preventive, cosmetic, implant, whitening and emergency dentistry at Verdant in Austin, TX. Patient-friendly care, planned clearly.",
  alternates: { canonical: "/services" },
};

export default function ServicesIndexPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Dental services"
        title="Dental care for every part of your smile — in Austin, TX."
        sub="Routine, restorative and cosmetic dentistry under one roof in South Austin, so complex cases stay in the building and you keep the same clinician."
        image="/ambience/suite.jpg"
        imageAlt="A calm, naturally lit modern dental treatment room"
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />

      <section className="section bg-background">
        <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 80}>
              <Link
                href={`/services/${s.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <s.icon className="h-6 w-6" strokeWidth={1.6} />
                </span>
                <h2 className="mt-6 font-display text-xl font-medium tracking-tight text-foreground">
                  {s.name}
                </h2>
                <p className="mt-2.5 flex-1 text-[14.5px] leading-relaxed text-muted-foreground">
                  {s.summary}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.13em] text-primary">
                    Learn More
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  <span className="text-[12px] text-muted-foreground">{s.priceFrom}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand />
    </PageShell>
  );
}
