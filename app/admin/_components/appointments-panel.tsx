"use client";

import { useCallback, useEffect, useState } from "react";

import { adminFetch, fmtDate } from "./admin-client";
import { Empty, Pill, TableShell, Td, Th } from "./panel-ui";

interface Appointment {
  id: string;
  reference: string;
  name: string;
  phone: string;
  email: string | null;
  treatment: string;
  note: string | null;
  reasonForVisit: string | null;
  preferredDate: string | null;
  preferredTime: string | null;
  conversationSummary: string | null;
  source: string;
  status: string;
  createdAt: string;
}

const STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;
const FILTERS = ["all", ...STATUSES] as const;

const TONE: Record<string, "amber" | "primary" | "green" | "red"> = {
  pending: "amber",
  confirmed: "primary",
  completed: "green",
  cancelled: "red",
};

export function AppointmentsPanel() {
  const [rows, setRows] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch(`/api/admin/appointments?status=${filter}`);
    if (res.ok) {
      setRows(res.data.appointments ?? []);
      setError(null);
    } else {
      setError(res.error ?? "Could not load appointments.");
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function setStatus(id: string, status: string) {
    const res = await adminFetch(`/api/admin/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (res.ok) void load();
    else setError(res.error ?? "Could not update.");
  }

  async function remove(id: string) {
    if (!confirm("Delete this appointment request permanently?")) return;
    const res = await adminFetch(`/api/admin/appointments/${id}`, { method: "DELETE" });
    if (res.ok) void load();
    else setError(res.error ?? "Could not delete.");
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={
              "rounded-full px-3 py-1.5 text-[12px] capitalize transition-colors " +
              (filter === f
                ? "bg-primary text-primary-foreground"
                : "border border-border text-foreground/70 hover:text-foreground")
            }
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-[12px] text-muted-foreground">
          {loading ? "Loading…" : `${rows.length} shown`}
        </span>
      </div>

      {error && <p className="mb-3 text-[13px] text-red-600">{error}</p>}

      {!loading && rows.length === 0 ? (
        <Empty>No appointment requests yet.</Empty>
      ) : (
        <TableShell
          minWidth={940}
          head={
            <>
              <Th>Ref</Th>
              <Th>Patient</Th>
              <Th>Treatment</Th>
              <Th>Preferred</Th>
              <Th>Source</Th>
              <Th>Status</Th>
              <Th>Received</Th>
              <Th>Actions</Th>
            </>
          }
        >
          {rows.map((a) => (
            <tr key={a.id} className="hover:bg-secondary/40">
              <Td className="font-mono text-[12px]">{a.reference}</Td>
              <Td>
                <div className="font-medium text-foreground">{a.name}</div>
                <div className="text-[12px] text-muted-foreground">{a.phone}</div>
                {a.email && <div className="text-[12px] text-muted-foreground">{a.email}</div>}
              </Td>
              <Td>
                <div>{a.treatment}</div>
                {(a.conversationSummary || a.reasonForVisit || a.note) && (
                  <div className="mt-1 max-w-[260px] text-[12px] text-muted-foreground">
                    {a.conversationSummary ?? a.reasonForVisit ?? a.note}
                  </div>
                )}
              </Td>
              <Td className="text-[12px] text-muted-foreground">
                {[a.preferredDate, a.preferredTime].filter(Boolean).join(" · ") || "—"}
              </Td>
              <Td>
                <Pill tone={a.source === "chatbot" ? "primary" : "muted"}>{a.source}</Pill>
              </Td>
              <Td>
                <Pill tone={TONE[a.status] ?? "muted"}>{a.status}</Pill>
              </Td>
              <Td className="whitespace-nowrap text-[12px] text-muted-foreground">
                {fmtDate(a.createdAt)}
              </Td>
              <Td>
                <div className="flex flex-col gap-1.5">
                  <select
                    value={a.status}
                    onChange={(e) => void setStatus(a.id, e.target.value)}
                    aria-label={`Status for ${a.reference}`}
                    className="rounded-md border border-border bg-card px-2 py-1 text-[12px]"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => void remove(a.id)}
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
    </section>
  );
}
