"use client";

import { useEffect, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { parsePlaceCity } from "@/lib/maps/geo";
import type { LatLng } from "@/lib/maps/config";

export type PlaceSelection = {
  address: string;
  coords: LatLng;
  city?: string;
};

type InputProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: PlaceSelection) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

function AddressAutocompleteInput({
  id,
  value,
  onChange,
  onPlaceSelect,
  placeholder,
  className,
  disabled,
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");
  const onSelectRef = useRef(onPlaceSelect);
  onSelectRef.current = onPlaceSelect;

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "fr" },
      fields: ["formatted_address", "geometry", "address_components", "name"],
    });

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const loc = place.geometry?.location;
      if (!loc) return;

      const address =
        place.formatted_address ??
        place.name ??
        inputRef.current?.value ??
        "";

      onChange(address);
      onSelectRef.current({
        address,
        coords: { lat: loc.lat(), lng: loc.lng() },
        city: parsePlaceCity(place.address_components),
      });
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [places, onChange]);

  return (
    <input
      ref={inputRef}
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      autoComplete="off"
    />
  );
}

/** À utiliser à l'intérieur de `<GoogleMapsProvider>`. */
export function AddressAutocomplete(props: InputProps) {
  return <AddressAutocompleteInput {...props} />;
}
