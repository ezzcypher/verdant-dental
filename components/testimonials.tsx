import { Quote } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { TESTIMONIALS, TESTIMONIALS_DEMO_NOTE } from "@/components/site-data";

export function Testimonials() {
  return (
    <section id="testimonials" className="section bg-background">
      <div className="container-x">
        <SectionHeading
          eyebrow="Patient experiences"
          title="What it's like to be a patient here."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 90}>
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-card">
                <Quote className="h-7 w-7 text-primary/30" strokeWidth={1.5} />
                <blockquote className="mt-4 flex-1 text-[14px] leading-relaxed text-foreground/85">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-4 text-[13px]">
                  <span className="font-semibold tracking-tight text-foreground">{t.name}</span>
                  <span className="ml-2 text-muted-foreground">{t.detail}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 text-center" delay={120}>
          <p className="text-[12px] italic text-muted-foreground">{TESTIMONIALS_DEMO_NOTE}</p>
        </Reveal>
      </div>
    </section>
  );
}
