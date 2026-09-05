"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";

import { adminFetch, fmtDate } from "./admin-client";
import { Empty, Pill, TableShell, Td, Th } from "./panel-ui";

interface Conversation {
  id: string;
  leadStatus: string;
  status: string;
  patientName: string | null;
  treatment: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  summary: string | null;
  urgentFlag: boolean;
  createdAt: string;
  lastActivityAt: string;
  _count: { messages: number; appointments: number };
}

interface Transcript extends Conversation {
  messages: { id: string; role: string; content: string; createdAt: string }[];
  appointments: { reference: string; treatment: string; status: string }[];
}

const LEAD_TONE: Record<string, "muted" | "primary" | "amber" | "green"> = {
  browsing: "muted",
  interested: "amber",
  booking: "primary",
  converted: "green",
};

export function ConversationsPanel() {
  const [rows, setRows] = useState<Conversation[]>([]);
  const [open, setOpen] = useState<Transcript | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch("/api/admin/conversations");
    if (res.ok) {
      setRows(res.data.conversations ?? []);
      setError(null);
    } else {
      setError(res.error ?? "Could not load conversations.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function view(id: string) {
    const res = await adminFetch(`/api/admin/conversations/${id}`);
    if (res.ok) setOpen(res.data.conversation);
    else setError(res.error ?? "Could not open that conversation.");
  }

  async function remove(id: string) {
    if (!confirm("Delete this conversation and its messages permanently?")) return;
    const res = await adminFetch(`/api/admin/conversations/${id}`, { method: "DELETE" });
    if (res.ok) {
      setOpen(null);
      void load();
    } else setError(res.error ?? "Could not delete.");
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">
          Every chat with the AI receptionist, and what it collected.
        </p>
        <span className="text-[12px] text-muted-foreground">
          {loading ? "Loading…" : `${rows.length} shown`}
        </span>
      </div>

      {error && <p className="mb-3 text-[13px] text-red-600">{error}</p>}

      {!loading && rows.length === 0 ? (
        <Empty>No conversations yet. They appear here as soon as someone uses the chat widget.</Empty>
      ) : (
        <TableShell
          minWidth={880}
          head={
            <>
              <Th>Patient</Th>
              <Th>Wants</Th>
              <Th>Contact</Th>
              <Th>Stage</Th>
              <Th>Msgs</Th>
              <Th>Last active</Th>
              <Th>Actions</Th>
            </>
          }
        >
          {rows.map((c) => (
            <tr key={c.id} className="hover:bg-secondary/40">
              <Td>
                <div className="font-medium text-foreground">{c.patientName ?? "Anonymous"}</div>
                {c.urgentFlag && <Pill tone="red">urgent</Pill>}
              </Td>
              <Td>
                <div>{c.treatment ?? "—"}</div>
                {c.summary && (
                  <div className="mt-1 max-w-[240px] text-[12px] text-muted-foreground">
                    {c.summary}
                  </div>
                )}
              </Td>
              <Td className="text-[12px] text-muted-foreground">
                {c.contactPhone ?? c.contactEmail ?? "—"}
              </Td>
              <Td>
                <Pill tone={LEAD_TONE[c.leadStatus] ?? "muted"}>{c.leadStatus}</Pill>
                {c._count.appointments > 0 && <Pill tone="green">booked</Pill>}
              </Td>
              <Td className="text-[12px] text-muted-foreground">{c._count.messages}</Td>
              <Td className="whitespace-nowrap text-[12px] text-muted-foreground">
                {fmtDate(c.lastActivityAt)}
              </Td>
              <Td>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => void view(c.id)}
                    className="text-left text-[12px] text-primary hover:underline"
                  >
                    Read
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(c.id)}
                    className="text-left text-[11px] text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </Td>
            </tr>
          ))}
        </TableShell>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}
          role="presentation"
        >
          <div
            role="dialog"
            aria-label="Conversation transcript"
            className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="font-display text-lg font-medium tracking-tightest text-foreground">
                  {open.patientName ?? "Anonymous"}
                </p>
                <p className="text-[12px] text-muted-foreground">
                  {[open.treatment, open.contactPhone, open.contactEmail]
                    .filter(Boolean)
                    .join(" · ") || "No details collected"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(null)}
                aria-label="Close transcript"
                className="rounded-full p-1.5 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {open.appointments.length > 0 && (
              <div className="border-b border-border bg-primary/10 px-5 py-3 text-[12.5px]">
                Booked:{" "}
                {open.appointments
                  .map((a) => `${a.reference} (${a.treatment}, ${a.status})`)
                  .join(", ")}
              </div>
            )}

            <div className="flex-1 space-y-2.5 overflow-y-auto px-5 py-4">
              {open.messages.map((m) => (
                <div
                  key={m.id}
                  className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={
                      "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed " +
                      (m.role === "user"
                        ? "rounded-br-sm bg-foreground text-background"
                        : "rounded-bl-sm bg-secondary text-foreground")
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
