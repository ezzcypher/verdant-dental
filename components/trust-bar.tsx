import { Reveal } from "@/components/reveal";
import { TRUST_TAGLINE, TRUST_ITEMS } from "@/components/site-data";

export function TrustBar() {
  return (
    <section id="trust" className="border-b border-border bg-secondary/60">
      <div className="container-x py-12 md:py-14">
        <Reveal
          as="p"
          className="text-center font-display text-lg font-medium tracking-tight text-foreground md:text-xl"
        >
          {TRUST_TAGLINE}
        </Reveal>

        <ul className="mt-9 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((t, i) => (
            <Reveal as="li" key={t.label} delay={i * 70} className="flex flex-col items-center text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <t.icon className="h-5 w-5" strokeWidth={1.7} />
              </span>
              <p className="mt-3 text-[14.5px] font-semibold tracking-tight text-foreground">
                {t.label}
              </p>
              <p className="mt-1 max-w-[26ch] text-[13px] leading-relaxed text-muted-foreground">
                {t.note}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
