import ScrollRevealHero from "@/components/ui/scroll-reveal-hero";
import { SiteHeader } from "@/components/site-header";
import { Statement } from "@/components/statement";
import { Intro } from "@/components/intro";
import { Services } from "@/components/services";
import { Space } from "@/components/space";
import { Team } from "@/components/team";
import { Pricing } from "@/components/pricing";
import { Contact } from "@/components/contact";
import { SiteFooter } from "@/components/site-footer";
import { ChatWidget } from "@/components/chat/chat-widget";
import { REVEAL_IMAGES } from "@/components/site-data";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <ScrollRevealHero
          images={REVEAL_IMAGES}
          title="Verdant"
          tagline="Every detail considered. Every visit calm."
        />
        <Statement />
        <Intro />
        <Services />
        <Space />
        <Team />
        <Pricing />
        <Contact />
      </main>
      <SiteFooter />
      <ChatWidget />
    </>
  );
}
