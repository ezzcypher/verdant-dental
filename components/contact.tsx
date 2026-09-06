"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Check, MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookingDialog } from "@/components/booking-dialog";
import { messageSchema } from "@/lib/validations";
import { CLINIC } from "@/components/site-data";

type Status = "idle" | "sending" | "done" | "error";

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
      {children}
    </span>
  );
}

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CLINIC.mapsQuery)}`;

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      body: String(fd.get("body") ?? ""),
    };
    const parsed = messageSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors as Record<string, string[] | undefined>);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="section border-t border-border bg-background">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        {/* Practice details */}
        <div className="lg:col-span-5">
          <Reveal as="p" className="eyebrow">
            Visit us
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-3 font-display text-[clamp(1.9rem,4vw,2.75rem)] font-medium leading-[1.1] tracking-tight text-foreground">
              Come see us on South Congress.
            </h2>
          </Reveal>

          <dl className="mt-9 grid gap-6 text-[14px]">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.8} />
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Practice
                </dt>
                <dd className="mt-1 text-foreground/85">
                  {CLINIC.addressLine}
                  <br />
                  {CLINIC.city}, {CLINIC.region} {CLINIC.postal}
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.8} />
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Phone
                </dt>
                <dd className="mt-1">
                  <a href={CLINIC.phoneHref} className="text-foreground/85 hover:text-primary">
                    {CLINIC.phone}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.8} />
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Email
                </dt>
                <dd className="mt-1">
                  <a href={CLINIC.emailHref} className="text-foreground/85 hover:text-primary">
                    {CLINIC.email}
                  </a>
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.8} />
              <div className="min-w-0">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Hours
                </dt>
                <dd className="mt-1.5 grid gap-1 text-foreground/85">
                  {CLINIC.hours.map(([d, h]) => (
                    <div key={d} className="flex justify-between gap-6 border-b border-border pb-1">
                      <span>{d}</span>
                      <span className="tabular-nums text-muted-foreground">{h}</span>
                    </div>
                  ))}
                </dd>
              </div>
            </div>
          </dl>

          <div className="mt-8">
            <BookingDialog label="Book an Appointment" />
          </div>
          <p className="mt-4 text-[12px] italic text-muted-foreground">
            Address and hours shown are demonstration content for this portfolio.
          </p>
        </div>

        {/* Map placeholder + enquiry form */}
        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal variant="image">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-secondary shadow-card"
              aria-label="Open the practice location in Google Maps"
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-70"
                style={{
                  backgroundImage:
                    "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
                  backgroundSize: "34px 34px",
                }}
              />
              <div
                aria-hidden
                className="absolute left-1/3 top-1/4 h-24 w-40 -rotate-6 rounded bg-primary/[0.06]"
              />
              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift">
                  <MapPin className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className="mt-3 rounded-full border border-border bg-background/90 px-3 py-1 text-[12px] font-medium text-foreground backdrop-blur">
                  {CLINIC.city}, {CLINIC.region}
                </span>
              </div>
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-[12px] font-semibold text-foreground backdrop-blur transition-colors group-hover:text-primary">
                Get Directions
                <ExternalLink className="h-3.5 w-3.5" />
              </span>
              <span className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-[10px] uppercase tracking-wide text-muted-foreground backdrop-blur">
                Map — demo location
              </span>
            </a>
          </Reveal>

          {status === "done" ? (
            <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-7 shadow-card">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-5 w-5" />
              </span>
              <p className="font-display text-xl tracking-tight text-foreground">Message sent.</p>
              <p className="max-w-sm text-[14.5px] text-muted-foreground">
                We reply within one business day. For anything time-sensitive, please call the
                office directly.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 grid gap-5" noValidate>
              <p className="text-[13px] text-muted-foreground">
                A general enquiry form — please don&apos;t send medical details here. For
                appointments use the booking button.
              </p>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2">
                  <FieldLabel>Name</FieldLabel>
                  <Input name="name" autoComplete="name" required />
                  {errors.name?.[0] && <span className="text-xs text-red-600">{errors.name[0]}</span>}
                </label>
                <label className="grid gap-2">
                  <FieldLabel>Email</FieldLabel>
                  <Input name="email" type="email" autoComplete="email" required />
                  {errors.email?.[0] && (
                    <span className="text-xs text-red-600">{errors.email[0]}</span>
                  )}
                </label>
              </div>
              <label className="grid gap-2">
                <FieldLabel>Subject</FieldLabel>
                <Input name="subject" />
              </label>
              <label className="grid gap-2">
                <FieldLabel>How can we help?</FieldLabel>
                <Textarea name="body" rows={4} required />
                {errors.body?.[0] && <span className="text-xs text-red-600">{errors.body[0]}</span>}
              </label>

              {status === "error" && (
                <p className="text-sm text-red-600">
                  That didn&apos;t send. Please try again or call the office.
                </p>
              )}

              <Button type="submit" size="lg" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send Message"}
                {status !== "sending" && <ArrowRight />}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
