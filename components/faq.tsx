import { Plus } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { FAQ } from "@/components/site-data";

/**
 * FAQ accordion built on native <details>/<summary>: keyboard-accessible and
 * fully functional with no JavaScript. Animation is CSS-only and respects
 * reduced-motion.
 */
export function Faq({
  items = FAQ,
  heading = "Frequently asked questions",
  eyebrow = "Good to know",
}: {
  items?: { q: string; a: string }[];
  heading?: string;
  eyebrow?: string;
}) {
  return (
    <section id="faq" className="section bg-secondary/50">
      <div className="container-x">
        <SectionHeading eyebrow={eyebrow} title={heading} align="left" />

        <div className="mt-12 max-w-3xl divide-y divide-border border-y border-border">
          {items.map((f, i) => (
            <Reveal key={f.q} delay={(i % 6) * 50}>
              <details className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[15px] font-medium tracking-tight text-foreground marker:hidden [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Plus
                    className="h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-open:rotate-45"
                    strokeWidth={2}
                  />
                </summary>
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-silk group-open:grid-rows-[1fr]">
                  <p className="overflow-hidden pb-5 pr-10 text-[14px] leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
