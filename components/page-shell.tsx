import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ChatWidget } from "@/components/chat/chat-widget";
import { MobileCta } from "@/components/mobile-cta";

/** Chrome for every interior (non-homepage) route. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="pt-16">
        {children}
      </main>
      <SiteFooter />
      <ChatWidget />
      <MobileCta />
    </>
  );
}
