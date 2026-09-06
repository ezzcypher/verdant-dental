import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { TrustBar } from "@/components/trust-bar";
import { Intro } from "@/components/intro";
import { Services } from "@/components/services";
import { WhyChoose } from "@/components/why-choose";
import { Practice } from "@/components/practice";
import { Team } from "@/components/team";
import { Pricing } from "@/components/pricing";
import { PatientJourney } from "@/components/patient-journey";
import { InsuranceFinancing } from "@/components/insurance-financing";
import { Testimonials } from "@/components/testimonials";
import { Faq } from "@/components/faq";
import { Contact } from "@/components/contact";
import { FinalCta } from "@/components/final-cta";
import { SiteFooter } from "@/components/site-footer";
import { ChatWidget } from "@/components/chat/chat-widget";
import { MobileCta } from "@/components/mobile-cta";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <TrustBar />
        <Intro />
        <Services />
        <WhyChoose />
        <Practice />
        <Team />
        <Pricing />
        <PatientJourney />
        <InsuranceFinancing />
        <Testimonials />
        <Faq />
        <Contact />
        <FinalCta />
      </main>
      <SiteFooter />
      <ChatWidget />
      <MobileCta />
    </>
  );
}
