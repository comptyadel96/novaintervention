import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Devenir partenaire artisan – Nova Intervention",
  description: "Rejoignez le réseau Nova Intervention. Accédez à des missions qualifiées, augmentez vos revenus et bénéficiez d'un profil certifié.",
};

const benefits = [
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"/><path d="m9 14 2 2 4-4"/></svg>, title: "Missions qualifiées par IA", desc: "Recevez uniquement des demandes qui correspondent à votre spécialité, filtrées et vérifiées." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>, title: "Revenus prévisibles", desc: "Accédez à un tableau de bord en temps réel de vos missions, revenus et paiements sécurisés." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, title: "Profil certifié Nova", desc: "La certification Nova rassure les clients et vous positionne parmi les artisans les plus fiables." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>, title: "Notifications push", desc: "Recevez les nouvelles missions d'urgence directement sur votre téléphone. Acceptez en un clic." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>, title: "App artisan dédiée", desc: "GPS, PDF d'intervention, signature électronique — gérez tout sur le terrain depuis votre smartphone." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>, title: "Réputation récompensée", desc: "Les meilleurs avis clients boostent votre visibilité et votre accès aux interventions priorisées." },
];

export default function DevenirPartenairePage() {
  return (
    <div className="page-wrap bg-bg-body">
      <Header />

      <div className="relative w-full min-h-[30vh] flex items-end pb-12 pt-28 mt-[-5.5rem] bg-bg-alt overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0 bg-dots opacity-50"></div>
        <div className="container relative z-10">
          <p className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Rejoindre le réseau</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-dk mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Développez votre activité avec Nova Intervention
          </h1>
          <p className="text-lg text-text-muted max-w-2xl leading-relaxed">
            Accédez à un flux constant de demandes qualifiées, travaillez à votre rythme et fidélisez grâce à la plateforme.
          </p>
        </div>
      </div>

      <main className="container py-16 flex flex-col xl:flex-row gap-12">
        
        {/* Left Col: Benefits */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="card bg-white border border-border hover:border-primary transition-colors flex flex-col">
                <span className="w-12 h-12 flex items-center justify-center rounded-xl bg-bg-alt text-primary border border-border shadow-sm mb-4">
                  {b.icon}
                </span>
                <h3 className="font-bold text-primary-dk text-lg mb-2">{b.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Form */}
        <div className="w-full xl:w-[450px]">
          <div className="card-xl bg-white border border-border shadow-lg sticky top-8">
            <h2 className="text-2xl font-bold text-primary-dk mb-2">Postulez maintenant</h2>
            <p className="text-sm text-text-muted mb-6">
              Votre profil sera validé manuellement. Délai estimé : 48h.
            </p>
            <form className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-primary-dk mb-1.5">Prénom</label>
                  <input type="text" className="form-input bg-bg-body border border-border text-primary-dk rounded-xl focus:ring-primary focus:border-primary w-full px-4 py-3" placeholder="Jean" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-dk mb-1.5">Nom</label>
                  <input type="text" className="form-input bg-bg-body border border-border text-primary-dk rounded-xl focus:ring-primary focus:border-primary w-full px-4 py-3" placeholder="Dupont" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary-dk mb-1.5">Téléphone Pro</label>
                <input type="tel" className="form-input bg-bg-body border border-border text-primary-dk rounded-xl focus:ring-primary focus:border-primary w-full px-4 py-3" placeholder="06 00 00 00 00" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary-dk mb-1.5">Ville principale</label>
                <input type="text" className="form-input bg-bg-body border border-border text-primary-dk rounded-xl focus:ring-primary focus:border-primary w-full px-4 py-3" placeholder="Paris, Lyon…" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary-dk mb-1.5">Spécialité</label>
                <select className="form-input bg-bg-body border border-border text-primary-dk rounded-xl focus:ring-primary focus:border-primary w-full px-4 py-3" style={{ appearance: "auto" }}>
                  <option value="">Sélectionnez une expertise</option>
                  <option>Plomberie</option>
                  <option>Électricité</option>
                  <option>Chauffage</option>
                  <option>Serrurerie</option>
                  <option>Climatisation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary-dk mb-1.5">Numéro SIRET</label>
                <input type="text" className="form-input bg-bg-body border border-border text-primary-dk rounded-xl focus:ring-primary focus:border-primary w-full px-4 py-3" placeholder="Numéro SIRET valide" />
              </div>
              <button type="submit" className="btn btn-primary w-full justify-center mt-2">
                Envoyer ma candidature →
              </button>
              <p className="text-xs text-text-muted text-center mt-2">
                Vos données sont sécurisées selon notre politique RGPD.
              </p>
            </form>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
