"use client";

import { MapPin, Mail, Phone } from "lucide-react";
import { UserAvatar } from "@/components/user/UserAvatar";
import { displayFirstName, displayPhone } from "@/lib/auth/display";
import type { AuthUser, Profile } from "@/types/domain";

export type ProfileSnapshot = {
  avatarUrl?: string;
  address: string;
  city: string;
  phone: string;
};

export function ProfileHeaderCard({
  user,
  profile,
  snapshot,
}: {
  user: AuthUser;
  profile: Profile | null;
  snapshot: ProfileSnapshot;
}) {
  const fullName = [
    profile?.first_name ?? user.firstName,
    profile?.last_name ?? user.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const locationLine =
    snapshot.address.trim() ||
    [snapshot.city, profile?.city].filter(Boolean).join(" — ") ||
    "Adresse non renseignée — complétez le formulaire ci-dessous";

  return (
    <section className="card p-6 sm:p-8 bg-white border border-border rounded-4xl shadow-sm">
      <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
        <UserAvatar
          user={{ ...user, avatarUrl: snapshot.avatarUrl ?? user.avatarUrl }}
          profile={
            profile
              ? {
                  ...profile,
                  avatar_url: snapshot.avatarUrl ?? profile.avatar_url,
                }
              : null
          }
          size="lg"
          cacheBust={snapshot.avatarUrl}
        />
        <div className="flex-1 min-w-0">
          <p className="text-primary font-bold uppercase tracking-widest text-xs mb-1">
            Mon profil
          </p>
          <h2
            className="text-2xl font-extrabold text-primary-dk truncate"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {fullName || displayFirstName(user, profile)}
          </h2>
          <p className="mt-3 text-sm text-primary-dk font-medium flex items-start gap-2">
            <MapPin
              size={16}
              className="text-orange-500 shrink-0 mt-0.5"
            />
            <span className="break-words">{locationLine}</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-text-muted">
            <span className="flex items-center gap-1.5">
              <Mail size={14} className="text-primary" />
              {user.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={14} className="text-primary" />
              {snapshot.phone || displayPhone(user, profile)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
