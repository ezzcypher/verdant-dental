"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { adminFetch } from "./admin-client";
import { LogoutButton } from "./logout-button";
import { AppointmentsPanel } from "./appointments-panel";
import { ConversationsPanel } from "./conversations-panel";
import { MessagesPanel } from "./messages-panel";
import { ContentPanel } from "./content-panel";
import { KNOWLEDGE_SPEC, TREATMENTS_SPEC, DENTISTS_SPEC } from "./content-specs";

const TABS = [
  { id: "appointments", label: "Appointments" },
  { id: "conversations", label: "Conversations" },
  { id: "messages", label: "Messages" },
  { id: "treatments", label: "Treatments" },
  { id: "dentists", label: "Dentists" },
  { id: "knowledge", label: "Knowledge" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminDashboard() {
  const [tab, setTab] = useState<TabId>("appointments");
  const [ai, setAi] = useState<{ aiMode: string; model: string | null } | null>(null);

  useEffect(() => {
    void adminFetch("/api/admin/status").then((r) => {
      if (r.ok) setAi(r.data);
    });
  }, []);

  return (
    <div className="mx-auto w-full max-w-[1200px] px-5 py-8 md:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Verdant
          </p>
          <h1 className="mt-1 font-display text-3xl font-medium tracking-tightest text-foreground">
            Front desk
          </h1>
          {ai && (
            <p className="mt-2 flex items-center gap-2 text-[12px] text-muted-foreground">
              <span
                className={
                  "h-1.5 w-1.5 rounded-full " +
                  (ai.aiMode === "claude" ? "bg-primary" : "bg-amber-500")
                }
              />
              {ai.aiMode === "claude"
                ? `AI receptionist live (${ai.model})`
                : "AI receptionist in fallback mode - set ANTHROPIC_API_KEY to enable Claude"}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-[13px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            View site
          </Link>
          <LogoutButton />
        </div>
      </header>

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="Dashboard sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-current={tab === t.id ? "page" : undefined}
            className={
              "rounded-full px-4 py-2 text-[13px] font-medium transition-colors " +
              (tab === t.id
                ? "bg-foreground text-background"
                : "border border-border text-foreground/70 hover:border-primary hover:text-primary")
            }
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="mt-7">
        {tab === "appointments" && <AppointmentsPanel />}
        {tab === "conversations" && <ConversationsPanel />}
        {tab === "messages" && <MessagesPanel />}
        {tab === "treatments" && <ContentPanel spec={TREATMENTS_SPEC} />}
        {tab === "dentists" && <ContentPanel spec={DENTISTS_SPEC} />}
        {tab === "knowledge" && <ContentPanel spec={KNOWLEDGE_SPEC} />}
      </main>
    </div>
  );
}
