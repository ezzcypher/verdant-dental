import type { ReactNode } from "react";

import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

/**
 * Shared section header: small green eyebrow, a serif H2, and an optional
 * lead paragraph. Centered by default; pass `align="left"` for editorial rows.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  className,
  as = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "center" | "left";
  className?: string;
  as?: "h1" | "h2";
}) {
  const H = as;
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
    >
      {eyebrow && (
        <Reveal as="p" className="eyebrow">
          {eyebrow}
        </Reveal>
      )}
      <Reveal delay={eyebrow ? 60 : 0}>
        <H className="mt-3 font-display text-[clamp(1.9rem,4.4vw,3rem)] font-medium leading-[1.08] tracking-tight text-foreground">
          {title}
        </H>
      </Reveal>
      {lead && (
        <Reveal delay={120}>
          <p
            className={cn(
              "mt-4 text-[15px] leading-relaxed text-muted-foreground",
              align === "center" && "mx-auto max-w-xl",
            )}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}
