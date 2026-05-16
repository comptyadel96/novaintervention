"use client";

import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  PieChart,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

const graphPanels = [
  {
    title: "Clients cette semaine",
    subtitle: "+18%",
    points: [40, 55, 75, 62, 85, 90, 78],
    labels: ["L", "M", "M", "J", "V", "S", "D"],
  },
  {
    title: "Revenus du mois",
    subtitle: "+14%",
    points: [50, 60, 72, 80, 90, 95, 110],
    labels: ["S1", "S2", "S3", "S4", "S5", "S6", "S7"],
  },
  {
    title: "6 derniers mois",
    subtitle: "+32%",
    points: [62, 70, 74, 82, 88, 96],
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"],
  },
  {
    title: "Performance annuelle",
    subtitle: "+42%",
    points: [68, 72, 75, 80, 86, 92, 98],
    labels: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7"],
  },
];

export function ArtisanView({ user, profile, stats }: { user: any; profile?: any; stats?: any }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col gap-6 lg:flex-row lg:justify-between lg:items-end">
        <div>
          <p className="text-primary font-bold uppercase tracking-widest text-xs mb-2">
            Tableau de bord Artisan
          </p>
          <h1
            className="text-4xl font-extrabold text-primary-dk tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Bonjour, {user.user_metadata?.first_name || "Artisan"}
          </h1>
          <p className="mt-3 text-sm text-text-muted max-w-2xl">
            Votre tableau de bord vous permet de suivre vos interventions, vos
            clients et vos revenus en un coup d'œil.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-3xl bg-white border border-border p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3 text-green-600">
              <Wallet size={20} />
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-text-muted">
                Portefeuille
              </span>
            </div>
            <p className="text-3xl font-extrabold text-primary-dk">8</p>
            <p className="text-sm text-text-muted">
              Nouvelles demandes cette semaine
            </p>
          </div>
          <div className="rounded-3xl bg-white border border-border p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3 text-primary">
              <Users size={20} />
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-text-muted">
                Clients
              </span>
            </div>
            <p className="text-3xl font-extrabold text-primary-dk">24</p>
            <p className="text-sm text-text-muted">Clients actifs ce mois-ci</p>
          </div>
          <div className="rounded-3xl bg-white border border-border p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-3 text-orange-500">
              <PieChart size={20} />
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-text-muted">
                Retenue
              </span>
            </div>
            <p className="text-3xl font-extrabold text-primary-dk">72%</p>
            <p className="text-sm text-text-muted">
              Clients fidèles sur 6 mois
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.9fr] gap-8">
        <section className="card p-8 bg-white border border-border rounded-[2.5rem] shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-primary-dk">
                Portefeuille et performance
              </h2>
              <p className="text-sm text-text-muted mt-2">
                Visualisez votre activité et vos revenus sur les derniers
                cycles.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-bg-alt px-4 py-2 text-sm font-bold text-primary-dk">
              <BarChart3 size={16} /> Suivi multi-périodes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="rounded-4xl bg-bg-alt p-5 border border-border">
              <p className="text-xs uppercase tracking-[0.25em] font-bold text-text-muted mb-3">
                Revenus ce mois
              </p>
              <p className="text-3xl font-black text-primary-dk">3 450 €</p>
              <p className="text-sm text-text-muted mt-2">
                En hausse de 14 % par rapport au mois dernier.
              </p>
            </div>
            <div className="rounded-4xl bg-bg-alt p-5 border border-border">
              <p className="text-xs uppercase tracking-[0.25em] font-bold text-text-muted mb-3">
                Clients cette semaine
              </p>
              <p className="text-3xl font-black text-primary-dk">8</p>
              <p className="text-sm text-text-muted mt-2">
                Nouveaux rendez-vous et interventions confirmés.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-4xl bg-white border border-border p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-primary-dk">
                  Clients de la semaine
                </p>
                <span className="text-xs uppercase tracking-[0.25em] text-text-muted">
                  7 jours
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {["Lun", "Mar", "Mer", "Jeu"].map((day, index) => (
                  <div key={day} className="space-y-2 text-center">
                    <div className="h-24 rounded-3xl bg-primary/10 flex items-end justify-center overflow-hidden">
                      <div
                        className={`w-full bg-primary rounded-t-3xl`}
                        style={{ height: `${40 + index * 12}%` }}
                      />
                    </div>
                    <p className="text-xs text-text-muted">{day}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-4xl bg-white border border-border p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-primary-dk">
                  Opportunités clients
                </p>
                <span className="text-xs uppercase tracking-[0.25em] text-text-muted">
                  A jour
                </span>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Nouvelles demandes", value: 5 },
                  { label: "Devis envoyés", value: 3 },
                  { label: "Clients chauds", value: 2 },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <p className="text-sm text-text-muted">{item.label}</p>
                    <p className="text-base font-bold text-primary-dk">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="card p-8 bg-white border border-border rounded-[2.5rem] shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-extrabold text-primary-dk">
                Comptabilité rapide
              </h2>
              <span className="text-xs uppercase tracking-[0.25em] text-text-muted">
                Bilan
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: "Total facturé", value: "9 120 €", icon: Wallet },
                {
                  label: "Paiements reçus",
                  value: "7 850 €",
                  icon: CheckCircle2,
                },
                { label: "Factures à relancer", value: "2", icon: ShieldCheck },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl bg-bg-alt p-4 border border-border flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-3xl bg-white border border-border flex items-center justify-center text-primary">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-dk">
                      {item.label}
                    </p>
                    <p className="text-xl font-black text-primary-dk">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-text-muted">
              Suivi rapide des factures et des encaissements. Idéal pour garder
              une vue globale sans gestion comptable poussée.
            </p>
          </section>

          <section className="card p-8 bg-white border border-border rounded-[2.5rem] shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-extrabold text-primary-dk">
                Clients récents
              </h2>
              <span className="text-xs uppercase tracking-[0.25em] text-text-muted">
                7 jours
              </span>
            </div>
            <div className="space-y-4">
              {[
                { name: "Marie L.", service: "Fuite cuisine", amount: "120 €" },
                { name: "Sonia D.", service: "Chauffe-eau", amount: "450 €" },
                { name: "Donna B.", service: "Débouchage", amount: "95 €" },
              ].map((client) => (
                <div
                  key={client.name}
                  className="rounded-3xl bg-bg-alt p-4 border border-border"
                >
                  <p className="font-bold text-primary-dk">{client.name}</p>
                  <p className="text-sm text-text-muted">{client.service}</p>
                  <p className="text-sm font-bold text-primary-dk mt-2">
                    {client.amount}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <section className="card p-8 bg-white border border-border rounded-[2.5rem] shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-primary-dk">
              Graphes d'activité
            </h2>
            <p className="text-sm text-text-muted mt-2">
              Suivez vos clients et vos revenus semaine, mois, six mois et
              année.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-bg-alt px-4 py-2 text-sm font-bold text-primary-dk">
            <CalendarDays size={16} /> Dernière mise à jour
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {graphPanels.map((panel) => (
            <div
              key={panel.title}
              className="rounded-4xl border border-border bg-bg-alt p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-primary-dk">
                    {panel.title}
                  </p>
                  <p className="text-xs text-text-muted">
                    Analyse sur plusieurs périodes
                  </p>
                </div>
                <span className="text-sm font-bold text-primary">
                  {panel.subtitle}
                </span>
              </div>
              <div className="flex items-end gap-2 h-36">
                {panel.points.map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-3xl bg-primary/20"
                    style={{ height: `${value}%` }}
                  />
                ))}
              </div>
              <div className="mt-4 flex justify-between text-[11px] uppercase tracking-[0.25em] text-text-muted">
                {panel.labels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
