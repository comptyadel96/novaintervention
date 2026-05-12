"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface ProfileFormProps {
  user: any;
  profile: any;
}

export default function ProfileForm({ user, profile }: ProfileFormProps) {
  const supabase = createClient();
  const [firstName, setFirstName] = useState(profile?.first_name || user.user_metadata?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || user.user_metadata?.last_name || "");
  const [phone, setPhone] = useState(profile?.phone || user.user_metadata?.phone || "");
  const [city, setCity] = useState(profile?.city || user.user_metadata?.city || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [specialty, setSpecialty] = useState(profile?.specialty || "");
  const [availability, setAvailability] = useState(profile?.availability || "Disponible");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const role = profile?.role || user.user_metadata?.role || "client";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    // Update profiles table
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        phone,
        city,
        address,
        specialty,
        availability,
        role: role,
        updated_at: new Date().toISOString(),
      });

    setLoading(false);

    if (error) {
      setMessage({ type: 'error', text: "Erreur lors de la sauvegarde : " + error.message });
      return;
    }

    setMessage({ type: 'success', text: "Profil mis à jour avec succès !" });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-xl text-sm font-medium border ${
          message.type === 'success' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-600'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-primary-dk">Email (Lecture seule)</span>
          <input
            value={user.email}
            disabled
            className="form-input mt-2 w-full bg-slate-50 cursor-not-allowed opacity-70"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-primary-dk">Téléphone</span>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="06 00 00 00 00"
            className="form-input mt-2 w-full"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-primary-dk">Prénom</span>
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Prénom"
            className="form-input mt-2 w-full"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-primary-dk">Nom</span>
          <input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Nom"
            className="form-input mt-2 w-full"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-bold text-primary-dk">Ville</span>
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Paris"
            className="form-input mt-2 w-full"
          />
        </label>
        <label className="block">
          <span className="text-sm font-bold text-primary-dk">Adresse Complète</span>
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="123 rue de la Paix"
            className="form-input mt-2 w-full"
          />
        </label>
      </div>

      {role === "artisan" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-primary-dk">Spécialité</span>
            <input
              value={specialty}
              onChange={(event) => setSpecialty(event.target.value)}
              placeholder="Ex: Plomberie, Électricité..."
              className="form-input mt-2 w-full"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-primary-dk">Disponibilité</span>
            <select
              value={availability}
              onChange={(event) => setAvailability(event.target.value)}
              className="form-input mt-2 w-full"
            >
              <option>Disponible</option>
              <option>Occupé</option>
              <option>Indisponible</option>
            </select>
          </label>
        </div>
      )}

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
        {loading ? "Sauvegarde..." : "Enregistrer mon profil"}
      </button>
    </form>
  );
}
