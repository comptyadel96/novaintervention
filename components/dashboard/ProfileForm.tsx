"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { UserAvatar } from "@/components/user/UserAvatar";
import { resolveAvatarUrl } from "@/lib/auth/avatar";
import { notifySessionRefresh } from "@/lib/auth/session-events";
import { ProfileLocationFields } from "@/components/profile/ProfileLocationFields";
import type { ProfileSnapshot } from "@/components/profile/ProfileHeaderCard";
import { FormField, inputClassName } from "@/components/forms/FormField";
import { clientProfilesApi } from "@/services/api/client";
import type { AuthUser, Profile } from "@/types/domain";
import { resolveRole } from "@/lib/auth/display";
import { hasProfilePhone } from "@/lib/auth/profile-completion";
import { resolveProfilePhone } from "@/lib/auth/resolve-phone";
import {
  validateCity,
  validateName,
  validatePhone,
} from "@/lib/forms/validate";

interface ProfileFormProps {
  user: AuthUser;
  profile: Profile | null;
  onSnapshotChange?: (snapshot: ProfileSnapshot) => void;
}

const TRADES = [
  { value: "plomberie", label: "Plomberie" },
  { value: "electricite", label: "Électricité" },
  { value: "chauffage", label: "Chauffage" },
  { value: "clim", label: "Climatisation" },
  { value: "serrurerie", label: "Serrurerie" },
  { value: "vitrerie", label: "Vitrerie" },
];

function buildSnapshot(
  user: AuthUser,
  profile: Profile | null,
  state: {
    avatarUrl: string;
    address: string;
    city: string;
    phone: string;
  },
): ProfileSnapshot {
  return {
    avatarUrl: state.avatarUrl || resolveAvatarUrl(user, profile),
    address: state.address,
    city: state.city,
    phone: state.phone,
  };
}

export default function ProfileForm({
  user,
  profile,
  onSnapshotChange,
}: ProfileFormProps) {
  const router = useRouter();
  const role = resolveRole(user, profile);
  const isArtisan = role === "artisan";

  const [firstName, setFirstName] = useState(
    profile?.first_name ?? user.firstName ?? "",
  );
  const [lastName, setLastName] = useState(
    profile?.last_name ?? user.lastName ?? "",
  );
  const [phone, setPhone] = useState(() => resolveProfilePhone(user, profile));
  const phoneKnown = hasProfilePhone(user, profile);
  const [city, setCity] = useState(profile?.city ?? user.city ?? "");
  const [address, setAddress] = useState(profile?.address ?? "");
  const [trade, setTrade] = useState(profile?.specialty ?? "plomberie");
  const [availability, setAvailability] = useState(
    user.availability ?? "Disponible",
  );
  const [latitude, setLatitude] = useState<number | null>(
    profile?.latitude ?? null,
  );
  const [longitude, setLongitude] = useState<number | null>(
    profile?.longitude ?? null,
  );
  const [avatarUrl, setAvatarUrl] = useState(
    () => resolveAvatarUrl(user, profile) ?? "",
  );
  const [avatarCacheBust, setAvatarCacheBust] = useState<number>(() =>
    Date.now(),
  );
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [messageIsError, setMessageIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const pushSnapshot = (patch: Partial<ProfileSnapshot>) => {
    onSnapshotChange?.(
      buildSnapshot(user, profile, {
        avatarUrl: patch.avatarUrl ?? avatarUrl,
        address: patch.address ?? address,
        city: patch.city ?? city,
        phone: patch.phone ?? phone,
      }),
    );
  };

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    setMessage(null);
    try {
      const updated = await clientProfilesApi.uploadAvatar(file);
      const nextUrl =
        updated.avatar_url ?? resolveAvatarUrl(user, updated) ?? "";
      const bust = Date.now();
      setAvatarUrl(nextUrl);
      setAvatarCacheBust(bust);
      pushSnapshot({ avatarUrl: nextUrl });
      notifySessionRefresh();
      router.refresh();
      setMessage("Photo de profil mise à jour.");
      setMessageIsError(false);
    } catch {
      setMessage("Impossible d'envoyer la photo de profil.");
      setMessageIsError(true);
    }
    setAvatarUploading(false);
    e.target.value = "";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setMessageIsError(false);

    const errors: Record<string, string> = {};
    const fn = validateName(firstName, "prénom");
    const ln = validateName(lastName, "nom");
    const ph = validatePhone(phone);
    const cityCheck = validateCity(city);
    if (!fn.valid) errors.firstName = fn.message!;
    if (!ln.valid) errors.lastName = ln.message!;
    if (!ph.valid) errors.phone = ph.message!;
    if (!cityCheck.valid) errors.city = cityCheck.message!;
    if (!address.trim()) {
      errors.address = "Indiquez une adresse (suggestion Google ou validation).";
    }
    if (latitude == null || longitude == null) {
      errors.gps =
        "Enregistrez votre position via GPS ou validez l'adresse sur la carte.";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setLoading(true);

    try {
      const payload: Record<string, unknown> = {
        first_name: firstName,
        last_name: lastName,
        phone,
        city,
        address: address.trim(),
        availability,
        latitude,
        longitude,
      };
      if (isArtisan) {
        payload.specialty = trade;
      }

      const updated = await clientProfilesApi.updateMe(payload);
      const nextAddress = updated.address ?? address;
      setAddress(nextAddress);
      pushSnapshot({
        address: nextAddress,
        city: updated.city ?? city,
        phone: updated.phone ?? phone,
      });
      notifySessionRefresh();
      router.refresh();
      setMessage(
        isArtisan
          ? "Profil mis à jour. Vous pouvez recevoir des missions à proximité."
          : "Profil mis à jour avec succès.",
      );
      setMessageIsError(false);
    } catch {
      setMessage(
        "Impossible de sauvegarder le profil. Vérifiez votre connexion.",
      );
      setMessageIsError(true);
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border">
        <UserAvatar
          user={{ ...user, avatarUrl: avatarUrl || user.avatarUrl }}
          profile={
            profile
              ? { ...profile, avatar_url: avatarUrl || profile.avatar_url }
              : null
          }
          size="lg"
          cacheBust={avatarCacheBust}
        />
        <div>
          <p className="text-sm font-bold text-primary-dk mb-2">
            Photo de profil
          </p>
          <label className="btn btn-outline btn-sm inline-flex items-center gap-2 cursor-pointer">
            <Camera size={16} />
            {avatarUploading ? "Envoi…" : "Changer la photo"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={avatarUploading}
              onChange={handleAvatarChange}
            />
          </label>
          <p className="text-xs text-text-muted mt-2">
            La photo se met à jour immédiatement après l&apos;envoi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          label="Prénom"
          htmlFor="profile-firstName"
          error={fieldErrors.firstName}
          required
        >
          <input
            id="profile-firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClassName(!!fieldErrors.firstName)}
            autoComplete="given-name"
          />
        </FormField>
        <FormField
          label="Nom"
          htmlFor="profile-lastName"
          error={fieldErrors.lastName}
          required
        >
          <input
            id="profile-lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputClassName(!!fieldErrors.lastName)}
            autoComplete="family-name"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          label="Téléphone"
          htmlFor="profile-phone"
          error={fieldErrors.phone}
          hint={
            phoneKnown
              ? "Visible et modifiable — enregistré à l'inscription ou sur cette page"
              : "10 chiffres minimum (ex. 06 12 34 56 78)"
          }
          required
        >
          <input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              pushSnapshot({ phone: e.target.value });
            }}
            className={inputClassName(!!fieldErrors.phone)}
            autoComplete="tel"
          />
        </FormField>
        <FormField
          label="Ville"
          htmlFor="profile-city"
          error={fieldErrors.city}
          required
        >
          <input
            id="profile-city"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              pushSnapshot({ city: e.target.value });
            }}
            className={inputClassName(!!fieldErrors.city)}
            autoComplete="address-level2"
          />
        </FormField>
      </div>

      {isArtisan && (
        <label className="block">
          <span className="text-sm font-bold text-primary-dk">
            Métier / spécialité
          </span>
          <select
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            className="form-input mt-2 w-full"
          >
            {TRADES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      )}

      <ProfileLocationFields
        address={address}
        onAddressChange={(v) => {
          setAddress(v);
          pushSnapshot({ address: v });
        }}
        city={city}
        onCityChange={setCity}
        latitude={latitude}
        longitude={longitude}
        onCoordsChange={(coords) => {
          if (coords) {
            setLatitude(coords.lat);
            setLongitude(coords.lng);
          } else {
            setLatitude(null);
            setLongitude(null);
          }
        }}
        gpsError={fieldErrors.gps}
        addressError={fieldErrors.address}
        isArtisan={isArtisan}
      />

      {isArtisan && !profile?.is_verified && (
        <p className="text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
          Votre compte artisan doit être vérifié par un administrateur avant de
          recevoir des offres.
        </p>
      )}

      <label className="block">
        <span className="text-sm font-bold text-primary-dk">Disponibilité</span>
        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="form-input mt-2 w-full"
        >
          <option>Disponible</option>
          <option>Occupé</option>
          <option>Indisponible</option>
        </select>
      </label>

      <button
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={loading}
      >
        {loading ? "Sauvegarde..." : "Mettre à jour le profil"}
      </button>

      {message && (
        <p
          className={`text-sm font-medium rounded-xl px-4 py-3 ${
            messageIsError
              ? "text-red-800 bg-red-50 border border-red-200"
              : "text-green-800 bg-green-50 border border-green-200"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
