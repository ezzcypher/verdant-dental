"use client";

import { useCallback, useEffect, useState } from "react";

import { adminFetch, fmtDate } from "./admin-client";
import { Empty, Pill, TableShell, Td, Th } from "./panel-ui";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  handled: boolean;
  createdAt: string;
}

export function MessagesPanel() {
  const [rows, setRows] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch("/api/admin/messages");
    if (res.ok) {
      setRows(res.data.messages ?? []);
      setError(null);
    } else {
      setError(res.error ?? "Could not load messages.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggle(id: string, handled: boolean) {
    const res = await adminFetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ handled }),
    });
    if (res.ok) void load();
    else setError(res.error ?? "Could not update.");
  }

  async function remove(id: string) {
    if (!confirm("Delete this message permanently?")) return;
    const res = await adminFetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    if (res.ok) void load();
    else setError(res.error ?? "Could not delete.");
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">Messages from the contact form.</p>
        <span className="text-[12px] text-muted-foreground">
          {loading ? "Loading…" : `${rows.length} shown`}
        </span>
      </div>

      {error && <p className="mb-3 text-[13px] text-red-600">{error}</p>}

      {!loading && rows.length === 0 ? (
        <Empty>No messages yet.</Empty>
      ) : (
        <TableShell
          minWidth={800}
          head={
            <>
              <Th>From</Th>
              <Th>Subject</Th>
              <Th>Message</Th>
              <Th>Received</Th>
              <Th>Actions</Th>
            </>
          }
        >
          {rows.map((m) => (
            <tr key={m.id} className="hover:bg-secondary/40">
              <Td>
                <div className="font-medium text-foreground">{m.name}</div>
                <div className="text-[12px] text-muted-foreground">{m.email}</div>
                {m.handled && <Pill tone="green">handled</Pill>}
              </Td>
              <Td>{m.subject ?? "—"}</Td>
              <Td className="max-w-[320px] whitespace-pre-wrap text-[13px] text-muted-foreground">
                {m.body}
              </Td>
              <Td className="whitespace-nowrap text-[12px] text-muted-foreground">
                {fmtDate(m.createdAt)}
              </Td>
              <Td>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => void toggle(m.id, !m.handled)}
                    className="text-left text-[12px] text-primary hover:underline"
                  >
                    {m.handled ? "Mark unhandled" : "Mark handled"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(m.id)}
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
