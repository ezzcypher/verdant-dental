import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

import { CLINIC } from "@/components/site-data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const SITE_URL = "https://verdant-dental.vercel.app";
const DESCRIPTION =
  "Modern dental care in Austin, Texas. Verdant is a family and cosmetic dental practice offering general, preventive, cosmetic, implant and emergency dentistry — new patients welcome.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Verdant Family & Cosmetic Dentistry | Modern Dental Care in Austin, TX",
    template: "%s | Verdant Dental — Austin, TX",
  },
  description: DESCRIPTION,
  applicationName: "Verdant Dental",
  keywords: [
    "dentist Austin TX",
    "family dentist Austin",
    "cosmetic dentistry Austin",
    "dental implants Austin",
    "teeth whitening Austin",
    "emergency dentist Austin",
    "new patient dentist South Congress",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Verdant Family & Cosmetic Dentistry",
    title: "Your Smile, Thoughtfully Cared For. | Verdant Dental — Austin, TX",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Verdant Family & Cosmetic Dentistry — Austin, TX",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
};

/** LocalBusiness / Dentist structured data (demo location). */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: CLINIC.full,
  url: SITE_URL,
  image: `${SITE_URL}/ambience/operatory.jpg`,
  telephone: CLINIC.phone,
  email: CLINIC.email,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: CLINIC.addressLine,
    addressLocality: CLINIC.city,
    addressRegion: CLINIC.region,
    postalCode: CLINIC.postal,
    addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", latitude: 30.2489, longitude: -97.7501 },
  areaServed: { "@type": "City", name: "Austin" },
  medicalSpecialty: "Dentistry",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "08:00",
      closes: "17:00",
    },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "08:00", closes: "14:00" },
  ],
  makesOffer: [
    "General Dentistry",
    "Preventive Dentistry",
    "Cosmetic Dentistry",
    "Dental Implants",
    "Teeth Whitening",
    "Emergency Dentistry",
  ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Enables the reveal-on-scroll system; without JS everything stays visible. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-dvh antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
