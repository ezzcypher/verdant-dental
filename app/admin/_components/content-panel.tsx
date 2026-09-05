"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, ChevronDown } from "lucide-react";

import { adminFetch } from "./admin-client";
import { Empty, Pill } from "./panel-ui";
import type { ContentSpec, FieldSpec } from "./content-specs";

type Row = Record<string, unknown> & { id: string };

/** One panel serving treatments, dentists and knowledge — see content-specs.ts. */
export function ContentPanel({ spec }: { spec: ContentSpec }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch(`/api/admin/${spec.resource}`);
    if (res.ok) {
      setRows(res.data[spec.listKey] ?? []);
      setError(null);
    } else {
      setError(res.error ?? "Could not load.");
    }
    setLoading(false);
  }, [spec.resource, spec.listKey]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(id: string | null, form: HTMLFormElement) {
    const fd = new FormData(form);
    const body: Record<string, unknown> = {};

    for (const f of spec.fields) {
      const raw = fd.get(f.name);
      if (f.kind === "checkbox") {
        body[f.name] = raw === "on";
      } else if (f.kind === "number") {
        const n = Number(raw ?? "");
        if (String(raw ?? "").trim() !== "" && Number.isFinite(n)) body[f.name] = n;
      } else {
        const s = String(raw ?? "").trim();
        if (s) body[f.name] = s;
        else if (id) body[f.name] = undefined;
      }
    }

    const res = await adminFetch(
      id ? `/api/admin/${spec.resource}/${id}` : `/api/admin/${spec.resource}`,
      { method: id ? "PATCH" : "POST", body: JSON.stringify(body) },
    );
    if (res.ok) {
      setEditing(null);
      setCreating(false);
      void load();
    } else {
      setError(res.error ?? "Could not save.");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this permanently?")) return;
    const res = await adminFetch(`/api/admin/${spec.resource}/${id}`, { method: "DELETE" });
    if (res.ok) void load();
    else setError(res.error ?? "Could not delete.");
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-medium tracking-tightest text-foreground">
            {spec.title}
          </h2>
          <p className="mt-1 max-w-xl text-[13px] text-muted-foreground">{spec.blurb}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setCreating((v) => !v);
            setEditing(null);
          }}
          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[13px] font-medium text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          New
        </button>
      </div>

      {error && <p className="mb-3 text-[13px] text-red-600">{error}</p>}

      {creating && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void save(null, e.currentTarget);
          }}
          className="mb-4 rounded-xl border border-primary/40 bg-primary/5 p-4"
        >
          <Fields spec={spec} row={null} />
          <FormActions onCancel={() => setCreating(false)} submitLabel="Create" />
        </form>
      )}

      {loading ? (
        <p className="text-[13px] text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <Empty>Nothing here yet — use “New” to add the first one.</Empty>
      ) : (
        <ul className="space-y-2">
          {rows.map((row) => {
            const isOpen = editing === row.id;
            return (
              <li key={row.id} className="rounded-xl border border-border bg-card">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(isOpen ? null : row.id);
                    setCreating(false);
                  }}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <span className="flex-1">
                    <span className="text-[14px] font-medium text-foreground">
                      {String(row[spec.titleField] ?? "Untitled")}
                    </span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-2">
                      {spec.fields
                        .filter((f) => f.summary && f.name !== spec.titleField && row[f.name])
                        .map((f) => (
                          <span key={f.name} className="text-[12px] text-muted-foreground">
                            {String(row[f.name])}
                          </span>
                        ))}
                      {row.active === false && <Pill tone="red">hidden</Pill>}
                    </span>
                  </span>
                  <ChevronDown
                    className={
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform " +
                      (isOpen ? "rotate-180" : "")
                    }
                  />
                </button>

                {isOpen && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      void save(row.id, e.currentTarget);
                    }}
                    className="border-t border-border p-4"
                  >
                    <Fields spec={spec} row={row} />
                    <FormActions
                      onCancel={() => setEditing(null)}
                      onDelete={() => void remove(row.id)}
                      submitLabel="Save"
                    />
                  </form>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function Fields({ spec, row }: { spec: ContentSpec; row: Row | null }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {spec.fields.map((f) => (
        <div key={f.name} className={f.kind === "textarea" ? "sm:col-span-2" : undefined}>
          <Field f={f} value={row?.[f.name]} />
        </div>
      ))}
    </div>
  );
}

function Field({ f, value }: { f: FieldSpec; value: unknown }) {
  const base =
    "w-full rounded-lg border border-border bg-card px-3 py-2 text-[13px] text-foreground focus-visible:border-primary focus-visible:outline-none";

  if (f.kind === "checkbox") {
    return (
      <label className="flex items-center gap-2 pt-6 text-[13px] text-foreground">
        <input
          type="checkbox"
          name={f.name}
          defaultChecked={value === undefined ? true : Boolean(value)}
          className="h-4 w-4 accent-[hsl(var(--primary))]"
        />
        {f.label}
      </label>
    );
  }

  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {f.label}
      </span>
      {f.kind === "textarea" ? (
        <textarea
          name={f.name}
          rows={4}
          required={f.required}
          defaultValue={value == null ? "" : String(value)}
          placeholder={f.placeholder}
          className={base}
        />
      ) : f.kind === "select" ? (
        <select
          name={f.name}
          required={f.required}
          defaultValue={value == null ? (f.options?.[0] ?? "") : String(value)}
          className={base}
        >
          {f.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={f.kind === "number" ? "number" : "text"}
          name={f.name}
          required={f.required}
          defaultValue={value == null ? "" : String(value)}
          placeholder={f.placeholder}
          className={base}
        />
      )}
    </label>
  );
}

function FormActions({
  onCancel,
  onDelete,
  submitLabel,
}: {
  onCancel: () => void;
  onDelete?: () => void;
  submitLabel: string;
}) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button
        type="submit"
        className="rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-background"
      >
        {submitLabel}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-full border border-border px-4 py-2 text-[13px] text-foreground/70"
      >
        Cancel
      </button>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="ml-auto text-[12px] text-red-600 hover:underline"
        >
          Delete
        </button>
      )}
    </div>
  );
}
