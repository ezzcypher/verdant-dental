import Image from "next/image";
import { Check } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { ABOUT } from "@/components/site-data";

/** Short "About" strip — id="about" is a nav target. */
export function Intro() {
  return (
    <section id="about" className="section bg-background">
      <div className="container-x grid items-center gap-12 md:grid-cols-12 md:gap-14">
        <div className="md:col-span-5">
          <Reveal as="p" className="eyebrow">
            {ABOUT.eyebrow}
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.75rem)] font-medium leading-[1.1] tracking-tight text-foreground">
              {ABOUT.heading}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              {ABOUT.copy}
            </p>
          </Reveal>

          <ul className="mt-7 grid gap-3 text-[14px] text-foreground/85">
            {ABOUT.points.map((p, i) => (
              <Reveal as="li" key={p} delay={180 + i * 60} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.2} />
                {p}
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="md:col-span-7">
          <Reveal variant="image">
            <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-card">
              <Image
                src={ABOUT.image.src}
                alt={ABOUT.image.alt}
                fill
                sizes="(min-width: 768px) 56vw, 100vw"
                className="photo-mono object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
