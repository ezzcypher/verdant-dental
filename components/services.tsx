import { ArrowRight } from "lucide-react";

import { SERVICES } from "@/components/site-data";

export function Services() {
  return (
    <section id="services" className="bg-background py-24 md:py-32">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Our services</p>
          <h2 className="mt-4 font-display text-4xl font-medium leading-[1.08] tracking-tightest text-foreground md:text-5xl">
            Everything a mouth needs, under one roof.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            Six departments, one shared record, one team briefing every morning.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <article
              key={s.title}
              className="group flex flex-col items-center rounded-2xl border border-border bg-card px-7 py-10 text-center transition-shadow duration-300 hover:shadow-[0_20px_50px_-24px_rgba(20,20,25,0.25)]"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/12 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <s.icon className="h-7 w-7" strokeWidth={1.5} />
              </span>
              <h3 className="mt-6 font-display text-xl font-medium tracking-tightest text-foreground">
                {s.title}
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
                {s.copy}
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-[0.14em] text-primary">
                Learn more
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
