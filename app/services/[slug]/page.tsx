import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { PageHero } from "@/components/page-hero";
import { CtaBand } from "@/components/cta-band";
import { Faq } from "@/components/faq";
import { Reveal } from "@/components/reveal";
import { BookingDialog } from "@/components/booking-dialog";
import { SERVICES, SERVICE_SLUGS } from "@/components/site-data";

export function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  if (!s) return {};
  return {
    title: `${s.name} in Austin, TX`,
    description: s.summary,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { title: `${s.name} | Verdant Dental — Austin, TX`, description: s.summary },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const others = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <PageShell>
      <PageHero
        eyebrow="Dental service"
        title={service.name}
        sub={service.summary}
        image={service.image}
        imageAlt={`${service.name} at Verdant Dental in Austin, Texas`}
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: service.name },
        ]}
      />

      <section className="section bg-background">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="font-display text-2xl font-medium tracking-tight text-foreground">
                What it is
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                {service.whatItIs}
              </p>
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="font-display text-2xl font-medium tracking-tight text-foreground">
                Who it&apos;s for
              </h2>
              <ul className="mt-4 grid gap-2.5">
                {service.whoFor.map((w) => (
                  <li key={w} className="flex items-start gap-3 text-[14.5px] text-foreground/85">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.2} />
                    {w}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-12">
              <h2 className="font-display text-2xl font-medium tracking-tight text-foreground">
                What to expect
              </h2>
              <ol className="mt-5 grid gap-4">
                {service.whatToExpect.map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-[13px] font-semibold text-primary">
                      {i + 1}
                    </span>
                    <p className="pt-0.5 text-[14.5px] leading-relaxed text-foreground/85">{step}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          {/* Benefits + booking rail */}
          <aside className="lg:col-span-5">
            <Reveal>
              <div className="rounded-2xl border border-border bg-secondary/50 p-7 shadow-card">
                <h2 className="font-display text-xl font-medium tracking-tight text-foreground">
                  Benefits
                </h2>
                <ul className="mt-4 grid gap-3">
                  {service.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-[14px] text-foreground/85">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.2} />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <BookingDialog label="Book an Appointment" className="w-full" />
                </div>
                <p className="mt-3 text-center text-[12px] text-muted-foreground">
                  Or call{" "}
                  <a href="tel:+15125550142" className="font-medium text-foreground hover:text-primary">
                    (512) 555-0142
                  </a>
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <Faq
        items={service.faqs}
        eyebrow={service.name}
        heading={`${service.name} — common questions`}
      />

      <section className="section bg-background">
        <div className="container-x">
          <h2 className="font-display text-xl font-medium tracking-tight text-foreground">
            Related services
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {others.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 text-[14px] font-medium text-foreground shadow-card transition-colors hover:border-primary/40"
              >
                <span className="flex items-center gap-3">
                  <s.icon className="h-4 w-4 text-primary" strokeWidth={1.7} />
                  {s.name}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </PageShell>
  );
}
