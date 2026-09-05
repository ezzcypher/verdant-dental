import Image from "next/image";

import { DOCTORS } from "@/components/site-data";
import { BookingDialog } from "@/components/booking-dialog";

export function Team() {
  return (
    <section id="team" className="border-t border-foreground/10 bg-foreground py-24 text-background md:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-background/50">
              The people
            </p>
            <h2 className="mt-5 max-w-[16ch] font-display text-4xl font-medium leading-[1.05] tracking-tightest md:text-5xl">
              Seventy-seven years of chair time, on one team.
            </h2>
          </div>
          <p className="max-w-sm text-[14px] leading-relaxed text-background/60">
            Specialists who chose to practise together, so complex cases never
            leave the building. Hover a portrait for the detail.
          </p>
        </div>

        <ul className="mt-16 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
          {DOCTORS.map((d) => (
            <li key={d.name} className="group">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-background/10">
                <span className="absolute left-0 right-0 top-0 z-10 h-[3px] origin-left scale-x-0 bg-primary transition-transform duration-500 ease-silk group-hover:scale-x-100" />
                <Image
                  src={d.photo}
                  alt={d.name}
                  fill
                  sizes="(min-width: 1024px) 18vw, (min-width: 768px) 30vw, 45vw"
                  className="object-cover object-top grayscale transition-all duration-700 ease-silk group-hover:grayscale-0"
                />
              </div>

              <div className="mt-4">
                <h3 className="font-display text-lg font-medium tracking-tightest">
                  {d.name}
                </h3>
                <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-background/55">
                  {d.role}
                </p>

                <div className="overflow-hidden opacity-100 transition-all duration-500 ease-silk md:max-h-0 md:opacity-0 md:group-hover:max-h-32 md:group-hover:opacity-100">
                  <p className="mt-3 text-[13px] text-primary">{d.years}</p>
                  <p className="mt-1 text-[13px] leading-snug text-background/70">
                    {d.focus}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-16 flex flex-col items-start gap-4 border-t border-background/15 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-[14px] text-background/60">
            Not sure who you need? Book a consultation and we&apos;ll route you to the
            right specialist.
          </p>
          <BookingDialog label="Book a consultation" />
        </div>
      </div>
    </section>
  );
}
