import {
  Stethoscope,
  Sparkles,
  SmilePlus,
  Bone,
  Microscope,
  HeartPulse,
  UsersRound,
  CalendarCheck,
  ShieldCheck,
  Phone,
  type LucideIcon,
} from "lucide-react";

export const NAV = [
  { label: "The Space", href: "#space" },
  { label: "Services", href: "#services" },
  { label: "Team", href: "#team" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

/* The scroll-locked hero reveals exactly two frames: the clinician → the work. */
export const REVEAL_IMAGES = [
  "/doctors/adrian-vale.jpg",
  "/reveal/tooth-blue.jpg",
];

export interface HeroStat {
  icon: LucideIcon;
  value: string;
  label: string;
}

export const HERO_STATS: HeroStat[] = [
  { icon: UsersRound, value: "15+", label: "Specialist dentists" },
  { icon: SmilePlus, value: "12k+", label: "Smiles cared for" },
  { icon: Sparkles, value: "25+", label: "Treatments offered" },
];

export interface Service {
  icon: LucideIcon;
  title: string;
  copy: string;
}

export const SERVICES: Service[] = [
  {
    icon: Stethoscope,
    title: "General & Preventive",
    copy: "Unhurried exams, 3D scans and airflow hygiene.",
  },
  {
    icon: Sparkles,
    title: "Cosmetic & Whitening",
    copy: "Veneers and in-clinic whitening planned around your face.",
  },
  {
    icon: SmilePlus,
    title: "Invisible Aligners",
    copy: "Clear aligner courses, mapped digitally end to end.",
  },
  {
    icon: Bone,
    title: "Implants & Restoration",
    copy: "Single implants to full-mouth rehabilitation, guided.",
  },
  {
    icon: Microscope,
    title: "Endodontics",
    copy: "Microscope-assisted root canal therapy that saves the tooth.",
  },
  {
    icon: HeartPulse,
    title: "Calm & Sedation",
    copy: "Nitrous and oral sedation, explained before anything begins.",
  },
];

export interface Doctor {
  name: string;
  role: string;
  years: string;
  focus: string;
  photo: string;
}

export const DOCTORS: Doctor[] = [
  {
    name: "Dr. Adrian Vale",
    role: "Lead Prosthodontist",
    years: "18+ years",
    focus: "Implantology & full-mouth rehabilitation",
    photo: "/doctors/adrian-vale.jpg",
  },
  {
    name: "Dr. Anna Weber",
    role: "Orthodontist",
    years: "14+ years",
    focus: "Clear aligners & digital treatment planning",
    photo: "/doctors/anna-weber.jpg",
  },
  {
    name: "Dr. Luca Moretti",
    role: "Endodontist",
    years: "11+ years",
    focus: "Microscopic root canal therapy",
    photo: "/doctors/luca-moretti.jpg",
  },
  {
    name: "Dr. Samir Haddad",
    role: "Oral Surgeon",
    years: "22+ years",
    focus: "Wisdom teeth, bone grafting & sedation",
    photo: "/doctors/samir-haddad.jpg",
  },
  {
    name: "Dr. Mei Lin",
    role: "Cosmetic Dentist",
    years: "12+ years",
    focus: "Veneers & digital smile design",
    photo: "/doctors/mei-lin.jpg",
  },
];

/* Ambience — editorial layout (Pic 6). A labelled category strip, an
   about block with a portrait photo, one full-bleed plate, a closing note. */
export const SPACE_TABS = ["The Lounge", "Operatory", "Treatment Suite", "Chairside"];

export const SPACE_COPY = [
  "The room does half the work. Natural light on every chair, sound kept low, and warm materials instead of the usual clinical white.",
  "Between appointments the space resets completely — sterilised trays laid out, surfaces wiped, nothing of the last visit left to see.",
  "Every operatory runs the same kit and the same protocol, so a hand-off between specialists happens down a corridor, not across a city.",
];

export const SPACE_PLATES = {
  portrait: { src: "/ambience/suite.jpg", label: "Treatment suite" },
  wide: { src: "/ambience/corridor.jpg", label: "The long corridor" },
  closing: { src: "/ambience/lounge.jpg", label: "The lounge" },
};

/* Pricing / benefits — the mixed four-card row (Pic 5). */
export interface Benefit {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  price?: string;
  priceNote?: string;
  lines: string[];
  cta: string;
  ctaVariant: "default" | "outline" | "solid";
  featured?: boolean;
}

export const BENEFITS: Benefit[] = [
  {
    icon: CalendarCheck,
    eyebrow: "Starting from",
    title: "Treatment Packages",
    price: "$89",
    priceNote: "per visit",
    lines: ["Comprehensive exam + oral-cancer screening", "3D intraoral scan & records", "Airflow hygiene clean & polish"],
    cta: "View packages",
    ctaVariant: "solid",
    featured: true,
  },
  {
    icon: ShieldCheck,
    eyebrow: "Why choose us",
    title: "The Verdant Standard",
    lines: [
      "The same clinician, every visit",
      "Fixed, itemised quotes up front",
      "Microscope-assisted precision",
      "Sedation available for any treatment",
    ],
    cta: "Meet the team",
    ctaVariant: "outline",
  },
  {
    icon: Sparkles,
    eyebrow: "Aesthetics",
    title: "Start your smile plan",
    lines: ["Digital smile design, whitening and veneers — planned around your face, then quoted before a drill is touched."],
    cta: "Book a consult",
    ctaVariant: "outline",
  },
  {
    icon: Phone,
    eyebrow: "Same-day",
    title: "Emergency dental",
    price: "24/7",
    priceNote: "on call",
    lines: ["Relief slots are held open every working day. Call and we will see you today."],
    cta: "Call the studio",
    ctaVariant: "outline",
  },
];

export const A_LA_CARTE = [
  { item: "Consultation & 3D scan", price: "$89" },
  { item: "Airflow hygiene & polish", price: "from $120" },
  { item: "In-clinic teeth whitening", price: "from $390" },
  { item: "Porcelain veneer (per tooth)", price: "from $850" },
  { item: "Invisible aligners (full course)", price: "from $3,900" },
  { item: "Dental implant (single, all-in)", price: "from $2,600" },
];

export const CLINIC = {
  name: "Verdant",
  full: "Verdant — Dental Atelier",
  address: "24 Lindenhof Passage, City Centre",
  phone: "+1 (555) 018‑2245",
  email: "front.desk@verdant.dental",
  hours: [
    ["Mon – Thu", "8:00 – 19:00"],
    ["Friday", "8:00 – 16:00"],
    ["Saturday", "9:00 – 14:00"],
    ["Sunday", "Closed"],
  ],
};
