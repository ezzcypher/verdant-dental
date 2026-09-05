"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/lib/validations";
import { CLINIC } from "@/components/site-data";

type Status = "idle" | "sending" | "done" | "error";

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </span>
  );
}

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
      setErrors(
        parsed.error.flatten().fieldErrors as Record<string, string[] | undefined>,
      );
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
    <section id="contact" className="border-t border-foreground/10 bg-background py-24 md:py-32">
      <div className="container-x grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow">Contact</p>
          <h2 className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-tightest text-foreground md:text-5xl">
            Come in, or
            <br />
            just ask us first.
          </h2>

          <dl className="mt-10 grid gap-6 text-[14px]">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Studio
              </dt>
              <dd className="mt-1 text-foreground/85">{CLINIC.address}</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Direct
              </dt>
              <dd className="mt-1 text-foreground/85">
                <a href={`tel:${CLINIC.phone.replace(/[^+\d]/g, "")}`} className="hover:text-primary">
                  {CLINIC.phone}
                </a>
                <br />
                <a href={`mailto:${CLINIC.email}`} className="hover:text-primary">
                  {CLINIC.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Hours
              </dt>
              <dd className="mt-2 grid gap-1 text-foreground/85">
                {CLINIC.hours.map(([d, h]) => (
                  <div key={d} className="flex justify-between gap-8 border-b border-foreground/10 pb-1">
                    <span>{d}</span>
                    <span className="tabular-nums text-muted-foreground">{h}</span>
                  </div>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          {status === "done" ? (
            <div className="flex h-full flex-col items-start justify-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-5 w-5" />
              </span>
              <p className="font-display text-2xl tracking-tightest text-foreground">
                Message sent.
              </p>
              <p className="max-w-sm text-[14px] text-muted-foreground">
                We reply to everything within one working day. For anything time-
                sensitive, please call the studio directly.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-6" noValidate>
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="grid gap-2">
                  <FieldLabel>Name</FieldLabel>
                  <Input name="name" autoComplete="name" required />
                  {errors.name?.[0] && (
                    <span className="text-xs text-red-600">{errors.name[0]}</span>
                  )}
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
                <FieldLabel>Message</FieldLabel>
                <Textarea name="body" rows={5} required />
                {errors.body?.[0] && (
                  <span className="text-xs text-red-600">{errors.body[0]}</span>
                )}
              </label>

              {status === "error" && (
                <p className="text-sm text-red-600">
                  That didn&apos;t send. Please try again or call us.
                </p>
              )}

              <Button type="submit" size="lg" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send message"}
                {status !== "sending" && <ArrowRight />}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
