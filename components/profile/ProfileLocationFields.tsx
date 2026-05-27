"use client";

import { useCallback, useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { GoogleMapsProvider } from "@/components/maps/GoogleMapsProvider";
import { AddressAutocomplete } from "@/components/maps/AddressAutocomplete";
import { useGeocodeAddress } from "@/hooks/useGeocodeAddress";
import { useReverseGeocode } from "@/hooks/useReverseGeocode";
import { FormField, inputClassName } from "@/components/forms/FormField";
import type { LatLng } from "@/lib/maps/config";

type Props = {
  address: string;
  onAddressChange: (address: string) => void;
  city: string;
  onCityChange: (city: string) => void;
  latitude: number | null;
  longitude: number | null;
  onCoordsChange: (coords: LatLng | null) => void;
  gpsError?: string;
  addressError?: string;
  isArtisan?: boolean;
};

function ProfileLocationFieldsInner({
  address,
  onAddressChange,
  city,
  onCityChange,
  latitude,
  longitude,
  onCoordsChange,
  gpsError,
  addressError,
  isArtisan,
}: Props) {
  const { geocode, ready: geocodeReady } = useGeocodeAddress();
  const { reverseGeocode, ready: reverseReady } = useReverseGeocode();
  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);

  const applyReverse = useCallback(
    async (coords: LatLng) => {
      if (!reverseReady) return;
      setIsResolvingAddress(true);
      const result = await reverseGeocode(coords);
      setIsResolvingAddress(false);
      if (result) {
        onAddressChange(result.formattedAddress);
        if (result.city) onCityChange(result.city);
      }
    },
    [reverseGeocode, reverseReady, onAddressChange, onCityChange],
  );

  useEffect(() => {
    if (
      latitude != null &&
      longitude != null &&
      !address.trim() &&
      reverseReady
    ) {
      void applyReverse({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude, address, reverseReady, applyReverse]);

  const captureGps = () => {
    if (!navigator.geolocation) {
      alert("Géolocalisation non supportée.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        onCoordsChange(coords);
        await applyReverse(coords);
        setIsLocating(false);
      },
      () => {
        alert("Impossible d'obtenir votre position.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const geocodeManualAddress = async () => {
    if (!address.trim() || !geocodeReady) return;
    setIsGeocoding(true);
    const result = await geocode(address);
    setIsGeocoding(false);
    if (result) {
      onCoordsChange(result.coords);
      if (result.city) onCityChange(result.city);
    } else {
      alert(
        "Adresse introuvable. Choisissez une suggestion Google ou vérifiez l'orthographe.",
      );
    }
  };

  const coordsLabel =
    latitude != null && longitude != null
      ? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
      : null;

  return (
    <div className="rounded-2xl bg-bg-alt border border-border p-5 space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm font-bold text-primary-dk flex items-center gap-2">
            <MapPin size={18} className="text-primary" />
            Adresse & position GPS
          </p>
          <p className="text-xs text-text-muted mt-1">
            {isArtisan
              ? "Votre adresse est dérivée de la géolocalisation Google Maps."
              : "Utilisée pour vos demandes d'intervention et la carte."}
          </p>
        </div>
        <button
          type="button"
          onClick={captureGps}
          disabled={isLocating || isResolvingAddress}
          className="btn btn-outline btn-sm shrink-0"
        >
          {isLocating
            ? "GPS…"
            : isResolvingAddress
              ? "Adresse…"
              : coordsLabel
                ? "Actualiser GPS"
                : "Ma position GPS"}
        </button>
      </div>

      <FormField
        label="Adresse"
        htmlFor="profile-address"
        error={addressError ?? gpsError}
        hint="Suggestions Google ou validez après saisie"
        required
      >
        <AddressAutocomplete
          id="profile-address"
          value={address}
          onChange={onAddressChange}
          onPlaceSelect={({ address: addr, coords, city: c }) => {
            onAddressChange(addr);
            onCoordsChange(coords);
            if (c) onCityChange(c);
          }}
          className={inputClassName(!!(addressError || gpsError))}
          placeholder="Numéro, rue, code postal, ville…"
        />
      </FormField>

      <div className="flex flex-wrap gap-2 items-center">
        {geocodeReady && (
          <button
            type="button"
            onClick={geocodeManualAddress}
            disabled={isGeocoding || !address.trim()}
            className="text-xs font-bold text-primary hover:underline disabled:opacity-50"
          >
            {isGeocoding ? "Géocodage…" : "Valider l'adresse sur la carte"}
          </button>
        )}
        {coordsLabel && (
          <span className="text-xs text-text-muted font-mono">
            GPS : {coordsLabel}
          </span>
        )}
      </div>

      {gpsError && !addressError && (
        <p className="form-error" role="alert">
          {gpsError}
        </p>
      )}
    </div>
  );
}

export function ProfileLocationFields(props: Props) {
  return (
    <GoogleMapsProvider>
      <ProfileLocationFieldsInner {...props} />
    </GoogleMapsProvider>
  );
}
