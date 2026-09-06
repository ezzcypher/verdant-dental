import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { PRACTICE } from "@/components/site-data";

/** Office tour — modern, calm, dental-specific interiors. */
export function Practice() {
  return (
    <section id="practice" className="section bg-secondary/50">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <Reveal as="p" className="eyebrow">
              {PRACTICE.eyebrow}
            </Reveal>
            <Reveal delay={60}>
              <h2 className="mt-3 max-w-[16ch] font-display text-[clamp(1.9rem,4vw,2.75rem)] font-medium leading-[1.1] tracking-tight text-foreground">
                {PRACTICE.heading}
              </h2>
            </Reveal>
            <div className="mt-6 space-y-4 text-[14.5px] leading-relaxed text-muted-foreground">
              {PRACTICE.copy.map((p, i) => (
                <Reveal as="p" key={p} delay={120 + i * 60}>
                  {p}
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal variant="image">
            <figure className="group relative aspect-[4/5] overflow-hidden rounded-3xl shadow-card">
              <Image
                src={PRACTICE.plates.portrait.src}
                alt={PRACTICE.plates.portrait.alt}
                fill
                sizes="(min-width: 768px) 46vw, 100vw"
                className="photo-mono object-cover"
              />
            </figure>
          </Reveal>
        </div>

        <Reveal variant="image" className="mt-6 md:mt-10">
          <figure className="group relative aspect-[16/9] overflow-hidden rounded-3xl shadow-card md:aspect-[16/7]">
            <Image
              src={PRACTICE.plates.wide.src}
              alt={PRACTICE.plates.wide.alt}
              fill
              sizes="100vw"
              className="photo-mono object-cover"
            />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
