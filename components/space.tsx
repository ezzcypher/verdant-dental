import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { SPACE_TABS, SPACE_COPY, SPACE_PLATES } from "@/components/site-data";

export function Space() {
  return (
    <section id="space" className="bg-background py-24 md:py-32">
      <div className="container-x">
        {/* Category strip — Pic 6 */}
        <div className="flex flex-wrap items-baseline gap-x-10 gap-y-3 border-b border-border pb-7">
          {SPACE_TABS.map((t, i) => (
            <span key={t} className="flex items-baseline gap-2">
              <span className="text-[11px] tabular-nums text-primary">
                0{i + 1}
              </span>
              <span className="text-[13px] font-medium tracking-wide text-foreground">
                — {t}
              </span>
            </span>
          ))}
        </div>

        {/* About block */}
        <div className="mt-14 grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow">The space</p>
            <h2 className="mt-4 max-w-[16ch] font-display text-4xl font-medium leading-[1.06] tracking-tightest text-foreground md:text-5xl">
              A clinic that forgets to feel like one.
            </h2>
            <div className="mt-7 space-y-4 text-[14.5px] leading-relaxed text-muted-foreground">
              {SPACE_COPY.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>

          <figure className="group relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src={SPACE_PLATES.portrait.src}
              alt={SPACE_PLATES.portrait.label}
              fill
              sizes="(min-width: 768px) 46vw, 100vw"
              className="photo-mono object-cover"
            />
          </figure>
        </div>

        {/* Full-bleed plate */}
        <figure className="group relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl md:mt-10 md:aspect-[16/7]">
          <Image
            src={SPACE_PLATES.wide.src}
            alt={SPACE_PLATES.wide.label}
            fill
            sizes="100vw"
            className="photo-mono object-cover"
          />
        </figure>

        {/* Closing note */}
        <div className="mt-6 grid gap-12 md:mt-10 md:grid-cols-2 md:items-center">
          <figure className="group relative order-2 aspect-[4/3] overflow-hidden rounded-2xl md:order-1">
            <Image
              src={SPACE_PLATES.closing.src}
              alt={SPACE_PLATES.closing.label}
              fill
              sizes="(min-width: 768px) 46vw, 100vw"
              className="photo-mono object-cover"
            />
          </figure>

          <div className="order-1 md:order-2">
            <p className="eyebrow">What it feels like</p>
            <p className="mt-4 font-display text-[1.75rem] leading-snug tracking-tightest text-foreground">
              Warm light, low sound, and a chair you would not mind waiting in.
              Hover any photo to see it the way it looks when you walk in.
            </p>
            <a
              href="#contact"
              className="mt-7 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-primary"
            >
              Plan a visit
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
