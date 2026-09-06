import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { Reveal } from "@/components/reveal";

interface Crumb {
  label: string;
  href?: string;
}

/** Compact hero for interior pages — image, dark scrim, one H1. */
export function PageHero({
  eyebrow,
  title,
  sub,
  image,
  imageAlt,
  crumbs = [],
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  image: string;
  imageAlt: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="relative isolate overflow-hidden bg-foreground">
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover opacity-55"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-foreground via-foreground/70 to-foreground/40"
      />

      <div className="container-x py-16 text-background md:py-24">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-[12px] text-background/60">
            {crumbs.map((c, i) => (
              <span key={c.label} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                {c.href ? (
                  <Link href={c.href} className="hover:text-primary">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-background/80">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {eyebrow && (
          <Reveal as="p" className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            {eyebrow}
          </Reveal>
        )}
        <Reveal delay={eyebrow ? 60 : 0}>
          <h1 className="mt-3 max-w-3xl font-display text-[clamp(2.1rem,5vw,3.5rem)] font-medium leading-[1.05] tracking-tight">
            {title}
          </h1>
        </Reveal>
        {sub && (
          <Reveal delay={120}>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-background/80">{sub}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
