import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { WHY_CHOOSE } from "@/components/site-data";

export function WhyChoose() {
  return (
    <section id="why" className="section bg-background">
      <div className="container-x">
        <SectionHeading
          eyebrow="Why Verdant"
          title="Care that puts you first."
          lead="A few principles we don't compromise on — the reasons patients stay with us for years."
          align="left"
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal variant="image" className="order-2 lg:order-1">
            <div className="group relative aspect-[5/6] w-full overflow-hidden rounded-3xl shadow-card sm:aspect-[4/3] lg:aspect-[5/6]">
              <Image
                src="/ambience/operatory.jpg"
                alt="A warm, modern dental operatory with natural light"
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="photo-mono object-cover"
              />
            </div>
          </Reveal>

          <ol className="order-1 grid gap-8 lg:order-2">
            {WHY_CHOOSE.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 90} className="flex gap-4">
                <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/[0.07] text-primary">
                  <p.icon className="h-5 w-5" strokeWidth={1.7} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-medium tracking-tight text-foreground">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
                    {p.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
