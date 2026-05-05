"use client";

import { CheckCircle2, Clock, MapPin, TrendingUp, Users } from "lucide-react";

export function ArtisanView({ user }: { user: any }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end">
        <div>
          <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">Tableau de bord Artisan</p>
          <h1 className="text-4xl font-extrabold text-primary-dk tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            Bonjour, {user.user_metadata?.first_name || "Artisan"}
          </h1>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-border shadow-sm">
          <span className="text-sm font-bold text-text-muted px-2">Disponibilité</span>
          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500">
            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Missions accomplies", value: "24", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
          { label: "Revenus ce mois", value: "3 450 €", icon: TrendingUp, color: "text-primary", bg: "bg-primary/5" },
          { label: "Note moyenne", value: "4.9/5", icon: Users, color: "text-orange-500", bg: "bg-orange-50" },
        ].map((stat, i) => (
          <div key={i} className="card p-6 bg-white border border-border rounded-[2rem] shadow-sm flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-text-muted">{stat.label}</p>
              <p className="text-2xl font-black text-primary-dk">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Missions en cours */}
        <section className="card p-8 bg-white border border-border rounded-[2.5rem] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-extrabold text-primary-dk">Missions urgentes</h2>
            <button className="text-primary font-bold text-sm hover:underline">Voir tout</button>
          </div>
          <div className="space-y-4">
            <div className="p-5 bg-bg-alt/50 rounded-3xl border border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-3">
                <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase tracking-wider">Urgence Immédiate</span>
                <span className="text-xs font-bold text-text-muted flex items-center gap-1">
                  <Clock size={12} /> il y a 5 min
                </span>
              </div>
              <h3 className="font-bold text-primary-dk mb-1 group-hover:text-primary transition-colors text-lg">Fuite d'eau - Cuisine</h3>
              <p className="text-sm text-text-muted mb-4 flex items-center gap-1">
                <MapPin size={14} /> 12 Rue de la Paix, Paris
              </p>
              <div className="flex gap-2">
                <button className="btn btn-primary btn-sm flex-1 justify-center rounded-xl py-3">Accepter</button>
                <button className="btn btn-outline btn-sm flex-1 justify-center rounded-xl py-3 border-border">Refuser</button>
              </div>
            </div>
          </div>
        </section>

        {/* Historique récent */}
        <section className="card p-8 bg-white border border-border rounded-[2.5rem] shadow-sm">
          <h2 className="text-xl font-extrabold text-primary-dk mb-6">Activité récente</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex gap-4 items-start pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="text-sm font-bold text-primary-dk">Mission terminée : Débouchage</p>
                  <p className="text-xs text-text-muted">Aujourd'hui à 14:30 • +120 €</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
