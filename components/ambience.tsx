import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { AMBIENCE } from "@/components/site-data";

/**
 * Mid-page interior band. Three dental-specific plates, each with a line
 * about what that part of the visit actually feels like — the section that
 * answers "what am I walking into?" before the team and the fees do.
 */
export function Ambience() {
  return (
    <section id="practice" className="section bg-secondary/50">
      <div className="container-x">
        <div className="max-w-2xl">
          <Reveal as="p" className="eyebrow">
            {AMBIENCE.eyebrow}
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.75rem)] font-medium leading-[1.08] tracking-tight text-foreground">
              {AMBIENCE.heading}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              {AMBIENCE.lead}
            </p>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
          {AMBIENCE.plates.map((p, i) => (
            <Reveal as="li" key={p.src} delay={i * 110} className="group">
              <figure className="reveal-plate relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-muted shadow-card transition-shadow duration-500 ease-silk group-hover:shadow-lift">
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  style={{ animationDelay: `${i * -5}s` }}
                  className="object-cover transition-[filter] duration-700 ease-silk group-hover:saturate-[1.06] motion-safe:animate-kenburns"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#18241c]/80 to-transparent"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">
                  {p.caption}
                </figcaption>
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-primary transition-transform duration-700 ease-silk group-hover:scale-x-100"
                />
              </figure>
              <p className="mt-5 text-[14.5px] leading-relaxed text-muted-foreground">{p.copy}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={420}>
          <p className="mt-12 max-w-2xl border-l-2 border-primary/30 pl-5 text-[15px] leading-relaxed text-foreground/80">
            {AMBIENCE.closing}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
