"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, AlertCircle } from "lucide-react";
import { FormField, inputClassName } from "@/components/forms/FormField";
import { UserAvatar } from "@/components/user/UserAvatar";
import { ProfileLocationFields } from "@/components/profile/ProfileLocationFields";
import { clientProfilesApi } from "@/services/api/client";
import { resolveAvatarUrl } from "@/lib/auth/avatar";
import {
  hasProfilePhone,
  missingProfileFields,
  type ProfileCompletionField,
} from "@/lib/auth/profile-completion";
import { resolveProfilePhone } from "@/lib/auth/resolve-phone";
import type { AuthUser, Profile } from "@/types/domain";
import { validatePhone } from "@/lib/forms/validate";
import { getErrorMessage } from "@/lib/api/errors";

export function CompleteProfileForm({
  user,
  profile,
}: {
  user: AuthUser;
  profile: Profile | null;
}) {
  const router = useRouter();
  const missing = missingProfileFields(user, profile);
  const phoneAlreadySet = hasProfilePhone(user, profile);
  const googleAvatar = resolveAvatarUrl(user, profile);

  const [phone, setPhone] = useState(() => resolveProfilePhone(user, profile));
  const [city, setCity] = useState(profile?.city ?? user.city ?? "");
  const [address, setAddress] = useState(profile?.address ?? "");
  const [latitude, setLatitude] = useState<number | null>(
    profile?.latitude ?? null,
  );
  const [longitude, setLongitude] = useState<number | null>(
    profile?.longitude ?? null,
  );
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<"phone" | "location" | "address", string>>
  >({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const errors: Partial<Record<"phone" | "location" | "address", string>> =
      {};

    if (!phoneAlreadySet) {
      const phoneCheck = validatePhone(phone);
      if (!phoneCheck.valid) errors.phone = phoneCheck.message!;
    }

    if (!address.trim()) {
      errors.address = "Indiquez votre adresse (suggestion Google ou GPS).";
    }

    if (latitude == null || longitude == null) {
      errors.location =
        "Enregistrez votre position via GPS ou validez l'adresse.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await clientProfilesApi.updateMe({
        phone: phoneAlreadySet ? resolveProfilePhone(user, profile) : phone,
        city,
        address: address.trim(),
        latitude: latitude!,
        longitude: longitude!,
      });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setFormError(getErrorMessage(err, "Enregistrement impossible."));
      setLoading(false);
    }
  };

  const label = (field: ProfileCompletionField) =>
    missing.includes(field) ? " (requis)" : " (déjà renseigné)";

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-bg-alt border border-border">
        <UserAvatar user={user} profile={profile} size="lg" />
        <div className="text-center sm:text-left">
          <p className="font-bold text-primary-dk">Votre photo</p>
          <p className="text-sm text-text-muted mt-1">
            {googleAvatar
              ? "Photo Google détectée — modifiable dans Mon profil."
              : "Ajoutez une photo dans Mon profil après cette étape."}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 flex gap-3 text-sm text-amber-950">
        <AlertCircle className="shrink-0 mt-0.5" size={18} />
        <p>
          {phoneAlreadySet ? (
            <>
              Votre <strong>téléphone</strong> est déjà enregistré (inscription).
              Il reste à indiquer votre <strong>adresse</strong> et votre{" "}
              <strong>position GPS</strong> (Google Maps).
            </>
          ) : (
            <>
              Indiquez votre <strong>téléphone</strong> et votre{" "}
              <strong>adresse</strong> (via GPS Google Maps). Sans cela, le site
              reste limité.
            </>
          )}
        </p>
      </div>

      {formError && (
        <div className="form-banner-error" role="alert">
          {formError}
        </div>
      )}

      <FormField
        label={`Téléphone mobile${label("phone")}`}
        htmlFor="complete-phone"
        error={fieldErrors.phone}
        hint={
          phoneAlreadySet
            ? "Déjà fourni à l'inscription — modifiable dans Mon profil"
            : "10 chiffres minimum — joignable par l'artisan"
        }
        required={!phoneAlreadySet}
      >
        <div className="relative">
          <Phone
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
          <input
            id="complete-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`${inputClassName(!!fieldErrors.phone)} pl-10${phoneAlreadySet ? " bg-bg-alt text-text-muted" : ""}`}
            placeholder="06 12 34 56 78"
            autoComplete="tel"
            readOnly={phoneAlreadySet}
            aria-readonly={phoneAlreadySet}
          />
        </div>
      </FormField>

      <ProfileLocationFields
        address={address}
        onAddressChange={setAddress}
        city={city}
        onCityChange={setCity}
        latitude={latitude}
        longitude={longitude}
        onCoordsChange={(coords) => {
          if (coords) {
            setLatitude(coords.lat);
            setLongitude(coords.lng);
            setFieldErrors((e) => ({ ...e, location: undefined }));
          } else {
            setLatitude(null);
            setLongitude(null);
          }
        }}
        gpsError={fieldErrors.location}
        addressError={fieldErrors.address}
      />

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full justify-center py-4 text-lg disabled:opacity-50"
      >
        {loading ? "Enregistrement…" : "Enregistrer et accéder au site"}
      </button>
    </form>
  );
}
