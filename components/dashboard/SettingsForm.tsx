"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface SettingsFormProps {
  user: {
    user_metadata?: {
      settings?: {
        emailAlerts?: boolean;
        smsAlerts?: boolean;
        availability?: string;
      };
    };
  };
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const supabase = createClient();
  const metadata = user.user_metadata ?? {};
  const initialSettings = metadata.settings ?? {
    emailAlerts: true,
    smsAlerts: false,
    availability: "Disponible",
  };

  const [emailAlerts, setEmailAlerts] = useState(
    initialSettings.emailAlerts ?? true,
  );
  const [smsAlerts, setSmsAlerts] = useState(
    initialSettings.smsAlerts ?? false,
  );
  const [availability, setAvailability] = useState(
    initialSettings.availability ?? "Disponible",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      data: {
        ...metadata,
        settings: {
          emailAlerts,
          smsAlerts,
          availability,
        },
      },
    });

    setLoading(false);
    setMessage(
      error
        ? "Impossible de sauvegarder les paramètres."
        : "Paramètres sauvegardés.",
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <label className="space-y-2 block">
          <span className="text-sm font-bold text-primary-dk">
            Alertes email
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={`btn btn-sm ${emailAlerts ? "btn-primary" : "btn-outline"}`}
              onClick={() => setEmailAlerts(true)}
            >
              Activées
            </button>
            <button
              type="button"
              className={`btn btn-sm ${!emailAlerts ? "btn-primary" : "btn-outline"}`}
              onClick={() => setEmailAlerts(false)}
            >
              Désactivées
            </button>
          </div>
        </label>
        <label className="space-y-2 block">
          <span className="text-sm font-bold text-primary-dk">Alertes SMS</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={`btn btn-sm ${smsAlerts ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSmsAlerts(true)}
            >
              Activées
            </button>
            <button
              type="button"
              className={`btn btn-sm ${!smsAlerts ? "btn-primary" : "btn-outline"}`}
              onClick={() => setSmsAlerts(false)}
            >
              Désactivées
            </button>
          </div>
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-bold text-primary-dk">
          Statut de disponibilité
        </span>
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

      <button
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={loading}
      >
        {loading ? "Sauvegarde..." : "Enregistrer"}
      </button>
      {message && <p className="text-sm text-primary-dk">{message}</p>}
    </form>
  );
}
