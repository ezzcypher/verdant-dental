import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://verdant.dental"),
  title: {
    default: "Verdant — Dental Atelier",
    template: "%s · Verdant",
  },
  description:
    "A dental atelier in the centre of the city. Precision dentistry, designed around calm — implants, aligners, cosmetic and family care from a team with decades of chair time.",
  openGraph: {
    title: "Verdant — Dental Atelier",
    description:
      "Precision dentistry, designed around calm. Implants, aligners, cosmetic and family care.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
