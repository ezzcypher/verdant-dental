import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SERVICES } from "@/components/site-data";

export function Services() {
  return (
    <section id="services" className="section bg-secondary/50">
      <div className="container-x">
        <SectionHeading
          eyebrow="Dental services"
          title="Comprehensive care, all under one roof."
          lead="From routine check-ups to full smile makeovers — planned carefully, explained plainly, and never rushed."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 80}>
              <Link
                href={`/services/${s.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-card transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <s.icon className="h-6 w-6" strokeWidth={1.6} />
                </span>
                <h3 className="mt-6 font-display text-xl font-medium tracking-tight text-foreground">
                  {s.name}
                </h3>
                <p className="mt-2.5 flex-1 text-[14.5px] leading-relaxed text-muted-foreground">
                  {s.blurb}
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

        <Reveal className="mt-12 text-center" delay={120}>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-[14.5px] font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:text-primary"
          >
            Explore All Dental Services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
