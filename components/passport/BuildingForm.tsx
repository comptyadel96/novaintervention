"use client";

import { useState } from "react";

import { AddressAutocomplete } from "@/components/maps/AddressAutocomplete";
import { GoogleMapsProvider } from "@/components/maps/GoogleMapsProvider";
import { isGoogleMapsConfigured } from "@/lib/maps/config";
import { BUILDING_KIND_LABELS } from "@/lib/passport/labels";
import type { BuildingInput, BuildingKind } from "@/types/passport";

const KINDS = Object.keys(BUILDING_KIND_LABELS) as BuildingKind[];

export function BuildingForm({
  initial,
  submitLabel = "Créer mon passeport",
  onSubmit,
  onCancel,
}: {
  initial?: Partial<BuildingInput>;
  submitLabel?: string;
  onSubmit: (data: BuildingInput) => Promise<void>;
  onCancel?: () => void;
}) {
  const [label, setLabel] = useState(initial?.label ?? "");
  const [address, setAddress] = useState(initial?.address ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    initial?.lat != null && initial?.lng != null
      ? { lat: initial.lat, lng: initial.lng }
      : null,
  );
  const [kind, setKind] = useState<BuildingKind>(initial?.kind ?? "apartment");
  const [constructionYear, setConstructionYear] = useState(
    initial?.constructionYear ? String(initial.constructionYear) : "",
  );
  const [surfaceM2, setSurfaceM2] = useState(
    initial?.surfaceM2 ? String(initial.surfaceM2) : "",
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!address.trim()) {
      setError("L'adresse du bien est obligatoire.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        label: label.trim() || address.trim(),
        address: address.trim(),
        city: city.trim() || undefined,
        kind,
        constructionYear: constructionYear ? Number(constructionYear) : null,
        surfaceM2: surfaceM2 ? Number(surfaceM2) : null,
        lat: coords?.lat ?? null,
        lng: coords?.lng ?? null,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Enregistrement impossible.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const addressField = isGoogleMapsConfigured() ? (
    <GoogleMapsProvider>
      <AddressAutocomplete
        id="passport-address"
        value={address}
        onChange={setAddress}
        onPlaceSelect={(place) => {
          setAddress(place.address);
          setCoords(place.coords);
          if (place.city) setCity(place.city);
        }}
        placeholder="12 rue de la Paix, 75002 Paris"
        className="form-input"
      />
    </GoogleMapsProvider>
  ) : (
    <input
      id="passport-address"
      className="form-input"
      value={address}
      onChange={(event) => setAddress(event.target.value)}
      placeholder="12 rue de la Paix, 75002 Paris"
    />
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="form-banner-error mb-0">{error}</p>}

      <div className="form-field">
        <label className="form-label" htmlFor="passport-address">
          Adresse du bien *
        </label>
        {addressField}
        <p className="form-hint">
          L&apos;adresse identifie le bâtiment : c&apos;est elle qui porte
          l&apos;historique, pas votre compte.
        </p>
      </div>

      <div className="grid-2">
        <div className="form-field">
          <label className="form-label" htmlFor="passport-label">
            Nom du passeport
          </label>
          <input
            id="passport-label"
            className="form-input"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="Résidence principale"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="passport-kind">
            Type de bien
          </label>
          <select
            id="passport-kind"
            className="form-input"
            value={kind}
            onChange={(event) => setKind(event.target.value as BuildingKind)}
          >
            {KINDS.map((value) => (
              <option key={value} value={value}>
                {BUILDING_KIND_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid-2">
        <div className="form-field">
          <label className="form-label" htmlFor="passport-year">
            Année de construction
          </label>
          <input
            id="passport-year"
            className="form-input"
            type="number"
            min={1700}
            max={new Date().getFullYear()}
            value={constructionYear}
            onChange={(event) => setConstructionYear(event.target.value)}
            placeholder="1975"
          />
        </div>

        <div className="form-field">
          <label className="form-label" htmlFor="passport-surface">
            Surface (m²)
          </label>
          <input
            id="passport-surface"
            className="form-input"
            type="number"
            min={1}
            value={surfaceM2}
            onChange={(event) => setSurfaceM2(event.target.value)}
            placeholder="72"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting}
        >
          {submitting ? "Enregistrement…" : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-outline"
            onClick={onCancel}
            disabled={submitting}
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
