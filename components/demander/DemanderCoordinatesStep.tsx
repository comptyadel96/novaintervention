"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { FormField, inputClassName } from "@/components/forms/FormField";
import { AddressAutocomplete } from "@/components/maps/AddressAutocomplete";
import { GoogleMapsProvider } from "@/components/maps/GoogleMapsProvider";
import { useGeocodeAddress } from "@/hooks/useGeocodeAddress";
import type { LatLng } from "@/lib/maps/config";
import {
  validateAddress,
  validateFullName,
  validatePhone,
} from "@/lib/forms/validate";

type FormData = { fullName: string; phone: string; address: string };

type Props = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  coords: LatLng | null;
  setCoords: (c: LatLng | null) => void;
  cityHint: string | null;
  setCityHint: (c: string | null) => void;
  emailVerified: boolean | null;
  isSubmitting: boolean;
  formError: string | null;
  fieldErrors: Record<string, string>;
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

function DemanderCoordinatesForm({
  formData,
  setFormData,
  coords,
  setCoords,
  cityHint,
  setCityHint,
  emailVerified,
  isSubmitting,
  formError,
  fieldErrors,
  setFieldErrors,
  onBack,
  onSubmit,
}: Props) {
  const { geocode, ready } = useGeocodeAddress();
  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLocating(false);
      },
      () => {
        alert("Impossible de récupérer votre position.");
        setIsLocating(false);
      },
    );
  };

  const handleGeocodeAddress = async () => {
    if (!formData.address.trim()) return;
    setIsGeocoding(true);
    const result = await geocode(formData.address);
    setIsGeocoding(false);
    if (result) {
      setCoords(result.coords);
      if (result.city) setCityHint(result.city);
    } else {
      setFieldErrors((prev) => ({
        ...prev,
        location:
          "Adresse introuvable. Choisissez une suggestion ou utilisez la géolocalisation.",
      }));
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      {emailVerified === false && (
        <div className="mb-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Confirmez votre adresse email depuis le lien reçu par email avant de
          mandater un artisan.{" "}
          <Link href="/dashboard" className="font-bold text-primary underline">
            Tableau de bord
          </Link>
        </div>
      )}

      {formError && (
        <div className="form-banner-error" role="alert">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField
          label="Nom complet"
          htmlFor="demand-fullName"
          error={fieldErrors.fullName}
          required
        >
          <input
            id="demand-fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            className={inputClassName(!!fieldErrors.fullName)}
            placeholder="Jean Dupont"
            autoComplete="name"
          />
        </FormField>
        <FormField
          label="Téléphone d'urgence"
          htmlFor="demand-phone"
          error={fieldErrors.phone}
          hint="10 chiffres minimum"
          required
        >
          <input
            id="demand-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className={inputClassName(!!fieldErrors.phone)}
            placeholder="06 12 34 56 78"
            autoComplete="tel"
          />
        </FormField>
      </div>

      <div>
        <div className="flex justify-between items-end gap-2 flex-wrap mb-1">
          <span className="form-label">
            Adresse d&apos;intervention{" "}
            <span className="text-red-600 font-bold">*</span>
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleGetLocation}
              className="text-xs font-bold text-primary hover:underline"
              disabled={isLocating}
            >
              {isLocating ? "Localisation…" : "Ma position GPS"}
            </button>
            {ready && (
              <button
                type="button"
                onClick={handleGeocodeAddress}
                className="text-xs font-bold text-primary hover:underline"
                disabled={isGeocoding || !formData.address.trim()}
              >
                {isGeocoding ? "Géocodage…" : "Valider l'adresse"}
              </button>
            )}
          </div>
        </div>
        <p className="text-[11px] text-text-muted mb-2">
          Saisissez une adresse avec les suggestions Google Places, ou validez /
          géolocalisez pour que l&apos;artisan vous trouve sur la carte.
        </p>
        <AddressAutocomplete
          id="demand-address"
          value={formData.address}
          onChange={(address) => {
            setFormData({ ...formData, address });
            setFieldErrors((prev) => {
              const next = { ...prev };
              delete next.address;
              delete next.location;
              return next;
            });
          }}
          onPlaceSelect={({ address, coords: c, city }) => {
            setFormData({ ...formData, address });
            setCoords(c);
            if (city) setCityHint(city);
          }}
          className={inputClassName(
            !!fieldErrors.address || !!fieldErrors.location,
          )}
          placeholder="Numéro, rue, code postal, ville…"
        />
        {(fieldErrors.address || fieldErrors.location) && (
          <p className="form-error" role="alert">
            {fieldErrors.address ?? fieldErrors.location}
          </p>
        )}
        {coords && (
          <p className="text-xs text-green-700 font-medium mt-2 flex items-center gap-1">
            <MapPin size={12} />
            Position enregistrée
            {cityHint ? ` · ${cityHint}` : ""} ({coords.lat.toFixed(4)},{" "}
            {coords.lng.toFixed(4)})
          </p>
        )}
      </div>

      <div className="flex gap-4 mt-4">
        <button
          type="button"
          onClick={onBack}
          className="btn btn-outline w-1/3 justify-center"
          disabled={isSubmitting}
        >
          Retour
        </button>
        <button
          type="submit"
          disabled={isSubmitting || emailVerified === false}
          className="btn btn-primary flex-1 justify-center disabled:opacity-50"
        >
          {isSubmitting ? "Envoi en cours..." : "Mandater l'Artisan !"}
        </button>
      </div>
    </form>
  );
}

export function DemanderCoordinatesStep(props: Props) {
  return (
    <GoogleMapsProvider>
      <DemanderCoordinatesForm {...props} />
    </GoogleMapsProvider>
  );
}

export function validateDemanderCoordinates(
  formData: FormData,
  coords: LatLng | null,
): Record<string, string> {
  const errors: Record<string, string> = {};
  const nameCheck = validateFullName(formData.fullName);
  const phoneCheck = validatePhone(formData.phone);
  const addressCheck = validateAddress(formData.address);
  if (!nameCheck.valid) errors.fullName = nameCheck.message!;
  if (!phoneCheck.valid) errors.phone = phoneCheck.message!;
  if (!addressCheck.valid) errors.address = addressCheck.message!;
  if (!coords?.lat || !coords?.lng) {
    errors.location =
      "Indiquez une adresse (suggestion Google), validez-la ou utilisez la géolocalisation.";
  }
  return errors;
}
