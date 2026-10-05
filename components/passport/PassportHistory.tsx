"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus } from "lucide-react";

import { ConfidenceBadge } from "@/components/passport/ConfidenceBadge";
import { getErrorMessage } from "@/lib/api/errors";
import { EVENT_KIND_LABELS } from "@/lib/passport/labels";
import { passportApi } from "@/services/api/passport";
import type {
  PassportEvent,
  PassportEventInput,
  PassportEventKind,
} from "@/types/passport";

const KINDS = Object.keys(EVENT_KIND_LABELS) as PassportEventKind[];

function todayInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function PassportHistory({
  buildingId,
  events,
  readOnly,
  onChange,
  onMutated,
}: {
  buildingId: string;
  events: PassportEvent[];
  readOnly: boolean;
  onChange: (events: PassportEvent[]) => void;
  onMutated?: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<PassportEventInput>({
    kind: "note",
    title: "",
    description: "",
    occurredAt: todayInputValue(),
    professionalName: "",
  });

  const sorted = [...events].sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim()) {
      setError("Donnez un titre à cet événement.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const created = await passportApi.addEvent(buildingId, {
        kind: draft.kind,
        title: draft.title.trim(),
        description: draft.description?.trim() || undefined,
        occurredAt: draft.occurredAt || undefined,
        professionalName: draft.professionalName?.trim() || undefined,
        price: draft.price,
      });
      onChange([created, ...events]);
      setDraft({
        kind: "note",
        title: "",
        description: "",
        occurredAt: todayInputValue(),
        professionalName: "",
      });
      setAdding(false);
      onMutated?.();
    } catch (err) {
      setError(getErrorMessage(err, "Ajout à l'historique impossible."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="card p-8 bg-white border border-border rounded-[2rem] shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="page-h3 mb-1">Historique du bâtiment</h2>
          <p className="text-sm text-text-muted">
            Interventions, entretiens et travaux, avec leurs preuves.
          </p>
        </div>
        {!readOnly && (
          <button
            type="button"
            onClick={() => setAdding((value) => !value)}
            className="btn btn-outline btn-sm flex items-center gap-2"
          >
            <Plus size={16} />
            Ajouter
          </button>
        )}
      </div>

      {error && <p className="form-banner-error">{error}</p>}

      {adding && (
        <form
          onSubmit={handleAdd}
          className="mb-6 p-5 bg-bg-alt rounded-2xl space-y-4"
        >
          <div className="grid-2">
            <div className="form-field">
              <label className="form-label" htmlFor="event-kind">
                Type
              </label>
              <select
                id="event-kind"
                className="form-input"
                value={draft.kind}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    kind: event.target.value as PassportEventKind,
                  })
                }
              >
                {KINDS.map((kind) => (
                  <option key={kind} value={kind}>
                    {EVENT_KIND_LABELS[kind]}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="event-date">
                Date
              </label>
              <input
                id="event-date"
                type="date"
                className="form-input"
                value={draft.occurredAt ?? ""}
                onChange={(event) =>
                  setDraft({ ...draft, occurredAt: event.target.value })
                }
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="event-title">
              Titre
            </label>
            <input
              id="event-title"
              className="form-input"
              value={draft.title}
              onChange={(event) =>
                setDraft({ ...draft, title: event.target.value })
              }
              placeholder="Entretien chaudière 2024"
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="event-description">
              Détail (optionnel)
            </label>
            <textarea
              id="event-description"
              className="form-input min-h-[5rem]"
              value={draft.description ?? ""}
              onChange={(event) =>
                setDraft({ ...draft, description: event.target.value })
              }
            />
          </div>

          <div className="grid-2">
            <div className="form-field">
              <label className="form-label" htmlFor="event-pro">
                Professionnel (optionnel)
              </label>
              <input
                id="event-pro"
                className="form-input"
                value={draft.professionalName ?? ""}
                onChange={(event) =>
                  setDraft({ ...draft, professionalName: event.target.value })
                }
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="event-price">
                Montant € (optionnel)
              </label>
              <input
                id="event-price"
                type="number"
                min="0"
                step="0.01"
                className="form-input"
                value={draft.price ?? ""}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    price:
                      event.target.value === ""
                        ? undefined
                        : Number(event.target.value),
                  })
                }
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer l'événement"}
          </button>
        </form>
      )}

      {sorted.length === 0 ? (
        <p className="text-sm text-text-muted italic">
          L&apos;historique se remplit automatiquement à chaque intervention
          Nova terminée. Vous pouvez aussi y ajouter un entretien ou des travaux
          réalisés hors Nova.
        </p>
      ) : (
        <ol className="space-y-10 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-px before:bg-border">
          {sorted.map((event) => (
            <li key={event.id} className="relative pl-12">
              <span className="absolute left-0 top-1 w-9 h-9 bg-white border-2 border-primary rounded-full flex items-center justify-center z-10">
                <span className="w-2.5 h-2.5 bg-primary rounded-full" />
              </span>

              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">
                    {formatDate(event.occurredAt)} •{" "}
                    {EVENT_KIND_LABELS[event.kind]}
                  </p>
                  <h3 className="page-h4 mb-1">{event.title}</h3>
                  {event.description && (
                    <p className="text-sm text-text-muted leading-relaxed">
                      {event.description}
                    </p>
                  )}
                  {event.professionalName && (
                    <p className="text-xs text-text-muted mt-1">
                      Réalisé par {event.professionalName}
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0 space-y-2">
                  {event.price != null && (
                    <p className="text-lg font-black text-primary-dk">
                      {event.price} €
                    </p>
                  )}
                  <ConfidenceBadge level={event.confidence} />
                </div>
              </div>

              {(event.photoBeforeUrl || event.photoAfterUrl) && (
                <div className="flex gap-3 mt-4">
                  {[event.photoBeforeUrl, event.photoAfterUrl]
                    .filter((url): url is string => Boolean(url))
                    .map((url, index) => (
                      <div
                        key={url}
                        className="relative w-28 h-20 rounded-xl overflow-hidden border border-border"
                      >
                        <Image
                          src={url}
                          alt={index === 0 ? "Photo avant" : "Photo après"}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
