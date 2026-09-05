#!/usr/bin/env node
/**
 * Seed the clinic's editable content: treatments (with prices), the dentist
 * roster, and the knowledge base the AI receptionist answers from.
 *
 *   npm run db:seed
 *
 * Idempotent — every row is upserted by slug, so re-running updates the seed
 * content without touching anything the clinic has edited elsewhere or any
 * patient data.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TREATMENTS = [
  {
    slug: "exam-3d-scan",
    name: "Comprehensive Exam + 3D Scan",
    category: "general",
    description:
      "Full assessment, oral-cancer screening and a digital 3D intraoral scan. The starting point for any treatment plan.",
    priceFrom: "$89",
    duration: "45 min",
    keywords: "check up, checkup, exam, first visit, new patient, scan, x-ray, consultation",
    sortOrder: 1,
  },
  {
    slug: "hygiene-airflow",
    name: "Airflow Hygiene & Polish",
    category: "general",
    description: "Guided biofilm removal and stain polish, gentler than traditional scaling.",
    priceFrom: "from $120",
    duration: "40 min",
    keywords: "cleaning, clean, hygiene, scale, polish, plaque, tartar, stains",
    sortOrder: 2,
  },
  {
    slug: "teeth-whitening",
    name: "Teeth Whitening",
    category: "cosmetic",
    description: "In-clinic whitening in a single session, shade-matched to your face.",
    priceFrom: "from $390",
    duration: "60–90 min",
    keywords: "whitening, whiten, bleaching, brighter, yellow teeth, stains",
    sortOrder: 3,
  },
  {
    slug: "porcelain-veneers",
    name: "Porcelain Veneers",
    category: "cosmetic",
    description: "Hand-layered porcelain veneers, planned with a digital smile design and mock-up.",
    priceFrom: "from $850 per tooth",
    duration: "2–3 visits",
    keywords: "veneer, veneers, smile makeover, chipped, gap, cosmetic",
    sortOrder: 4,
  },
  {
    slug: "invisible-aligners",
    name: "Invisible Aligners",
    category: "orthodontics",
    description: "Clear aligner course mapped digitally start to finish, with fewer chair visits.",
    priceFrom: "from $3,900",
    duration: "6–18 months",
    keywords: "aligners, invisalign, braces, straighten, crooked, orthodontic, crowding",
    sortOrder: 5,
  },
  {
    slug: "dental-implant",
    name: "Dental Implant",
    category: "surgical",
    description: "Guided single implant with a custom crown, all-inclusive of surgical planning.",
    priceFrom: "from $2,600",
    duration: "3–6 months total",
    keywords: "implant, missing tooth, replace tooth, lost tooth, denture alternative",
    sortOrder: 6,
  },
  {
    slug: "root-canal",
    name: "Root Canal Therapy",
    category: "general",
    description: "Microscope-assisted endodontic treatment that saves the natural tooth.",
    priceFrom: "from $650",
    duration: "60–90 min",
    keywords: "root canal, endodontic, nerve, toothache, deep pain, infected tooth, abscess",
    sortOrder: 7,
  },
  {
    slug: "crown-bridge",
    name: "Crown or Bridge",
    category: "general",
    description: "Custom ceramic crown or bridge, digitally designed and shade-matched.",
    priceFrom: "from $980",
    duration: "2 visits",
    keywords: "crown, cap, bridge, broken tooth, rebuild, restore",
    sortOrder: 8,
  },
  {
    slug: "wisdom-tooth-removal",
    name: "Wisdom Tooth Removal",
    category: "surgical",
    description: "Surgical extraction with sedation available, by our oral surgeon.",
    priceFrom: "from $450",
    duration: "45–60 min",
    keywords: "wisdom tooth, wisdom teeth, extraction, remove tooth, pull tooth, impacted",
    sortOrder: 9,
  },
  {
    slug: "emergency-appointment",
    name: "Emergency Appointment",
    category: "emergency",
    description:
      "Same-day relief slot for pain, swelling, a broken or knocked-out tooth. Held open every working day.",
    priceFrom: "from $95 (assessment)",
    duration: "30 min",
    keywords: "emergency, urgent, pain, swelling, broken, knocked out, bleeding, today, same day",
    sortOrder: 0,
  },
];

const DENTISTS = [
  {
    slug: "adrian-vale",
    name: "Dr. Adrian Vale",
    title: "Lead Prosthodontist",
    focus: "Implantology & full-mouth rehabilitation",
    yearsExperience: 18,
    languages: "English, German",
    photo: "/doctors/adrian-vale.jpg",
    sortOrder: 1,
  },
  {
    slug: "anna-weber",
    name: "Dr. Anna Weber",
    title: "Orthodontist",
    focus: "Clear aligners & digital treatment planning",
    yearsExperience: 14,
    languages: "English, German",
    photo: "/doctors/anna-weber.jpg",
    sortOrder: 2,
  },
  {
    slug: "luca-moretti",
    name: "Dr. Luca Moretti",
    title: "Endodontist",
    focus: "Microscopic root canal therapy",
    yearsExperience: 11,
    languages: "English, Italian",
    photo: "/doctors/luca-moretti.jpg",
    sortOrder: 3,
  },
  {
    slug: "samir-haddad",
    name: "Dr. Samir Haddad",
    title: "Oral Surgeon",
    focus: "Wisdom teeth, bone grafting & sedation",
    yearsExperience: 22,
    languages: "English, Arabic, French",
    photo: "/doctors/samir-haddad.jpg",
    sortOrder: 4,
  },
  {
    slug: "mei-lin",
    name: "Dr. Mei Lin",
    title: "Cosmetic Dentist",
    focus: "Veneers & digital smile design",
    yearsExperience: 12,
    languages: "English, Mandarin",
    photo: "/doctors/mei-lin.jpg",
    sortOrder: 5,
  },
];

const KNOWLEDGE = [
  {
    slug: "opening-hours",
    category: "hours",
    title: "Opening hours",
    content:
      "Monday to Thursday 8:00–19:00, Friday 8:00–16:00, Saturday 9:00–14:00. Closed Sunday. Emergency relief slots are held open every working day.",
    sortOrder: 1,
  },
  {
    slug: "location-parking",
    category: "location",
    title: "Finding us and parking",
    content:
      "We are at 24 Lindenhof Passage in the city centre, a five-minute walk from the central transit stop. Street parking is metered; the Lindenhof underground car park is two doors down and we validate two hours for treatment appointments.",
    sortOrder: 1,
  },
  {
    slug: "first-visit",
    category: "faq",
    title: "What happens at a first visit",
    content:
      "Your first visit is a comprehensive exam with a 3D intraoral scan ($89, about 45 minutes). You will get a written, itemised plan with fixed prices before anything is booked. Bring a list of any medication you take.",
    sortOrder: 1,
  },
  {
    slug: "payment-plans",
    category: "insurance",
    title: "Payment and insurance",
    content:
      "We accept all major cards and bank transfer. Treatment over $500 can be split across 3 to 24 months, interest-free over 12 months. We are not tied to any insurer but provide fully itemised invoices that most plans reimburse — check your policy's annual limit first.",
    sortOrder: 1,
  },
  {
    slug: "nervous-patients",
    category: "policy",
    title: "Nervous or anxious patients",
    content:
      "Tell us when you book and we will schedule a longer, quieter appointment. We offer nitrous oxide (happy air) and oral sedation for any treatment, plus noise-cancelling headphones. Nothing starts until you have been told exactly what will happen.",
    sortOrder: 2,
  },
  {
    slug: "emergency-policy",
    category: "policy",
    title: "Dental emergencies",
    content:
      "Call +1 (555) 018-2245 as early in the day as possible — relief slots are held open every working day. For a knocked-out adult tooth, keep it in milk or saliva (never scrub it) and come in within the hour. For facial swelling that affects breathing or swallowing, heavy bleeding that will not stop, or a serious injury, go to your nearest emergency department first.",
    sortOrder: 1,
  },
  {
    slug: "cancellation",
    category: "policy",
    title: "Cancellations and rescheduling",
    content:
      "Please give 24 hours' notice to change or cancel an appointment so we can offer the slot to someone in pain. Late cancellations and no-shows may be charged 50% of the reserved time.",
    sortOrder: 3,
  },
  {
    slug: "children",
    category: "faq",
    title: "Children and families",
    content:
      "We see children from age three. Under-16 check-ups and hygiene visits are half price when a parent is also a patient. Children's first visits are deliberately short and hands-off — just a look, a count and a sticker.",
    sortOrder: 2,
  },
  {
    slug: "whitening-aftercare",
    category: "aftercare",
    title: "After teeth whitening",
    content:
      "Avoid coffee, tea, red wine, curry and tobacco for 48 hours — enamel is temporarily more porous. Mild sensitivity for a day or two is normal; a sensitive-teeth toothpaste helps. Results typically last 12–24 months depending on diet.",
    sortOrder: 1,
  },
  {
    slug: "extraction-aftercare",
    category: "aftercare",
    title: "After an extraction",
    content:
      "Bite firmly on the gauze for 30 minutes. No rinsing, spitting, smoking or straws for 24 hours — that dislodges the clot and causes dry socket. Soft food, and take any prescribed painkillers before the anaesthetic wears off. Call us if pain worsens after day three.",
    sortOrder: 2,
  },
  {
    slug: "guarantee",
    category: "policy",
    title: "Our guarantee",
    content:
      "Crowns, bridges, veneers and implant restorations carry a five-year guarantee against material or workmanship failure, provided you attend your recommended hygiene visits.",
    sortOrder: 4,
  },
  {
    slug: "about-clinic",
    category: "clinic",
    title: "About Verdant",
    content:
      "Verdant is an independent dental atelier in the city centre, open since 2009. Five specialists practise together under one roof — general, cosmetic, orthodontic, endodontic and surgical — so complex cases never leave the building. You keep the same clinician throughout your treatment.",
    sortOrder: 1,
  },
];

async function main() {
  for (const t of TREATMENTS) {
    await prisma.treatment.upsert({ where: { slug: t.slug }, update: t, create: t });
  }
  for (const d of DENTISTS) {
    await prisma.dentist.upsert({ where: { slug: d.slug }, update: d, create: d });
  }
  for (const k of KNOWLEDGE) {
    await prisma.knowledgeItem.upsert({ where: { slug: k.slug }, update: k, create: k });
  }

  const [treatments, dentists, knowledge] = await Promise.all([
    prisma.treatment.count(),
    prisma.dentist.count(),
    prisma.knowledgeItem.count(),
  ]);
  console.log(
    `Seeded: ${treatments} treatments, ${dentists} dentists, ${knowledge} knowledge items.`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
