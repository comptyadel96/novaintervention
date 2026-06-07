"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { FormField, inputClassName } from "@/components/forms/FormField";
import { AddressAutocomplete } from "@/components/maps/AddressAutocomplete";
import { GoogleMapsProvider } from "@/components/maps/GoogleMapsProvider";
import { useGeocodeAddress } from "@/hooks/useGeocodeAddress";
import type { LatLng } from "@/lib/maps/config";
import {
  validateAddress,
  validateEmail,
  validateName,
  validatePhone,
} from "@/lib/forms/validate";

export type DemanderFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
};

type Props = {
  formData: DemanderFormData;
  setFormData: React.Dispatch<React.SetStateAction<DemanderFormData>>;
  coords: LatLng | null;
  setCoords: (c: LatLng | null) => void;
  cityHint: string | null;
  setCityHint: (c: string | null) => void;
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
      <p className="text-sm text-text-muted -mt-2 mb-1">
        Aucun compte requis pour l&apos;instant. Nous créons votre espace client
        automatiquement et vous envoyons un email de confirmation.
      </p>

      {formError && (
        <div className="form-banner-error" role="alert">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField
          label="Prénom"
          htmlFor="demand-firstName"
          error={fieldErrors.firstName}
          required
        >
          <input
            id="demand-firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className={inputClassName(!!fieldErrors.firstName)}
            placeholder="Jean"
            autoComplete="given-name"
          />
        </FormField>
        <FormField
          label="Nom"
          htmlFor="demand-lastName"
          error={fieldErrors.lastName}
          required
        >
          <input
            id="demand-lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className={inputClassName(!!fieldErrors.lastName)}
            placeholder="Dupont"
            autoComplete="family-name"
          />
        </FormField>
      </div>

      <FormField
        label="Email"
        htmlFor="demand-email"
        error={fieldErrors.email}
        hint="Pour confirmer votre compte et recevoir le suivi de l'intervention"
        required
      >
        <input
          id="demand-email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          className={inputClassName(!!fieldErrors.email)}
          placeholder="jean.dupont@email.com"
          autoComplete="email"
        />
      </FormField>

      <FormField
        label="Téléphone d'urgence"
        htmlFor="demand-phone"
        error={fieldErrors.phone}
        hint="10 chiffres minimum — l'artisan vous contactera sur ce numéro"
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
          Position GPS exacte requise pour orienter l&apos;artisan vers vous.
          Utilisez les suggestions Google Places, validez l&apos;adresse ou la
          géolocalisation.
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
            Position GPS enregistrée
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
          disabled={isSubmitting}
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
  formData: DemanderFormData,
  coords: LatLng | null,
): Record<string, string> {
  const errors: Record<string, string> = {};
  const firstNameCheck = validateName(formData.firstName, "prénom");
  const lastNameCheck = validateName(formData.lastName, "nom");
  const emailCheck = validateEmail(formData.email);
  const phoneCheck = validatePhone(formData.phone);
  const addressCheck = validateAddress(formData.address);
  if (!firstNameCheck.valid) errors.firstName = firstNameCheck.message!;
  if (!lastNameCheck.valid) errors.lastName = lastNameCheck.message!;
  if (!emailCheck.valid) errors.email = emailCheck.message!;
  if (!phoneCheck.valid) errors.phone = phoneCheck.message!;
  if (!addressCheck.valid) errors.address = addressCheck.message!;
  if (!coords?.lat || !coords?.lng) {
    errors.location =
      "Indiquez une adresse (suggestion Google), validez-la ou utilisez la géolocalisation.";
  }
  return errors;
}
