import Image from "next/image";

export function Intro() {
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container-x grid gap-12 md:grid-cols-12 md:items-center">
        <div className="md:col-span-5">
          <p className="eyebrow">About</p>
          <h2 className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-tightest text-foreground md:text-5xl">
            We treat the mouth,
            <br />
            and the hour around it.
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            True clinical mastery is quiet. It looks like next-generation imaging
            used sparingly, a diagnosis explained until it makes sense, and a
            treatment plan you could have written yourself. No upsell, no theatre —
            just a healthier baseline you keep coming back to.
          </p>

          <ul className="mt-8 grid gap-3 text-[14px] text-foreground/80">
            {[
              "Single-surgeon continuity — you keep the same clinician",
              "Fixed, itemised quotes before anything begins",
              "Emergency slots held open every working day",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-7">
          <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
            <Image
              src="/ambience/chairside.jpg"
              alt="A clinician working chairside under the operatory light"
              fill
              sizes="(min-width: 768px) 58vw, 100vw"
              className="photo-mono object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
