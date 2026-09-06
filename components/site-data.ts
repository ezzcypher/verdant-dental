import {
  Smile,
  ShieldCheck,
  Sparkles,
  Bone,
  Sun,
  Zap,
  HeartHandshake,
  Microscope,
  CalendarCheck,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
   Verdant — content model for a modern US dental practice.

   This is a PORTFOLIO / DEMO site. Every name, address, phone number,
   provider profile, testimonial and insurance reference below is
   illustrative placeholder content, not a real business or person.
   Nothing here states patient counts, ratings, awards, certifications
   or clinical outcomes.
   ═══════════════════════════════════════════════════════════════════ */

export const CLINIC = {
  name: "Verdant",
  full: "Verdant Family & Cosmetic Dentistry",
  short: "Verdant Dental",
  tagline: "Modern, personalized dental care.",
  /* Demonstration location — Austin, Texas. */
  addressLine: "1400 South Congress Avenue, Suite 210",
  city: "Austin",
  region: "TX",
  postal: "78704",
  get address() {
    return `${this.addressLine}, ${this.city}, ${this.region} ${this.postal}`;
  },
  phone: "(512) 555-0142",
  phoneHref: "tel:+15125550142",
  email: "hello@verdantdental.com",
  emailHref: "mailto:hello@verdantdental.com",
  mapsQuery: "1400 South Congress Avenue, Austin, TX 78704",
  hours: [
    ["Monday – Thursday", "8:00 AM – 5:00 PM"],
    ["Friday", "8:00 AM – 2:00 PM"],
    ["Saturday", "By appointment"],
    ["Sunday", "Closed"],
  ] as [string, string][],
  isDemo: true,
};

/* ── Navigation ──────────────────────────────────────────────────── */

export const NAV = [
  { label: "About", href: "/#about" },
  { label: "Services", href: "/services" },
  { label: "Our Team", href: "/#team" },
  { label: "New Patients", href: "/new-patients" },
  { label: "Insurance", href: "/insurance" },
  { label: "Contact", href: "/#contact" },
];

/* Full-bleed hero background. Overwrite public/hero/verdant-hero.jpg with a
   wide dental image that leaves clear copy space on the left. */
export const REVEAL_IMAGES = ["/hero/verdant-hero.jpg"];

/* ── Trust bar (no numeric claims) ───────────────────────────────── */

export const TRUST_TAGLINE = "Comfortable care. Modern dentistry. Personal attention.";

export interface TrustItem {
  icon: LucideIcon;
  label: string;
  note: string;
}

export const TRUST_ITEMS: TrustItem[] = [
  { icon: Microscope, label: "Modern Dental Technology", note: "Digital scans, low-dose imaging, quiet handpieces." },
  { icon: HeartHandshake, label: "Patient-Centered Care", note: "One clinician who knows your history and your goals." },
  { icon: Smile, label: "New Patients Welcome", note: "Same-week first visits for individuals and families." },
  { icon: CalendarCheck, label: "Flexible Scheduling", note: "Early mornings, Fridays and Saturday by request." },
];

/* ── Services ────────────────────────────────────────────────────── */

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface Service {
  slug: string;
  name: string;
  nav: string;
  icon: LucideIcon;
  blurb: string;
  image: string;
  /** Representative starting fee (illustrative, mirrors the price list). */
  priceFrom: string;
  summary: string;
  whatItIs: string;
  whoFor: string[];
  benefits: string[];
  whatToExpect: string[];
  faqs: ServiceFaq[];
}

export const SERVICES: Service[] = [
  {
    slug: "general-dentistry",
    name: "General Dentistry",
    nav: "General",
    icon: Smile,
    blurb: "Comprehensive exams, cleanings and everyday restorative care for the whole family.",
    image: "/ambience/suite.jpg",
    priceFrom: "exams from $89",
    summary:
      "Routine and restorative care that keeps small issues small — exams, cleanings, fillings, crowns and more, all in one place.",
    whatItIs:
      "General dentistry covers the everyday care your smile relies on: comprehensive exams, professional cleanings, tooth-colored fillings, crowns, and guidance on caring for your teeth at home. It is the foundation everything else builds on.",
    whoFor: [
      "Anyone due for a routine check-up or cleaning",
      "Families looking for one practice for every age",
      "Patients with a chipped, sensitive or aching tooth",
      "New patients who want a clear picture of where things stand",
    ],
    benefits: [
      "Problems caught early, while treatment is simpler",
      "Tooth-colored materials that blend with your smile",
      "A written plan with honest priorities — not a sales pitch",
      "The same clinician visit to visit",
    ],
    whatToExpect: [
      "A comprehensive exam with digital X-rays and an intraoral scan.",
      "A gentle, thorough cleaning with a hygienist.",
      "A plain-language review of findings and options.",
      "A written treatment plan you can take home before anything is scheduled.",
    ],
    faqs: [
      { q: "How often should I come in?", a: "Most patients do well with a check-up and cleaning every six months. We will tell you if your situation calls for a different interval." },
      { q: "Does a filling hurt?", a: "The area is fully numbed first, and most patients feel only pressure. Let us know if you are anxious — we can go slower and talk you through each step." },
    ],
  },
  {
    slug: "preventive-dentistry",
    name: "Preventive Dentistry",
    nav: "Preventive",
    icon: ShieldCheck,
    blurb: "Cleanings, sealants and early screenings that help you avoid bigger treatment later.",
    image: "/ambience/instruments.jpg",
    priceFrom: "cleanings from $120",
    summary:
      "The care that pays for itself — professional cleanings, gum health monitoring, sealants and oral-cancer screenings on every visit.",
    whatItIs:
      "Preventive dentistry is a plan to keep you out of the dental chair for anything urgent. It combines regular professional cleanings, gum-health tracking, protective sealants, fluoride where helpful, and a screening for early signs of trouble.",
    whoFor: [
      "Patients who want to protect healthy teeth",
      "Children and teens who benefit from sealants",
      "Anyone with a history of cavities or gum inflammation",
      "People who grind or clench and need a nightguard",
    ],
    benefits: [
      "Fewer surprises and lower lifetime cost of care",
      "Early detection of decay, gum disease and other concerns",
      "Personalized home-care coaching that actually fits your routine",
      "Custom nightguards for grinding and clenching",
    ],
    whatToExpect: [
      "A cleaning matched to your gum health, not a one-size routine.",
      "Measurements that track gum health over time.",
      "An oral-cancer screening at every recare visit.",
      "Clear next steps and a recall reminder so nothing slips.",
    ],
    faqs: [
      { q: "Are dental X-rays safe?", a: "We use low-dose digital sensors and only take images when they will change what we do. We are happy to discuss timing and frequency with you." },
      { q: "My gums bleed when I brush — is that normal?", a: "Bleeding usually signals inflammation that is very treatable when addressed early. Mention it at your visit and we will take a closer look." },
    ],
  },
  {
    slug: "cosmetic-dentistry",
    name: "Cosmetic Dentistry",
    nav: "Cosmetic",
    icon: Sparkles,
    blurb: "Whitening, bonding and porcelain veneers, planned around your face — never overdone.",
    image: "/ambience/chairside.jpg",
    priceFrom: "from $390",
    summary:
      "Subtle, natural-looking improvements — from a brighter shade to a full smile design with porcelain veneers.",
    whatItIs:
      "Cosmetic dentistry improves the color, shape and alignment of your smile using conservative options first. That can be professional whitening, tooth-colored bonding to close a small gap or repair a chip, or hand-layered porcelain veneers for a fuller change — always previewed before treatment begins.",
    whoFor: [
      "Anyone bothered by staining, chips, gaps or worn edges",
      "Patients preparing for a wedding, reunion or new role",
      "People who want a change that still looks like them",
    ],
    benefits: [
      "A digital or physical preview before any permanent work",
      "Conservative options considered first",
      "Shades and shapes matched to your face, not a catalog",
      "Results designed to age gracefully",
    ],
    whatToExpect: [
      "A conversation about what you would change, and why.",
      "Photos, a scan and a mock-up of the proposed result.",
      "A written plan with the sequence, timeline and fee.",
      "Placement over one or more visits, with you approving each stage.",
    ],
    faqs: [
      { q: "Will veneers look fake?", a: "Not when they are planned well. We design for your proportions and lip line, and you approve a mock-up before anything is prepared." },
      { q: "How long does whitening last?", a: "It varies with diet and habits — typically many months to a couple of years. Touch-ups are quick and inexpensive." },
    ],
  },
  {
    slug: "dental-implants",
    name: "Dental Implants",
    nav: "Implants",
    icon: Bone,
    blurb: "A stable, natural-feeling replacement for a missing tooth — planned with 3D imaging.",
    image: "/ambience/operatory.jpg",
    priceFrom: "from $2,600",
    summary:
      "A long-term way to replace one tooth or several, using guided planning so the result looks and functions like your own.",
    whatItIs:
      "A dental implant is a small titanium post that takes the place of a missing tooth root. Once it integrates with the bone, it supports a custom crown, bridge or denture. We plan every case with a 3D scan so placement is precise and predictable.",
    whoFor: [
      "Patients missing one or more teeth",
      "People with a failing tooth that cannot be saved",
      "Denture wearers who want more stability",
    ],
    benefits: [
      "Does not rely on or damage neighboring teeth",
      "Feels and functions close to a natural tooth",
      "Helps preserve the jawbone over time",
      "Guided, 3D-planned placement",
    ],
    whatToExpect: [
      "A consultation with a 3D scan to assess bone and spacing.",
      "A written plan covering each stage, the timeline and the fee.",
      "Placement of the implant, then a healing period.",
      "Your final crown or bridge, checked for fit and bite.",
    ],
    faqs: [
      { q: "How long does the whole process take?", a: "Most single-tooth cases take a few months from placement to final crown, allowing time for healing. Your plan will give you specific dates." },
      { q: "Is it painful?", a: "The procedure is done with local anesthetic and most patients compare recovery to a routine extraction. We will review comfort options with you beforehand." },
    ],
  },
  {
    slug: "teeth-whitening",
    name: "Teeth Whitening",
    nav: "Whitening",
    icon: Sun,
    blurb: "Professional whitening — in-office or custom take-home trays — with less sensitivity.",
    image: "/ambience/lounge.jpg",
    priceFrom: "from $390",
    summary:
      "A brighter, even shade using professional-strength gel, applied safely with your gums protected.",
    whatItIs:
      "Professional whitening uses a stronger, better-controlled gel than anything sold over the counter. You can whiten in a single office visit, or with custom trays you wear at home for a week or two. Both protect the gums and let us dial in the result.",
    whoFor: [
      "Anyone with yellowing or dulling from coffee, tea, wine or time",
      "Patients who found strips uneven or uncomfortable",
      "People wanting a predictable shade before a special event",
    ],
    benefits: [
      "Custom-fitted trays for even, gum-safe results",
      "Options to manage sensitivity before and after",
      "A shade check so expectations match reality",
      "Guidance on keeping the result",
    ],
    whatToExpect: [
      "A quick check that whitening is right for you now.",
      "A recorded starting shade.",
      "In-office treatment, or fitting and instructions for take-home trays.",
      "A follow-up shade check and simple aftercare advice.",
    ],
    faqs: [
      { q: "Does whitening damage enamel?", a: "Professional whitening used as directed does not damage enamel. Temporary sensitivity is the most common side effect and usually settles within a day or two." },
      { q: "Will it whiten crowns or veneers?", a: "No — whitening only changes natural tooth structure. If you have front crowns or veneers, we plan the shade around them." },
    ],
  },
  {
    slug: "emergency-dentistry",
    name: "Emergency Dentistry",
    nav: "Emergency",
    icon: Zap,
    blurb: "Same-day relief for pain, swelling or a broken tooth — call us first thing.",
    image: "/ambience/instruments.jpg",
    priceFrom: "from $95",
    summary:
      "Time held open every working day for urgent problems, so you are seen quickly and comfortably.",
    whatItIs:
      "A dental emergency is anything that needs attention now: severe or lingering pain, swelling, bleeding that will not stop, a knocked-out tooth, or a broken tooth or restoration. We reserve time daily so urgent patients are not left waiting.",
    whoFor: [
      "Anyone in significant or worsening tooth pain",
      "A knocked-out, loosened or badly broken tooth",
      "Swelling of the gum, jaw or face",
      "A lost filling or crown causing discomfort",
    ],
    benefits: [
      "Relief-focused first visit to get you comfortable",
      "Same-day appointments reserved every working day",
      "Clear guidance while you are on your way in",
      "A plan for definitive treatment once the urgency passes",
    ],
    whatToExpect: [
      "A phone call so we can advise you and hold a time.",
      "A focused exam and imaging of the problem area.",
      "Treatment to relieve pain or stabilize the tooth that day.",
      "A written plan for anything that still needs to be finished.",
    ],
    faqs: [
      { q: "What should I do for a knocked-out adult tooth?", a: "Handle it by the crown, not the root, keep it in milk or saliva, and call us right away. Getting seen quickly gives the best chance of saving it." },
      { q: "When should I go to a hospital instead?", a: "For swelling that affects breathing or swallowing, uncontrolled bleeding, or a serious facial injury, go to the nearest emergency department first, then follow up with us." },
    ],
  },
];

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);

/* ── Why choose Verdant ──────────────────────────────────────────── */

export interface Principle {
  icon: LucideIcon;
  title: string;
  copy: string;
}

export const WHY_CHOOSE: Principle[] = [
  {
    icon: HeartHandshake,
    title: "Personalized Care",
    copy: "You see the same clinician each visit. They learn your history, your habits and what you actually want from your smile — then plan around it.",
  },
  {
    icon: Microscope,
    title: "Modern Technology",
    copy: "Digital scanning instead of goopy trays, low-dose imaging, and quieter handpieces. Better information, gentler visits.",
  },
  {
    icon: Smile,
    title: "Comfort-Focused Experience",
    copy: "Warm rooms, headphones, blankets, and sedation options when you want them. Nothing starts until you know exactly what will happen.",
  },
  {
    icon: ClipboardList,
    title: "Clear Treatment Guidance",
    copy: "A written plan with honest priorities and a fixed fee before treatment begins. No surprises when you check out.",
  },
];

/* ── The practice (office tour) ──────────────────────────────────── */

export const PRACTICE = {
  eyebrow: "The practice",
  heading: "A practice that doesn't feel like one.",
  copy: [
    "Natural light on every operatory, sound kept low, and warm materials instead of the usual clinical white.",
    "Between patients the room resets completely — sterilized instruments laid out, surfaces wiped, nothing of the last visit left to see.",
    "Every operatory runs the same equipment and the same protocol, so a hand-off between our providers happens down a hallway, not across town.",
  ],
  plates: {
    portrait: { src: "/ambience/suite.jpg", alt: "A calm, naturally lit modern dental treatment room" },
    wide: { src: "/ambience/operatory.jpg", alt: "A modern dental operatory with a treatment chair and overhead light" },
    closing: { src: "/ambience/lounge.jpg", alt: "The welcoming front-of-house and waiting area" },
  },
};

/* ── Team (illustrative demo providers) ──────────────────────────── */

export interface Provider {
  name: string;
  credentials: string;
  specialty: string;
  intro: string;
  photo: string;
}

export const TEAM: Provider[] = [
  {
    name: "Dr. Emily Carter",
    credentials: "DDS",
    specialty: "General & Cosmetic Dentistry",
    intro:
      "Dr. Carter focuses on comprehensive, patient-centered care and conservative cosmetic work — small changes, planned carefully, that still look like you.",
    photo: "/doctors/anna-weber.jpg",
  },
  {
    name: "Dr. Marcus Bennett",
    credentials: "DMD",
    specialty: "Restorative Dentistry & Implants",
    intro:
      "Dr. Bennett handles the practice's implant and full-mouth restorative cases, planning each one with 3D imaging so the result is predictable.",
    photo: "/doctors/adrian-vale.jpg",
  },
  {
    name: "Dr. Priya Nair",
    credentials: "DDS",
    specialty: "Endodontics & Tooth Preservation",
    intro:
      "Dr. Nair specializes in saving teeth that others might give up on, using magnification and gentle technique for root canal therapy.",
    photo: "/doctors/mei-lin.jpg",
  },
  {
    name: "Dr. Julian Reyes",
    credentials: "DDS",
    specialty: "Oral Surgery & Sedation",
    intro:
      "Dr. Reyes covers surgical extractions and sedation dentistry, and is the person nervous patients ask for by name.",
    photo: "/doctors/samir-haddad.jpg",
  },
  {
    name: "Dr. Hannah Cole",
    credentials: "DMD",
    specialty: "Family & Preventive Dentistry",
    intro:
      "Dr. Cole sees families across every age, with a light, unhurried touch that makes a child's first visit a non-event.",
    photo: "/doctors/luca-moretti.jpg",
  },
];

export const TEAM_DEMO_NOTE =
  "Provider profiles shown are illustrative placeholder content for this portfolio demo.";

/* ── Patient journey ─────────────────────────────────────────────── */

export interface JourneyStep {
  n: string;
  title: string;
  copy: string;
}

export const JOURNEY: JourneyStep[] = [
  { n: "01", title: "Request an Appointment", copy: "Book online, through the chat assistant, or by phone. Tell us roughly what you need and when you're free." },
  { n: "02", title: "Complete Your Patient Forms", copy: "We email a short secure form so your paperwork is done before you arrive. Bring a photo ID and your insurance card if you have one." },
  { n: "03", title: "Meet Your Dentist", copy: "A comprehensive exam, digital scan and imaging, then a plain-language review of what we found." },
  { n: "04", title: "Receive Your Personalized Care Plan", copy: "A written plan with honest priorities and a fixed fee — yours to take home before anything is scheduled." },
];

/* ── New patients ────────────────────────────────────────────────── */

export const NEW_PATIENTS = {
  whatToExpect: [
    "A warm welcome and a short tour if it's your first time.",
    "A comprehensive exam: digital X-rays, an intraoral scan, and a gum-health check.",
    "An oral-cancer screening.",
    "A plain-language walkthrough of findings, with photos on the screen.",
    "A written, itemized plan with fixed fees — no pressure to decide on the spot.",
  ],
  whatToBring: [
    "A photo ID.",
    "Your dental insurance card, if you have coverage.",
    "A list of any medications and relevant medical history.",
    "Your completed patient forms (we email these ahead of time).",
    "Any recent X-rays or records from a previous dentist, if easy to get.",
  ],
  forms:
    "We send new-patient forms by secure email once your visit is booked, so there's no clipboard when you arrive. Please don't email medical details to us directly — use the secure link.",
};

/* ── Insurance & financing (demo) ────────────────────────────────── */

export const INSURANCE = {
  heading: "Making Dental Care Easier",
  intro:
    "We want cost to be the last reason you put off care. Here's how billing, insurance and payment work at Verdant.",
  demoNote:
    "Insurance and plan names shown on this page are for demonstration purposes only and do not represent real network participation.",
  accepted: {
    title: "Accepted Insurance",
    copy: "We're happy to bill most PPO dental plans as a courtesy and will give you a clear estimate of your out-of-pocket cost before treatment. We're out-of-network with HMO/DMO plans.",
    examplePlans: ["Sample PPO Network A", "Sample PPO Network B", "Sample PPO Network C", "Sample Employer Plan"],
  },
  payment: {
    title: "Flexible Payment Options",
    items: [
      "All major credit and debit cards, plus HSA and FSA cards.",
      "Cash and check.",
      "In-house membership plan for patients without insurance (demo).",
      "Written estimates before every treatment, so there are no surprises.",
    ],
  },
  financing: {
    title: "Financing Available",
    copy: "For larger treatment plans, we offer third-party financing with low- and no-interest options subject to approval, so care can be spread across monthly payments.",
  },
};

/* Illustrative fee ranges — mirror the practice's price list. */
export const FEES: { item: string; price: string }[] = [
  { item: "New-patient exam, scan & X-rays", price: "$89" },
  { item: "Professional cleaning", price: "from $120" },
  { item: "Tooth-colored filling", price: "from $210" },
  { item: "In-office teeth whitening", price: "from $390" },
  { item: "Porcelain veneer (per tooth)", price: "from $850" },
  { item: "Dental implant (single, all-inclusive)", price: "from $2,600" },
];

/* ── Testimonials (illustrative demo) ────────────────────────────── */

export interface Testimonial {
  quote: string;
  name: string;
  detail: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I've spent years avoiding the dentist. The team here talked me through every step and never once made me feel judged. First time I haven't dreaded a cleaning.",
    name: "Renée M.",
    detail: "Preventive care patient",
  },
  {
    quote:
      "They planned my implant with a 3D scan and showed me exactly what would happen. The final tooth matches so well I forget which one it is.",
    name: "David O.",
    detail: "Implant patient",
  },
  {
    quote:
      "Booked an emergency slot at 8 a.m. with a broken molar and was out of pain by lunch. The written plan for the crown was ready before I left.",
    name: "Aisha K.",
    detail: "Emergency visit",
  },
];

export const TESTIMONIALS_DEMO_NOTE =
  "Patient experiences shown are illustrative examples created for this demo, not real reviews.";

/* ── FAQ ─────────────────────────────────────────────────────────── */

export const FAQ: { q: string; a: string }[] = [
  {
    q: "Do you accept new patients?",
    a: "Yes — we welcome new patients of every age and usually have first-visit appointments within the same week. You can book online, through the chat assistant, or by phone.",
  },
  {
    q: "What should I bring to my first appointment?",
    a: "A photo ID, your dental insurance card if you have coverage, a list of any medications, and your completed patient forms (we email these to you once your visit is booked).",
  },
  {
    q: "Do you accept dental insurance?",
    a: "We bill most PPO dental plans as a courtesy and provide a clear out-of-pocket estimate before treatment. Coverage details on this demo site are illustrative only.",
  },
  {
    q: "How often should I visit the dentist?",
    a: "Most people do well with a check-up and cleaning every six months. If your gum health or history calls for a different interval, we'll tell you and explain why.",
  },
  {
    q: "Do you offer emergency appointments?",
    a: "Yes. We hold time open every working day for urgent problems like pain, swelling or a broken tooth. Call first thing and we'll advise you and reserve a slot.",
  },
  {
    q: "What happens during my first visit?",
    a: "A comprehensive exam with digital X-rays and an intraoral scan, an oral-cancer screening, a plain-language review of what we find, and a written, itemized treatment plan with fixed fees to take home.",
  },
  {
    q: "How can I request an appointment?",
    a: "Use the “Book Appointment” button anywhere on this site, ask the chat assistant, or call the office during opening hours. We'll confirm the exact time by phone.",
  },
];

/* ── Footer ──────────────────────────────────────────────────────── */

export const FOOTER_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Services",
    links: SERVICES.map((s) => ({ label: s.name, href: `/services/${s.slug}` })),
  },
  {
    title: "Patients",
    links: [
      { label: "New Patients", href: "/new-patients" },
      { label: "Insurance & Financing", href: "/insurance" },
      { label: "Book an Appointment", href: "/#book" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "Practice",
    links: [
      { label: "About Verdant", href: "/#about" },
      { label: "Our Team", href: "/#team" },
      { label: "First Visit", href: "/#journey" },
      { label: "Patient Experiences", href: "/#testimonials" },
    ],
  },
];

export const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Accessibility", href: "#" },
  { label: "Terms", href: "#" },
];

/* Kept for the AI receptionist prompt / chat quick actions. */
export const CHAT_QUICK_ACTIONS = [
  { label: "Book an Appointment", message: "I'd like to book an appointment." },
  { label: "Find a Service", message: "What dental services do you offer?" },
  { label: "New Patient Questions", message: "I'm a new patient — what should I know before my first visit?" },
  { label: "Insurance Questions", message: "What insurance and payment options do you offer?" },
  { label: "Contact the Office", message: "What are your hours, address and phone number?" },
];

export const HERO = {
  heading: "Your Smile, Thoughtfully Cared For.",
  sub: "Modern, personalized dentistry designed around your comfort, confidence and long-term oral health.",
  trustLine: `Modern Dentistry • New Patients Welcome • ${CLINIC.city}, ${CLINIC.region}`,
};

export const ABOUT = {
  eyebrow: "About Verdant",
  heading: "Dentistry that treats the visit, not just the tooth.",
  copy: "Verdant is an independent family and cosmetic dental practice in South Austin. Our providers work under one roof — general, cosmetic, restorative, endodontic and surgical care — so complex cases never have to leave the building, and you keep the same dentist from first visit to last.",
  points: [
    "One clinician who follows your care start to finish",
    "Fixed, itemized quotes before treatment begins",
    "Same-day time reserved for dental emergencies",
  ],
  image: { src: "/ambience/chairside.jpg", alt: "A dentist working gently with a patient in a modern operatory" },
};
