"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { ArrowRight, Check } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { appointmentSchema, TREATMENT_OPTIONS } from "@/lib/validations";

type Status = "idle" | "sending" | "done" | "error";

export function BookingDialog({
  label = "Book a visit",
  variant = "default",
  size = "default",
  className,
}: {
  label?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      treatment: String(fd.get("treatment") ?? ""),
      preferredDate: String(fd.get("preferredDate") ?? ""),
      preferredTime: String(fd.get("preferredTime") ?? ""),
      note: String(fd.get("note") ?? ""),
    };

    const parsed = appointmentSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(
        parsed.error.flatten().fieldErrors as Record<string, string[] | undefined>,
      );
      return;
    }
    setErrors({});
    setStatus("sending");

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json().catch(() => null)) as
        | { reference?: string; fields?: Record<string, string[]> }
        | null;
      if (!res.ok) {
        if (data?.fields) setErrors(data.fields);
        throw new Error("Request failed");
      }
      setReference(data?.reference ?? null);
      setStatus("done");
      form.reset();
    } catch {
      setStatus((s) => (s === "done" ? s : "error"));
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setTimeout(() => setStatus("idle"), 200);
      }}
    >
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          {label}
          <ArrowRight />
        </Button>
      </DialogTrigger>

      <DialogContent>
        {status === "done" ? (
          <div className="flex flex-col items-start gap-4 py-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-5 w-5" />
            </span>
            <DialogHeader>
              <DialogTitle>Request received</DialogTitle>
              <DialogDescription>
                {reference ? (
                  <>
                    Your reference is{" "}
                    <span className="font-medium text-foreground">{reference}</span>. Our front
                    desk will call within one working day to confirm a time. For anything urgent,
                    ring us directly.
                  </>
                ) : (
                  <>
                    Our front desk will call within one working day to confirm a time. For anything
                    urgent, ring us directly.
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Request an appointment</DialogTitle>
              <DialogDescription>
                A few details and a preferred window — no account, no deposit.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} className="grid gap-5" noValidate>
              <Field label="Full name" error={errors.name?.[0]}>
                <Input name="name" autoComplete="name" required />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Email" error={errors.email?.[0]}>
                  <Input name="email" type="email" autoComplete="email" required />
                </Field>
                <Field label="Phone" error={errors.phone?.[0]}>
                  <Input name="phone" type="tel" autoComplete="tel" required />
                </Field>
              </div>

              <Field label="Treatment" error={errors.treatment?.[0]}>
                <select
                  name="treatment"
                  defaultValue=""
                  required
                  className="h-12 w-full border-0 border-b border-foreground/20 bg-transparent text-[15px] text-foreground focus-visible:border-foreground focus-visible:outline-none"
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {TREATMENT_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Preferred date" error={errors.preferredDate?.[0]}>
                  <Input name="preferredDate" placeholder="e.g. next Tuesday" />
                </Field>
                <Field label="Preferred time" error={errors.preferredTime?.[0]}>
                  <Input name="preferredTime" placeholder="e.g. mornings" />
                </Field>
              </div>

              <Field label="Anything we should know?" error={errors.note?.[0]}>
                <Textarea name="note" rows={3} />
              </Field>

              {status === "error" && (
                <p className="text-sm text-red-600">
                  Something went wrong sending that. Please try again, or call us.
                </p>
              )}

              <Button type="submit" size="lg" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send request"}
                {status !== "sending" && <ArrowRight />}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
