"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { ConfidenceBadge } from "@/components/passport/ConfidenceBadge";
import { HealthBadge } from "@/components/passport/HealthBadge";
import { getErrorMessage } from "@/lib/api/errors";
import { EQUIPMENT_CATEGORY_LABELS } from "@/lib/passport/labels";
import { passportApi } from "@/services/api/passport";
import type {
  EquipmentCategory,
  EquipmentInput,
  PassportEquipment,
} from "@/types/passport";

const CATEGORIES = Object.keys(
  EQUIPMENT_CATEGORY_LABELS,
) as EquipmentCategory[];

function formatDate(value?: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

export function PassportEquipments({
  buildingId,
  equipments,
  readOnly,
  onChange,
  onMutated,
}: {
  buildingId: string;
  equipments: PassportEquipment[];
  readOnly: boolean;
  onChange: (equipments: PassportEquipment[]) => void;
  onMutated?: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<EquipmentInput>({
    category: "heating",
    name: "",
    brand: "",
    installedAt: "",
  });

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim()) {
      setError("Donnez un nom à l'équipement.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const created = await passportApi.addEquipment(buildingId, {
        ...draft,
        name: draft.name.trim(),
        brand: draft.brand?.trim() || undefined,
        installedAt: draft.installedAt || null,
      });
      onChange([...equipments, created]);
      setDraft({ category: "heating", name: "", brand: "", installedAt: "" });
      setAdding(false);
      onMutated?.();
    } catch (err) {
      setError(getErrorMessage(err, "Ajout de l'équipement impossible."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (equipmentId: string) => {
    try {
      await passportApi.deleteEquipment(equipmentId);
      onChange(equipments.filter((item) => item.id !== equipmentId));
      onMutated?.();
    } catch (err) {
      setError(getErrorMessage(err, "Suppression impossible."));
    }
  };

  return (
    <section className="card p-8 bg-white border border-border rounded-[2rem] shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="page-h3 mb-1">Équipements</h2>
          <p className="text-sm text-text-muted">
            Chaudière, chauffe-eau, climatisation, VMC, toiture…
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
              <label className="form-label" htmlFor="equipment-category">
                Catégorie
              </label>
              <select
                id="equipment-category"
                className="form-input"
                value={draft.category}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    category: event.target.value as EquipmentCategory,
                  })
                }
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {EQUIPMENT_CATEGORY_LABELS[category]}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="equipment-name">
                Nom
              </label>
              <input
                id="equipment-name"
                className="form-input"
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
                placeholder="Chaudière gaz salle de bain"
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-field">
              <label className="form-label" htmlFor="equipment-brand">
                Marque / modèle
              </label>
              <input
                id="equipment-brand"
                className="form-input"
                value={draft.brand ?? ""}
                onChange={(event) =>
                  setDraft({ ...draft, brand: event.target.value })
                }
                placeholder="Saunier Duval"
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="equipment-installed">
                Installé le
              </label>
              <input
                id="equipment-installed"
                className="form-input"
                type="date"
                value={draft.installedAt ?? ""}
                onChange={(event) =>
                  setDraft({ ...draft, installedAt: event.target.value })
                }
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer l'équipement"}
          </button>
        </form>
      )}

      {equipments.length === 0 ? (
        <p className="text-sm text-text-muted italic">
          Aucun équipement enregistré. Ajoutez votre chaudière ou votre
          chauffe-eau pour recevoir les rappels d&apos;entretien.
        </p>
      ) : (
        <ul className="space-y-3">
          {equipments.map((equipment) => {
            const installed = formatDate(equipment.installedAt);
            const nextService = formatDate(equipment.nextServiceAt);
            return (
              <li
                key={equipment.id}
                className="flex flex-wrap items-start justify-between gap-4 p-5 border border-border rounded-2xl"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                    {EQUIPMENT_CATEGORY_LABELS[equipment.category]}
                  </p>
                  <p className="page-h4 mb-1">{equipment.name}</p>
                  <p className="text-sm text-text-muted">
                    {[
                      equipment.brand,
                      installed && `installé en ${installed}`,
                      nextService && `prochain entretien ${nextService}`,
                    ]
                      .filter(Boolean)
                      .join(" • ") || "Aucune information complémentaire"}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <ConfidenceBadge level={equipment.confidence} />
                  <HealthBadge health={equipment.health} />
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleDelete(equipment.id)}
                      aria-label={`Supprimer ${equipment.name}`}
                      className="p-2 rounded-xl text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
