"use client";

import { useState } from "react";
import ProfileForm from "@/components/dashboard/ProfileForm";
import {
  ProfileHeaderCard,
  type ProfileSnapshot,
} from "@/components/profile/ProfileHeaderCard";
import { resolveAvatarUrl } from "@/lib/auth/avatar";
import type { AuthUser, Profile } from "@/types/domain";

export function ProfilePageClient({
  user,
  profile,
}: {
  user: AuthUser;
  profile: Profile | null;
}) {
  const [snapshot, setSnapshot] = useState<ProfileSnapshot>(() => ({
    avatarUrl: resolveAvatarUrl(user, profile),
    address: profile?.address ?? "",
    city: profile?.city ?? user.city ?? "",
    phone: profile?.phone ?? user.phone ?? "",
  }));

  return (
    <div className="space-y-8">
      <header>
        <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">
          Profil
        </p>
        <h1
          className="text-4xl font-extrabold text-primary-dk tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Mes informations
        </h1>
      </header>

      <ProfileHeaderCard user={user} profile={profile} snapshot={snapshot} />

      <section className="card p-8 bg-white border border-border rounded-4xl shadow-sm">
        <ProfileForm
          user={user}
          profile={profile}
          onSnapshotChange={setSnapshot}
        />
      </section>
    </div>
  );
}
