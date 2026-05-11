"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface ProfileFormProps {
  user: {
    user_metadata?: {
      first_name?: string;
      phone?: string;
      city?: string;
      availability?: string;
    };
  };
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const supabase = createClient();
  const [firstName, setFirstName] = useState(user.user_metadata?.first_name || "");
  const [phone, setPhone] = useState(user.user_metadata?.phone || "");
  const [city, setCity] = useState(user.user_metadata?.city || "");
  const [availability, setAvailability] = useState(user.user_metadata?.availability || "Disponible");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        phone,
        city,
        availability,
        role: "artisan",
      },
    });

    setLoading(false);

    if (error) {
      setMessage("Impossible de sauvegarder le profil. Vérifiez votre connexion.");
      return;
    }

    setMessage("Profil mis à jour avec succès.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          <span className="text-sm font-bold text-primary-dk">Ville</span>
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Paris"
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

      <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
        {loading ? "Sauvegarde..." : "Mettre à jour le profil"}
      </button>

      {message && <p className="text-sm text-primary-dk">{message}</p>}
    </form>
  );
}
