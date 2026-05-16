"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Average baskets based on developer brief specialties
const SPECIALTIES = [
  { name: "Plomberie", avgBasket: 220, emoji: "🚰" },
  // { name: "Électricité", avgBasket: 180, emoji: "⚡" },
  // { name: "Chauffage", avgBasket: 250, emoji: "🔥" },
  // { name: "Serrurerie", avgBasket: 160, emoji: "🔑" },
  // { name: "Climatisation", avgBasket: 240, emoji: "❄️" },
  // { name: "Vitrerie", avgBasket: 190, emoji: "🪟" },
];

const benefits = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
        <path d="m9 14 2 2 4-4" />
      </svg>
    ),
    title: "Missions qualifiées par IA",
    desc: "Recevez uniquement des demandes qui correspondent à votre spécialité, filtrées et vérifiées.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="12" x="2" y="6" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M6 12h.01M18 12h.01" />
      </svg>
    ),
    title: "Revenus prévisibles",
    desc: "Accédez à un tableau de bord en temps réel de vos missions, revenus et paiements sécurisés.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Profil certifié Nova",
    desc: "La certification Nova rassure les clients et vous positionne parmi les artisans les plus fiables.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    title: "Notifications push",
    desc: "Recevez les nouvelles missions d'urgence directement sur votre téléphone. Acceptez en un clic.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
    title: "App artisan dédiée",
    desc: "GPS, PDF d'intervention, signature électronique — gérez tout sur le terrain depuis votre smartphone.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
    title: "Réputation récompensée",
    desc: "Les meilleurs avis clients boostent votre visibilité et votre accès aux interventions priorisées.",
  },
];

export default function DevenirPartenairePage() {
  const [missionsPerWeek, setMissionsPerWeek] = useState(10);
  const [selectedSpecialty, setSelectedSpecialty] = useState(SPECIALTIES[0]);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    specialty: "",
    siret: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Earnings calculation: (Missions * AvgBasket) * 4 weeks * 0.8 (minus 20% commission)
  const monthlyEarnings = useMemo(() => {
    const gross = missionsPerWeek * selectedSpecialty.avgBasket * 4.33; // Average weeks per month
    return Math.round(gross * 0.8); // 20% Nova commission
  }, [missionsPerWeek, selectedSpecialty]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("== NEW ARTISAN LEAD ==");
    console.log(formData);
    setIsSubmitted(true);
    alert("Candidature envoyée ! Nous vous contacterons sous 48h.");
  };

  return (
    <div className="page-wrap bg-bg-body">
      <Header />

      <div className="relative w-full min-h-[35vh] flex items-end pb-12 pt-32 mt-[-5.5rem] bg-bg-alt overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0 bg-dots opacity-40"></div>
        <div className="container relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4 border border-primary/20">
            Artisans Certifiés
          </span>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-dk mb-6 max-w-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Développez votre activité avec{" "}
            <span className="text-primary italic">Nova Intervention</span>
          </h1>
          <p className="text-lg md:text-xl text-text-muted max-w-2xl leading-relaxed">
            Rejoignez l'élite des artisans français. Accédez à un flux constant
            de missions qualifiées par IA dans votre zone.
          </p>
        </div>
      </div>

      <main className="container py-16">
        {/* REVENUE SIMULATOR SECTION */}
        <section className="mb-24">
          <div className="bg-primary-dk rounded-[2.5rem] p-8 md:p-14 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-lt opacity-10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2
                  className="text-3xl md:text-4xl font-extrabold mb-6"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Simulez vos revenus mensuels
                </h2>
                <p className="text-white/70 text-lg mb-10 leading-relaxed">
                  Ajustez vos paramètres pour estimer votre chiffre d'affaires
                  net après commission{" "}
                  <span className="text-white font-bold">Nova</span>.
                </p>

                <div className="space-y-10">
                  {/* Specialty Picker */}
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-wider text-white/50 mb-4">
                      Votre métier
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {SPECIALTIES.map((spec) => (
                        <button
                          key={spec.name}
                          onClick={() => setSelectedSpecialty(spec)}
                          className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all flex items-center gap-2
                            ${
                              selectedSpecialty.name === spec.name
                                ? "bg-white text-primary-dk border-white shadow-lg"
                                : "bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
                            }
                          `}
                        >
                          <span>{spec.emoji}</span>
                          {spec.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Volume Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-bold uppercase tracking-wider text-white/50">
                        Missions par semaine
                      </label>
                      <span className="text-3xl font-black text-white">
                        {missionsPerWeek}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="40"
                      value={missionsPerWeek}
                      onChange={(e) =>
                        setMissionsPerWeek(parseInt(e.target.value))
                      }
                      className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                    <div className="flex justify-between text-xs text-white/40 mt-2 font-bold px-1">
                      <span>1</span>
                      <span>20</span>
                      <span>40</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center backdrop-blur-sm shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
                <p className="text-white/60 font-bold uppercase tracking-widest text-sm mb-4">
                  Estimation de vos revenus nets
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span
                    className="text-6xl md:text-7xl font-black text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {monthlyEarnings.toLocaleString()}
                  </span>
                  <span className="text-3xl font-bold text-white/80">€</span>
                </div>
                <p className="text-white/40 font-medium">
                  Par mois (Net après commission)
                </p>

                <div className="w-full h-px bg-white/10 my-8"></div>

                <div className="grid grid-cols-2 w-full gap-4">
                  <div className="text-left">
                    <p className="text-white/50 text-xs font-bold uppercase mb-1">
                      Marge Nova
                    </p>
                    <p className="text-white text-lg font-bold">20%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/50 text-xs font-bold uppercase mb-1">
                      Paiements
                    </p>
                    <p className="text-white text-lg font-bold text-green-400">
                      J+1
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Main Content: Benefits */}
          <div className="lg:col-span-7">
            <h2
              className="text-3xl font-extrabold text-primary-dk mb-10"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Pourquoi travailler avec Nova ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="card group bg-white border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                >
                  <span className="w-14 h-14 flex items-center justify-center rounded-2xl bg-bg-alt text-primary border border-border group-hover:bg-primary group-hover:text-white transition-colors mb-6 shadow-sm">
                    {b.icon}
                  </span>
                  <h3 className="font-bold text-primary-dk text-xl mb-3">
                    {b.title}
                  </h3>
                  <p className="text-text-muted leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: Application Form */}
          <div className="lg:col-span-5 sticky top-8">
            <div className="card-xl bg-white border border-border shadow-2xl overflow-hidden">
              <div className="bg-bg-alt px-8 py-6 border-b border-border">
                <h2 className="text-2xl font-bold text-primary-dk mb-1">
                  Postulez maintenant
                </h2>
                <p className="text-sm text-text-muted">
                  Votre profil sera validé par nos experts sous 48h.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-primary-dk mb-1.5">
                      Prénom
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="form-input w-full bg-bg-alt/50"
                      placeholder="Jean"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary-dk mb-1.5">
                      Nom
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="form-input w-full bg-bg-alt/50"
                      placeholder="Dupont"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary-dk mb-1.5">
                    Téléphone Professionnel
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="form-input w-full bg-bg-alt/50"
                    placeholder="06 00 00 00 00"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-primary-dk mb-1.5">
                      Ville
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="form-input w-full bg-bg-alt/50"
                      placeholder="Paris, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-primary-dk mb-1.5">
                      Métier
                    </label>
                    <select
                      required
                      value={formData.specialty}
                      onChange={(e) =>
                        setFormData({ ...formData, specialty: e.target.value })
                      }
                      className="form-input w-full bg-bg-alt/50"
                      style={{ appearance: "auto" }}
                    >
                      <option value="">Expertise...</option>
                      {SPECIALTIES.map((s) => (
                        <option key={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-primary-dk mb-1.5">
                    Numéro SIRET
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.siret}
                    onChange={(e) =>
                      setFormData({ ...formData, siret: e.target.value })
                    }
                    className="form-input w-full bg-bg-alt/50"
                    placeholder="14 chiffres"
                  />
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-full justify-center py-4 text-lg shadow-lg shadow-primary/20"
                  >
                    Envoyer ma candidature
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-2"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>
                  <p className="text-[10px] text-text-muted text-center mt-4 uppercase tracking-widest font-bold">
                    Paiements sécurisés par Stripe Connect
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
